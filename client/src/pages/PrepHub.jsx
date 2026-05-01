import React, { useState, useEffect } from 'react';
import { BookOpen, Code, Database, Globe, Lightbulb, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PrepHub() {
  
  const [completed, setCompleted] = useState(() => {
    const saved = localStorage.getItem('prepHubProgress');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('prepHubProgress', JSON.stringify(completed));
  }, [completed]);

  const toggleComplete = (problemId) => {
    setCompleted(prev => ({ ...prev, [problemId]: !prev[problemId] }));
  };

  const resources = [
    {
      title: 'Top DSA Patterns & Algorithms',
      icon: <Code size={30} color="#4F46E5" />,
      desc: 'Master Sliding Window, Two Pointers, Dynamic Programming, and Graph traversal. Focus on LeetCode Mediums.',
      tag: 'Algorithms',
      problems: [
        { id: 'dsa_1', name: 'Two Sum (Array)', url: 'https://leetcode.com/problems/two-sum/' },
        { id: 'dsa_2', name: 'Valid Parentheses (Stack)', url: 'https://leetcode.com/problems/valid-parentheses/' },
        { id: 'dsa_3', name: 'Merge Intervals (Sorting)', url: 'https://leetcode.com/problems/merge-intervals/' },
        { id: 'dsa_4', name: 'Longest Substring Without Repeating (Sliding Window)', url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/' },
        { id: 'dsa_5', name: 'Number of Islands (BFS/DFS)', url: 'https://leetcode.com/problems/number-of-islands/' },
        { id: 'dsa_6', name: 'Coin Change (Dynamic Programming)', url: 'https://leetcode.com/problems/coin-change/' }
      ]
    },
    {
      title: 'OOPs Deep-Dive',
      icon: <BookOpen size={30} color="#10B981" />,
      desc: 'Understand Abstraction, Encapsulation, Inheritance, and Polymorphism.',
      tag: 'Core CS',
      problems: [
        { id: 'oop_1', name: 'GeeksforGeeks OOPs Guide', url: 'https://www.geeksforgeeks.org/object-oriented-programming-in-cpp/' },
        { id: 'oop_2', name: 'Java OOPs Concepts', url: 'https://www.javatpoint.com/java-oops-concepts' },
        { id: 'oop_3', name: 'Difference between Abstract Class & Interface', url: 'https://www.geeksforgeeks.org/difference-between-abstract-class-and-interface-in-java/' }
      ]
    },
    {
      title: 'Database & SQL Mastery',
      icon: <Database size={30} color="#3B82F6" />,
      desc: 'Practice JOINS, Group By, Subqueries, Normalization, Indexing, and ACID properties.',
      tag: 'Core CS',
      problems: [
        { id: 'db_1', name: 'LeetCode Combine Two Tables', url: 'https://leetcode.com/problems/combine-two-tables/' },
        { id: 'db_2', name: 'SQLZoo Interactive Tutorial', url: 'https://sqlzoo.net/' },
        { id: 'db_3', name: 'Database Normalization Explained', url: 'https://www.studytonight.com/dbms/database-normalization.php' },
        { id: 'db_4', name: 'ACID Properties in DBMS', url: 'https://www.geeksforgeeks.org/acid-properties-in-dbms/' }
      ]
    },
    {
      title: 'Computer Networks',
      icon: <Globe size={30} color="#F59E0B" />,
      desc: 'TCP vs UDP, OSI Model Layers, IP Subnetting, HTTP/HTTPS, and DNS resolution steps.',
      tag: 'Core CS',
      problems: [
        { id: 'cn_1', name: 'Top 50 CN Interview Questions', url: 'https://www.geeksforgeeks.org/computer-network-interview-questions/' },
        { id: 'cn_2', name: 'OSI Model Explained', url: 'https://www.cloudflare.com/learning/ddos/glossary/open-systems-interconnection-model-osi/' },
        { id: 'cn_3', name: 'What happens when you type a URL?', url: 'https://github.com/alex/what-happens-when' }
      ]
    },
    {
      title: 'System Design Basics',
      icon: <Lightbulb size={30} color="#9333EA" />,
      desc: 'Learn about Load Balancing, Caching, Microservices, and vertical vs horizontal scaling.',
      tag: 'Advanced',
      problems: [
        { id: 'sys_1', name: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer' },
        { id: 'sys_2', name: 'Design a URL Shortener', url: 'https://www.geeksforgeeks.org/system-design-url-shortening-service/' },
        { id: 'sys_3', name: 'Consistent Hashing Explained', url: 'https://www.toptal.com/big-data/consistent-hashing' }
      ]
    }
  ];

  const totalProblems = resources.reduce((acc, curr) => acc + curr.problems.length, 0);
  const completedCount = Object.values(completed).filter(Boolean).length;
  const progressPercentage = totalProblems > 0 ? Math.round((completedCount / totalProblems) * 100) : 0;

  return (
    <div className="page-container" style={{ alignItems: 'flex-start', paddingTop: '8rem', paddingBottom: '4rem' }}>
      <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ display: 'inline-block', padding: '0.4rem 1rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', borderRadius: '30px', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '1.5rem', letterSpacing: '1px' }}>
            YOUR ROADMAP PROGRESS: {progressPercentage}%
          </div>
          <div style={{ width: '100%', maxWidth: '400px', height: '10px', background: 'rgba(0,0,0,0.08)', borderRadius: '20px', margin: '0 auto 2rem auto', overflow: 'hidden' }}>
            <div style={{ width: `${progressPercentage}%`, height: '100%', background: 'linear-gradient(90deg, #4F46E5, #10B981)', transition: 'width 0.5s ease' }} />
          </div>

          <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem', background: 'linear-gradient(to right, #1E293B, #4F46E5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Ultimate Placement Roadmap
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
            Check off exactly what you need to crack top product and service-based companies. Track your progress directly here.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {resources.map((res, i) => (
            <motion.div 
              key={i} 
              className="glass-card" 
              style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', overflow: 'hidden', background: '#FFFFFF' }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(79, 70, 229, 0.1)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ padding: '0.8rem', background: 'rgba(0,0,0,0.04)', borderRadius: '12px' }}>
                  {res.icon}
                </div>
                <h3 style={{ fontSize: '1.3rem' }}>{res.title}</h3>
              </div>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', flexGrow: 1 }}>{res.desc}</p>
              
              <div style={{ marginTop: '0.5rem', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <strong style={{ fontSize: '0.9rem', color: '#1E293B', opacity: 0.9, marginTop: '1rem' }}>Syllabus List:</strong>
                {res.problems.map((p, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.8rem' }}>
                     <div 
                        onClick={() => toggleComplete(p.id)}
                        style={{ 
                          width: '20px', height: '20px', borderRadius: '4px', 
                          border: completed[p.id] ? 'none' : '2px solid rgba(0,0,0,0.15)', 
                          background: completed[p.id] ? '#10B981' : 'transparent',
                          display: 'flex', justifyContent: 'center', alignItems: 'center',
                          cursor: 'pointer', flexShrink: 0, marginTop: '2px', transition: 'all 0.2s'
                        }}
                      >
                         {completed[p.id] && <CheckCircle size={14} color="white" />}
                     </div>
                     <a href={p.url} target="_blank" rel="noreferrer" style={{ color: completed[p.id] ? 'var(--text-muted)' : '#4338CA', textDecoration: completed[p.id] ? 'line-through' : 'none', fontSize: '0.95rem', transition: 'all 0.2s' }} onMouseOver={e => !completed[p.id] && (e.target.style.color = '#1E293B')} onMouseOut={e => !completed[p.id] && (e.target.style.color = '#4338CA')}>
                       {p.name}
                     </a>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                <span style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', background: 'rgba(0,0,0,0.05)', borderRadius: '20px', color: 'var(--text-main)' }}>
                  {res.tag}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="glass-card" style={{ marginTop: '4rem', padding: '3rem', textAlign: 'center', background: 'var(--primary)', color: 'white', border: 'none' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Ready to test your knowledge?</h2>
          <p style={{ marginBottom: '2rem', fontSize: '1.1rem', opacity: 0.9 }}>Take our AI-driven Mock Assessment to find exactly where you stand.</p>
          <a href="/test"><button className="btn" style={{ background: 'white', color: 'var(--primary)' }}>Start Mock Test Now</button></a>
        </div>

      </div>
    </div>
  );
}
