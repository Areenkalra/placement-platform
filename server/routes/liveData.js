const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini
let genAI = null;

router.use((req, res, next) => {
    // Check configuration on every request so server restart isn't strictly needed if they just updated .env while running via nodemon
    // But since they run via node, they'll restart anyway.
    if (!genAI && process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
        genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    }
    next();
});

router.post('/jobs', async (req, res) => {
    try {
        if (!genAI) {
            return res.status(400).json({ error: "GEMINI_API_KEY is not configured in the server .env file." });
        }

        const { skills, location } = req.body;
        const skillsString = Array.isArray(skills) ? skills.join(', ') : (skills || 'software engineering');

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            tools: [{ googleSearch: {} }]
        });

        const prompt = `
            You are an expert technical recruiter API. Your task is to use Google Search to find 5 REAL, CURRENT, and ACTIVE job openings related to the following skills: ${skillsString}.
            Target location preference (if any): ${location || 'Remote or India'}.
            
            CRITICAL INSTRUCTION: You MUST return ONLY a raw JSON array of objects. Do not include any other text, explanations, or markdown code blocks (like \`\`\`json). Just the raw array starting with [ and ending with ].
            Each object in the array must strictly follow this structure:
            {
                "id": "generate_a_unique_string",
                "title": "Job Title (e.g., Software Engineer II)",
                "company": "Company Name",
                "location": "Job Location",
                "type": "Full-Time or Internship",
                "reqCGPA": a number between 6.0 and 9.0 that seems reasonable for this role,
                "reqDSA": a number between 50 and 300 that seems reasonable,
                "reqSkills": ["Array", "of", "3-5", "core", "skills", "required"],
                "salary": "Estimated or real salary range (e.g., ₹15 LPA - ₹25 LPA or $100k - $150k)",
                "url": "A real link to the career page or job posting"
            }
        `;

        const result = await model.generateContent(prompt);
        let responseText = result.response.text();
        
        // Clean up markdown if the AI hallucinated it despite instructions
        responseText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
        
        let jobsData;
        try {
            jobsData = JSON.parse(responseText);
        } catch (parseError) {
            console.error("Gemini API Parse Error. Raw response snippet:", responseText.substring(0, 500));
            return res.status(500).json({ error: "Invalid JSON from AI. Please try again." });
        }
        
        // Enhance with fake recruiters so the frontend doesn't break
        const enhancedJobs = jobsData.map(job => ({
            ...job,
            recruiter: { 
                name: "AI Talent Scout", 
                role: "Live Search Match", 
                initials: "AI", 
                color: "#10B981" 
            }
        }));

        res.json(enhancedJobs);
    } catch (error) {
        console.error("Gemini API Error:", error);
        res.status(500).json({ error: "Failed to fetch live jobs from AI API. Please try again." });
    }
});

router.post('/insights', async (req, res) => {
    try {
        if (!genAI) {
            return res.status(400).json({ error: "GEMINI_API_KEY is not configured." });
        }

        const { companyTier } = req.body;

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            tools: [{ googleSearch: {} }]
        });

        const prompt = `
            Use Google Search to find the latest live hiring trends, recent news, and common interview topics for companies in the ${companyTier} tier (e.g., FAANG, Unicorns, or Service IT).
            Return a short, punchy 3-sentence summary of what these companies are actively hiring for RIGHT NOW and any recent changes in their interview processes. Do NOT use markdown formatting, just plain text.
        `;

        const result = await model.generateContent(prompt);
        res.json({ text: result.response.text() });
    } catch (error) {
        console.error("Gemini API Error:", error);
        res.status(500).json({ error: "Failed to fetch company insights." });
    }
});

router.post('/search', async (req, res) => {
    try {
        if (!genAI) {
            return res.status(400).json({ error: "GEMINI_API_KEY is not configured." });
        }

        const { query, location } = req.body;
        if (!query) {
            return res.status(400).json({ error: "Search query is required." });
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            tools: [{ googleSearch: {} }]
        });

        const prompt = `
            You are a specialized LinkedIn Job Search Engine. 
            Perform a Google Search targeting ONLY LinkedIn jobs using the query: "site:linkedin.com/jobs ${query} ${location || ''}".
            Find 5 REAL, CURRENT, and ACTIVE job postings matching this criteria.
            
            CRITICAL INSTRUCTION: You MUST return ONLY a raw JSON array of objects. Do not include any other text, explanations, or markdown code blocks (like \`\`\`json). Just the raw array starting with [ and ending with ].
            Each object in the array must strictly follow this structure:
            {
                "id": "generate_a_unique_string",
                "title": "Job Title",
                "company": "Company Name",
                "location": "Job Location",
                "type": "Full-Time or Internship etc",
                "salary": "Estimated salary or 'Not disclosed'",
                "postedDate": "When it was posted (e.g., '2 days ago', 'Recently')",
                "url": "A real link to the linkedin.com/jobs posting"
            }
        `;

        const result = await model.generateContent(prompt);
        let responseText = result.response.text();
        
        responseText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
        
        let jobsData;
        try {
            jobsData = JSON.parse(responseText);
        } catch (parseError) {
            console.error("Gemini API Parse Error (Search). Raw response:", responseText.substring(0, 500));
            return res.status(500).json({ error: "Failed to parse LinkedIn jobs from AI API. Please try again." });
        }

        res.json(jobsData);
    } catch (error) {
        console.error("Gemini Search API Error:", error);
        res.status(500).json({ error: "Failed to perform global job search. Please try again." });
    }
});

module.exports = router;
