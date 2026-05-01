import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Search, Target, BookOpen, MessageSquareText, TrendingUp, CheckCircle2 } from 'lucide-react';

const companyData = [
  {
    id: 'google',
    name: 'Google',
    type: 'Top Product / FAANG',
    color: '#4285F4',
    eligibility: 'B.Tech/BE/M.Tech (CS/IT/Circuit branches). No active backlogs. CGPA usually 7.5+ required, but highly variable if competitive programming (CP) profile is extremely strong.',
    skills: ['Advanced DSA', 'System Design (for experienced/backend)', 'C++/Java/Python', 'Graph Theory', 'Dynamic Programming', 'OS & Networking Basics'],
    rounds: [
      { name: 'Online Assessment (OA)', duration: '90 Mins', details: '2 Medium-Hard LeetCode style questions. High accuracy and strict time complexity expected.' },
      { name: 'Technical Round 1 & 2', duration: '45 Mins Each', details: 'Pure algorithmic rounds. Expect 1-2 medium/hard questions on Trees, Graphs, DP, or Linked Lists. Code must be written on a whiteboard/doc.' },
      { name: 'Googlyness / HR', duration: '45 Mins', details: 'Behavioral round based on leadership, handling conflicts, and cultural fit.' }
    ],
    questions: [
      'Find the Kth largest element in an unsorted array (QuickSelect approach).',
      'Word Ladder problem (Shortest path using BFS).',
      'Design a Rate Limiter mechanism (System Design).',
      'Given a matrix, find the longest increasing path (DFS + DP Memoization).'
    ],
    roadmap: [
      'Months 1-2: Master arrays, strings, standard trees, and linked list traversals.',
      'Months 3-4: Deep dive into Dynamic Programming, Graphs, and backtracking paradigms.',
      'Month 5: Practice Google-tagged past questions on LeetCode under strict 45-minute timed constraints.',
      'Month 6: Polish your behavioral answers using the STAR format (Situation, Task, Action, Result).'
    ]
  },
  {
    id: 'amazon',
    name: 'Amazon',
    type: 'Top Product / FAANG',
    color: '#FF9900',
    eligibility: 'B.Tech / MCA. CGPA > 7.0 (or > 65% aggregate). No active backlogs. Very strong problem-solving skills and alignment with Amazon Leadership Principles.',
    skills: ['DSA', 'Object-Oriented Design (OOD)', 'Java/C++', 'Amazon Leadership Principles', 'Core CS'],
    rounds: [
      { name: 'Online Assessment (OA)', duration: '120 Mins', details: '2 DSA coding questions (Medium), followed by a behavioral/leadership simulation questionnaire.' },
      { name: 'Technical Rounds (2-3)', duration: '60 Mins', details: 'Heavy focus on Trees, Hashmaps, and Arrays. Expect them to ask for O(1) or O(N) optimized solutions.' },
      { name: 'Bar Raiser Round', duration: '60 Mins', details: 'A senior interviewer will ask deep behavioral questions based *strictly* on Amazon Leadership Principles mixed with system design.' }
    ],
    questions: [
      'Number of Islands in a grid (BFS/DFS).',
      'Design a Parking Lot / Design an Amazon Locker system (LLD).',
      'Tell me about a time you disagreed with your manager (Leadership Principle: Have Backbone; Disagree and Commit).',
      'Find the missing number in an array, followed by LRU Cache implementation.'
    ],
    roadmap: [
      'Months 1-2: Memorize and practice the 16 Amazon Leadership Principles with personal stories.',
      'Months 3-4: Practice standard LeetCode Medium/Hard questions focusing strongly on HashMaps and Trees.',
      'Month 5: Study basic Low-Level Design (LLD) patterns (Singleton, Factory) for OOD rounds.',
      'Month 6: Take simulated mock interviews focusing on coding while explaining your thought process out loud.'
    ]
  },
  {
    id: 'tcs',
    name: 'TCS (Ninja/Digital/Prime)',
    type: 'Service Based Giant',
    color: '#005CE5',
    eligibility: 'Graduation in current/previous year. 60% or 6 CGPA throughout academics. No active backlogs allowed at the time of joining. Max 2 years academic gap.',
    skills: ['Quantitative Aptitude', 'Verbal/Logical Reasoning', 'C/C++/Java/Python Syntax', 'Basic DSA & Arrays', 'SQL', 'SDLC Concepts'],
    rounds: [
      { name: 'TCS NQT (Online Test)', duration: '120-160 Mins', details: 'Contains Cognitive Skills (Numerical, Verbal, Reasoning) + Programming Logic + Hands-on Coding (2 questions: 1 Easy, 1 Medium).' },
      { name: 'Technical Interview', duration: '40 Mins', details: 'Focuses heavily on your final year project, basic oops, SQL queries, and the programming language you listed on your resume.' },
      { name: 'Managerial & HR Round', duration: '20 Mins', details: 'Situational questions, relocation flexibility, and willingness to work shifts.' }
    ],
    questions: [
      'Write a program to reverse a string without using built-in functions.',
      'What are the 4 pillars of OOPs? Give real-life examples.',
      'Write a SQL query to find the second highest salary of an employee in a table.',
      'Explain the project you mentioned in your resume. What was your specific role?'
    ],
    roadmap: [
      'Months 1-2: Rigorously practice Aptitude, Logical Reasoning, and English Grammar.',
      'Month 3: Learn basic string manipulations and array traversals in C, C++ or Java.',
      'Month 4: Master foundational OOPs definitions and basic SQL queries (Joins, Aggregations).',
      'Month 5: Prepare a solid 3-minute pitch for your final year project and resume.'
    ]
  },
  {
    id: 'infosys',
    name: 'Infosys',
    type: 'Service Based Giant',
    color: '#007CC3',
    eligibility: '60% throughout 10th, 12th, and Graduation (B.E/B.Tech). No active backlogs.',
    skills: ['Aptitude & Puzzle Solving', 'SQL & RDBMS', 'Basic Programming Concepts', 'Testing Basics', 'Good Communication'],
    rounds: [
      { name: 'Online Test', duration: '100 Mins', details: 'Logical Reasoning, Quantitative Aptitude, and Verbal English. Often includes pseudo-code solving rather than scratch programming.' },
      { name: 'Technical Interview', duration: '30-45 Mins', details: 'Resume based. Core subjects like DBMS, OS, and CN. They often ask you to solve simple logic puzzles.' },
      { name: 'HR Interview', duration: '15 Mins', details: 'Standard HR questions about Infosys, relocation, and career goals.' }
    ],
    questions: [
      'What is the difference between TRUNCATE, DELETE, and DROP in SQL?',
      'If you have two buckets of 3L and 5L, how do you measure exactly 4L of water? (Puzzle)',
      'Explain SDLC and the difference between Waterfall and Agile.',
      'Write pseudo-code to check if a number is a palindrome.'
    ],
    roadmap: [
      'Months 1-2: Master classic HR puzzles and pseudo-code tracing.',
      'Month 3: Study core CS subjects theoretically (OS, Networks, DBMS).',
      'Month 4: Practice writing standard logic on paper (fibonacci, prime, palindrome).',
      'Month 5: Take overall mock tests focusing purely on speed and time management within the Aptitude sections.'
    ]
  }
];

