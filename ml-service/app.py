from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
import numpy as np
import random
import warnings
import PyPDF2
import re
warnings.filterwarnings('ignore')

app = Flask(__name__)
CORS(app)

# Generate a large dataset (2000 rows)
np.random.seed(42)
n_samples = 2000

cgpa = np.random.uniform(5.0, 10.0, n_samples)
dsa_count = np.random.randint(0, 500, n_samples)
projects = np.random.randint(0, 8, n_samples)
internships = np.random.randint(0, 4, n_samples)
certifications = np.random.randint(0, 6, n_samples)
oops_score = np.random.randint(40, 100, n_samples)
cn_score = np.random.randint(40, 100, n_samples)
dbms_score = np.random.randint(40, 100, n_samples)

# Placement chance formula (domain logic simulation)
# Adjusted to include CS Subjects weights
base_chance = (cgpa - 5) / 5 * 20 + (dsa_count / 500) * 20 + (projects / 7) * 15 + (internships / 3) * 10 + (certifications / 5) * 5 + (oops_score / 100) * 10 + (cn_score / 100) * 10 + (dbms_score / 100) * 10
# Add some noise
noise = np.random.normal(0, 5, n_samples)
placement_chance = np.clip(base_chance + noise, 0, 100)

df = pd.DataFrame({
    'cgpa': cgpa,
    'dsaCount': dsa_count,
    'projects': projects,
    'internships': internships,
    'certifications': certifications,
    'oops': oops_score,
    'cn': cn_score,
    'dbms': dbms_score,
    'placement_chance': placement_chance
})

X = df[['cgpa', 'dsaCount', 'projects', 'internships', 'certifications', 'oops', 'cn', 'dbms']]
y = df['placement_chance']

model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X, y)

@app.route('/predict', methods=['POST'])
def predict():
    req = request.get_json() or {}
    
    cgpa_val = float(req.get('cgpa', 0))
    dsa_val = int(req.get('dsaCount', 0))
    projects_val = int(req.get('projects', 0))
    internships_val = int(req.get('internships', 0))
    certifications_val = int(req.get('certifications', 0))
    oops_val = int(req.get('oops', 0))
    cn_val = int(req.get('cn', 0))
    dbms_val = int(req.get('dbms', 0))
    
    features = pd.DataFrame([[cgpa_val, dsa_val, projects_val, internships_val, certifications_val, oops_val, cn_val, dbms_val]], columns=X.columns)
    prediction = model.predict(features)[0]
    
    # Analyze skill gaps
    skill_gaps = []
    recommendations = []
    
    if cgpa_val < 7.5:
        skill_gaps.append("Academics")
        recommendations.append("Focus on improving your CGPA above 7.5.")
    if dsa_val < 150:
        skill_gaps.append("Data Structures and Algorithms")
        recommendations.append("Solve more DSA problems. Aim for at least 150+ problems.")
    if projects_val < 2:
        skill_gaps.append("Practical Projects")
        recommendations.append("Build more full-stack or core domain projects.")
    if internships_val == 0:
        skill_gaps.append("Industry Experience")
        recommendations.append("Try to secure at least one internship.")
    
    # Core Subjects Warnings
    if oops_val < 60:
        skill_gaps.append("Object Oriented Programming (OOPs)")
        recommendations.append("Revise core OOP concepts (Inheritance, Polymorphism, Abstraction).")
    if cn_val < 60:
        skill_gaps.append("Computer Networks (CN)")
        recommendations.append("Study OSI model, TCP/IP, and networking fundamentals.")
    if dbms_val < 60:
        skill_gaps.append("Database Management Systems (DBMS)")
        recommendations.append("Practice SQL queries and study Normalization & ACID properties.")
        
    if prediction > 80 and not recommendations:
        recommendations.append("You are well prepared! Keep practicing mock interviews.")
        
    return jsonify({
        'probability': round(prediction, 2),
        'readinessScore': round(prediction, 2),
        'skillGaps': skill_gaps,
        'recommendations': recommendations
    })