export default function CompanyPrep() {
  const [selectedId, setSelectedId] = useState(companyData[0].id);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedCompany = companyData.find(c => c.id === selectedId);
  const filteredCompanies = companyData.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="page-container" style={{ padding: '8rem 1rem 4rem', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
      
      <div style={{ width: '100%', maxWidth: '1200px', display: 'flex', gap: '2rem', flexDirection: 'row', flexWrap: 'wrap' }}>
        
        {/* Left Sidebar - Company Selector */}
        <div className="glass-card" style={{ padding: '0', background: '#FFFFFF', flex: '1 1 300px', alignSelf: 'flex-start', overflow: 'hidden' }}>
          
          <div style={{ padding: '1.5rem', background: '#F8FAFC', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--text-main)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Building2 size={24} color="var(--primary)" /> Target Companies
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', padding: '0.5rem 1rem' }}>
              <Search size={18} color="var(--text-muted)" />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', marginLeft: '0.5rem', color: 'var(--text-main)', fontSize: '0.9rem' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', maxHeight: '600px', overflowY: 'auto' }}>
            {filteredCompanies.length > 0 ? filteredCompanies.map((c) => (
              <div 
                key={c.id} 
                onClick={() => setSelectedId(c.id)}
                style={{ 
                  padding: '1.2rem 1.5rem', 
                  borderBottom: '1px solid rgba(0,0,0,0.05)', 
                  cursor: 'pointer',
                  borderLeft: selectedId === c.id ? `4px solid ${c.color}` : '4px solid transparent',
                  background: selectedId === c.id ? 'rgba(0,0,0,0.02)' : 'transparent',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ fontWeight: 'bold', color: selectedId === c.id ? c.color : 'var(--text-main)', fontSize: '1.1rem' }}>{c.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{c.type}</div>
              </div>
            )) : (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No companies found.</div>
            )}
          </div>

        </div>

        {/* Right Pane - Company Profile */}
        <div style={{ flex: '3 1 600px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <AnimatePresence mode="wait">
            {selectedCompany && (
              <motion.div 
                key={selectedCompany.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
              >
                {/* Header Card */}
                <div className="glass-card" style={{ padding: '3rem', background: '#FFFFFF', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '300px', height: '300px', background: `radial-gradient(circle, ${selectedCompany.color}15 0%, transparent 70%)`, filter: 'blur(40px)', zIndex: 0 }} />
                  
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'inline-block', padding: '0.4rem 1rem', background: `${selectedCompany.color}15`, color: selectedCompany.color, borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '1rem', letterSpacing: '1px' }}>
                      {selectedCompany.type}
                    </div>
                    <h1 style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '1rem' }}>{selectedCompany.name}</h1>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                      {selectedCompany.skills.map(skill => (
                        <span key={skill} style={{ background: '#F8FAFC', padding: '0.3rem 0.8rem', borderRadius: '4px', fontSize: '0.85rem', color: 'var(--text-main)', border: '1px solid rgba(0,0,0,0.1)' }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Eligibility & Rounds Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                  
                  {/* Eligibility */}
                  <div className="glass-card" style={{ padding: '2rem', background: '#FFFFFF' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--text-main)', fontSize: '1.2rem' }}>
                      <Target color={selectedCompany.color} size={22} /> Eligibility Criteria
                    </h3>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                      {selectedCompany.eligibility}
                    </p>
                  </div>

                  {/* Interview Rounds */}
                  <div className="glass-card" style={{ padding: '2rem', background: '#FFFFFF' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--text-main)', fontSize: '1.2rem' }}>
                      <TrendingUp color={selectedCompany.color} size={22} /> Hiring Pipeline
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      {selectedCompany.rounds.map((round, idx) => (
                        <div key={idx} style={{ position: 'relative', paddingLeft: '1.5rem', borderLeft: `2px solid ${selectedCompany.color}40` }}>
                          <div style={{ position: 'absolute', left: '-5px', top: '0', width: '8px', height: '8px', borderRadius: '50%', background: selectedCompany.color }} />
                          <h4 style={{ color: 'var(--text-main)', fontSize: '1rem', marginBottom: '0.2rem' }}>{round.name}</h4>
                          <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 'bold' }}>{round.duration}</span>
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem', lineHeight: '1.5' }}>{round.details}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Specific Questions */}
                <div className="glass-card" style={{ padding: '2rem', background: '#FFFFFF' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--text-main)', fontSize: '1.2rem' }}>
                    <MessageSquareText color={selectedCompany.color} size={22} /> High-Frequency Interview Questions
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {selectedCompany.questions.map((q, qidx) => (
                      <div key={qidx} style={{ padding: '1rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)', color: 'var(--text-muted)', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                        <div style={{ color: selectedCompany.color, fontWeight: 'bold' }}>Q{qidx+1}.</div>
                        <div style={{ lineHeight: '1.5' }}>{q}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Custom Roadmap */}
                <div className="glass-card" style={{ padding: '2rem', background: '#FFFFFF', border: `1px solid ${selectedCompany.color}40` }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--text-main)', fontSize: '1.2rem' }}>
                    <BookOpen color={selectedCompany.color} size={22} /> Suggested Custom Roadmap
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {selectedCompany.roadmap.map((step, rIdx) => (
                      <div key={rIdx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: `${selectedCompany.color}05`, borderRadius: '8px' }}>
                        <CheckCircle2 color={selectedCompany.color} size={24} style={{ flexShrink: 0 }} />
                        <span style={{ color: 'var(--text-main)' }}>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}