@app.route('/upload-resume', methods=['POST'])
def parse_resume():
    if 'resume' not in request.files:
        return jsonify({'error': 'No resume file uploaded'}), 400
    
    file = request.files['resume']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    try:
        pdf_reader = PyPDF2.PdfReader(file)
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
        
        text_lower = text.lower()
        
        # Resume validation check
        resume_indicators = ['experience', 'education', 'skills', 'projects', 'profile', 'contact', 'university', 'college', 'degree', 'bachelor', 'master', 'cgpa', 'school', 'work', 'objective']
        found_indicators = sum(1 for ind in resume_indicators if ind in text_lower)
        
        if found_indicators < 2:
            return jsonify({'error': 'Kindly upload a real resume. This document does not seem like a resume.'}), 400

        
        # Skill extraction
        skill_keywords = ['react', 'node', 'express', 'mongodb', 'python', 'java', 'c++', 'aws', 'docker', 'sql', 'javascript', 'html', 'css', 'machine learning', 'data structures', 'algorithm', 'kubernetes']
        found_skills = [skill for skill in skill_keywords if skill in text_lower]
        
        # Estimate CGPA (e.g. 8.5)
        cgpa_match = re.search(r'\b([5-9]\.\d{1,2}|10\.0+)\b', text)
        cgpa_val = float(cgpa_match.group(1)) if cgpa_match else 7.5
        
        # Estimate projects
        projects_val = len(re.findall(r'\bproject(s)?\b', text_lower))
        projects_val = min(max(projects_val, 1), 6) # limit to realistic number
        
        # Estimate certifications
        certifs_val = len(re.findall(r'\bcertificat(e|ion|ions)?\b', text_lower))
        certifs_val = min(certifs_val, 5)
        
        # Internships
        intern_val = len(re.findall(r'\bintern(ship|s)?\b', text_lower))
        intern_val = min(intern_val, 3)

        # DSA estimation
        dsa_count = 50
        if 'leetcode' in text_lower or 'hackerrank' in text_lower or 'codeforces' in text_lower:
            dsa_count = 250
        elif 'data structure' in text_lower or 'algorithm' in text_lower:
            dsa_count = 150
            
        # Core Subjects estimation
        oops_score = 60
        if 'oop' in text_lower or 'object oriented' in text_lower or 'java' in text_lower or 'c++' in text_lower:
            oops_score = 85
            
        cn_score = 60
        if 'network' in text_lower or 'osi' in text_lower or 'tcp' in text_lower:
            cn_score = 80
            
        dbms_score = 60
        if 'dbms' in text_lower or 'sql' in text_lower or 'database' in text_lower or 'mongodb' in text_lower:
            dbms_score = 90
            
        return jsonify({
            'cgpa': cgpa_val,
            'dsaCount': dsa_count,
            'projects': projects_val,
            'internships': intern_val,
            'certifications': certifs_val,
            'oops': oops_score,
            'cn': cn_score,
            'dbms': dbms_score,
            'skills': found_skills,
            'message': 'Resume parsed successfully!'
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/analyze-resume-jd', methods=['POST'])
def analyze_resume_jd():
    jd_text = request.form.get('jd', '').lower()
    resume_text = ""
    
    if 'resume_text' in request.form and request.form['resume_text'].strip():
        resume_text = request.form['resume_text']
        resume_text_lower = resume_text.lower()
    elif 'resume' in request.files and request.files['resume'].filename != '':
        file = request.files['resume']
        try:
            pdf_reader = PyPDF2.PdfReader(file)
            for page in pdf_reader.pages:
                resume_text += page.extract_text() + "\n"
            resume_text_lower = resume_text.lower()
            
            # Resume validation check
            resume_indicators = ['experience', 'education', 'skills', 'projects', 'profile', 'contact', 'university', 'college', 'degree', 'bachelor', 'master', 'cgpa', 'school', 'work', 'objective']
            found_indicators = sum(1 for ind in resume_indicators if ind in resume_text_lower)
            if found_indicators < 2:
                return jsonify({'error': 'Kindly upload a real resume. This document does not seem like a resume.'}), 400
        except Exception as e:
            return jsonify({'error': 'Failed to parse PDF.'}), 400
    else:
        return jsonify({'error': 'Please provide a resume PDF or text.'}), 400

    if not jd_text.strip():
        return jsonify({'error': 'Missing job description content'}), 400

    try:
        # Extended tech skills dictionary to search for
        tech_keywords = [
            'react', 'node', 'express', 'mongodb', 'python', 'java', 'c++', 'aws', 
            'docker', 'sql', 'javascript', 'html', 'css', 'machine learning', 
            'data structures', 'algorithm', 'kubernetes', 'typescript', 'next.js',
            'django', 'flask', 'spring boot', 'linux', 'git', 'ci/cd', 'agile',
            'system design', 'rest api', 'graphql', 'redis', 'postgresql'
        ]
        
        required_skills = [skill for skill in tech_keywords if skill in jd_text]
        resume_skills = [skill for skill in tech_keywords if skill in resume_text_lower]
        matched_skills = list(set(required_skills) & set(resume_skills))
        missing_skills = list(set(required_skills) - set(resume_skills))
        
        try:
            from sklearn.feature_extraction.text import TfidfVectorizer
            from sklearn.metrics.pairwise import cosine_similarity
            vectorizer = TfidfVectorizer(stop_words='english')
            tfidf_matrix = vectorizer.fit_transform([jd_text, resume_text_lower])
            cosine_sim = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        except Exception:
            cosine_sim = 0
            
        if required_skills:
            keyword_score = len(matched_skills) / len(required_skills)
            final_score = (keyword_score * 0.5) + (cosine_sim * 0.5)
        else:
            final_score = cosine_sim
            
        # Give a substantial baseline boost so scores are encouraging and generous
        match_percentage = min(100, max(0, int((final_score + 0.45) * 100)))
        
        if not required_skills:
            jd_words = re.findall(r'\b[a-z]{5,}\b', jd_text)
            res_words = set(re.findall(r'\b[a-z]{5,}\b', resume_text_lower))
            from collections import Counter
            common_jd_words = [word for word, count in Counter(jd_words).most_common(20)]
            missing_dynamic = [w for w in common_jd_words if w not in res_words]
            if missing_dynamic:
                missing_skills = missing_dynamic[:5]
            
        tweaks = []
        if missing_skills:
            tweaks.append(f"Your resume is missing essential keywords found in the JD. Consider highlighting experience with: {', '.join(missing_skills[:5])}.")
        if match_percentage < 65:
            tweaks.append("Your matching score is low. Try to align your project descriptions more closely with the JD requirements and re-word your bullet points.")
        if match_percentage >= 80:
            tweaks.append("Excellent match! Your skill profile explicitly aligns with this JD.")
        
        if len(resume_text.split()) < 200:
            tweaks.append("Your resume text seems a bit short. Add more detail to your experiences using action verbs and concrete metrics.")
             
        if not tweaks:
            tweaks.append("Your resume looks strongly aligned with this JD! Ensure formatting is clean and easy to read.")
            
        return jsonify({
            'matchPercentage': match_percentage,
            'matchedSkills': matched_skills,
            'missingSkills': missing_skills,
            'tweaks': tweaks,
            'extractedText': resume_text,
            'message': 'Analysis Complete'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/analyze-interview', methods=['POST'])
def analyze_interview():
    try:
        req = request.get_json() or {}
        question = req.get('question', '').lower()
        answer = req.get('answer', '').lower()
        
        if not answer.strip():
            return jsonify({
                'feedback': "We couldn't hear or register an answer. Please try again.",
                'confidence_score': 0,
                'improvements': ["Ensure your microphone is working or you typed an answer."]
            })
            
        words = answer.split()
        word_count = len(words)
        
        # Filler word detection
        fillers = ['um', 'umm', 'uh', 'like', 'basically', 'actually', 'literally', 'you know', 'sort of', 'kind of']
        filler_count = sum(answer.count(f) for f in fillers)
        filler_density = filler_count / word_count if word_count > 0 else 0
        
        # Base confidence calculation
        confidence_score = 95
        improvements = []
        feedback = "Great answer! You spoke clearly and confidently."
        
        # Length Penalties
        if word_count < 10:
            confidence_score -= 30
            improvements.append("Expand your answer. Give more specific details rather than a one-sentence summary.")
            feedback = "Your answer was a bit too brief."
        elif word_count < 25:
            confidence_score -= 15
            improvements.append("Try to provide an example or a brief story illustrating your point.")
            
        # Filler Penalties
        if filler_density > 0.05:
            confidence_score -= int((filler_density * 100) * 1.5)
            improvements.append(f"We detected {filler_count} filler words ('um', 'like'). Pause, breathe, and slow down instead of filling silence.")
            feedback = "You hesitated a few times. Try to speak more deliberately."
            
        # Basic context check (Very rudimentary "staying on topic" check based on question words)
        q_words = [w for w in question.split() if len(w) > 4]
        if q_words and word_count >= 10:
            relevance = sum(1 for qw in q_words if qw in answer)
            if relevance == 0 and len(q_words) > 1:
                confidence_score -= 20
                improvements.append("Your answer didn't seem to directly address the specifically asked terms.")
                feedback = "Make sure you directly answer the prompt before expanding on tangents."
        
        confidence_score = max(10, min(100, confidence_score)) # Keep within 10-100
        
        return jsonify({
            'feedback': feedback,
            'confidence_score': confidence_score,
            'improvements': improvements
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5001, debug=True)
