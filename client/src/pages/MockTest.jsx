import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Award, BarChart3, ArrowRight } from 'lucide-react';
import { awardXP, awardBadge } from '../utils/gamification';

const allQuestions = [
  // DSA (Medium/Hard level)
  { id: 1, domain: 'DSA', q: 'Which data structure is optimal for implementing Priority Queues?', options: ['Linked List', 'Array', 'Min/Max Heap', 'Binary Search Tree'], ans: 'Min/Max Heap' },
  { id: 2, domain: 'DSA', q: 'What is the time complexity to find a cycle in a Linked List using Floyd’s tortoise and hare algorithm?', options: ['O(N^2)', 'O(N log N)', 'O(1)', 'O(N)'], ans: 'O(N)' },
  { id: 3, domain: 'DSA', q: 'In a graph, which algorithm finds the most optimal Shortest Path handling negative weights (no negative cycles)?', options: ['Dijkstra', 'Floyd-Warshall', 'Bellman-Ford', 'Kruskal'], ans: 'Bellman-Ford' },
  { id: 4, domain: 'DSA', q: 'Which algorithmic paradigm is Bellman-Ford an example of?', options: ['Greedy', 'Divide and Conquer', 'Dynamic Programming', 'Backtracking'], ans: 'Dynamic Programming' },
  { id: 5, domain: 'DSA', q: 'What data structure is effectively utilized by the sliding window technique?', options: ['Tree', 'Array', 'Stack', 'Queue'], ans: 'Array' },

  // OOPs
  { id: 6, domain: 'OOPs', q: 'Which of the following is NOT an advantage of Object-Oriented Programming?', options: ['Code reusability', 'Direct memory addressing', 'Data hiding', 'Polymorphism'], ans: 'Direct memory addressing' },
  { id: 7, domain: 'OOPs', q: 'When a subclass provides a specific implementation of a method already provided by its parent, it is called:', options: ['Overloading', 'Overriding', 'Abstraction', 'Encapsulation'], ans: 'Overriding' },
  { id: 8, domain: 'OOPs', q: 'What is a virtual function in C++ primarily used to achieve?', options: ['Compile-time polymorphism', 'Data binding', 'Run-time polymorphism', 'Memory allocation'], ans: 'Run-time polymorphism' },
  { id: 9, domain: 'OOPs', q: 'Can an interface in Java implement another interface?', options: ['Yes, using "implements"', 'Yes, using "extends"', 'No, interfaces cannot inherit', 'Only abstract interfaces can'], ans: 'Yes, using "extends"' },
  
  // Computer Networks
  { id: 10, domain: 'CN', q: 'Which layer of the OSI model does the HTTP protocol operate on?', options: ['Network Layer', 'Transport Layer', 'Data Link Layer', 'Application Layer'], ans: 'Application Layer' },
  { id: 11, domain: 'CN', q: 'What is the physical size of a MAC Address?', options: ['16 bits', '32 bits', '48 bits', '64 bits'], ans: '48 bits' },
  { id: 12, domain: 'CN', q: 'Which protocol dynamically assigns IP addresses to devices?', options: ['DNS', 'DHCP', 'ARP', 'ICMP'], ans: 'DHCP' },
  { id: 13, domain: 'CN', q: 'In TCP, how is connection establishment achieved?', options: ['2-way handshake', '3-way handshake', '4-way handshake', 'Piggybacking'], ans: '3-way handshake' },

  // DBMS
  { id: 14, domain: 'DBMS', q: 'What property guarantees that either all operations of a transaction succeed, or none do?', options: ['Atomicity', 'Isolation', 'Consistency', 'Durability'], ans: 'Atomicity' },
  { id: 15, domain: 'DBMS', q: 'Which normal form ensures that no non-prime attribute is transitively dependent on the primary key?', options: ['1NF', '2NF', '3NF', 'BCNF'], ans: '3NF' },
  { id: 16, domain: 'DBMS', q: 'What does the SQL string function `LIKE "%a"` match?', options: ['Strings starting with "a"', 'Strings ending with "a"', 'Strings containing "a"', 'Strings with 2 letters ending in "a"'], ans: 'Strings ending with "a"' },
  { id: 17, domain: 'DBMS', q: 'Which type of lock allows multiple transactions to read a resource simultaneously but prevents writes?', options: ['Exclusive Lock', 'Shared Lock', 'Deadlock', 'Update Lock'], ans: 'Shared Lock' },

  // Aptitude
  { id: 18, domain: 'Aptitude', q: 'The price of an item was increased by 20%, then decreased by 20%. What is the net change?', options: ['No change', '4% increase', '4% decrease', '2% decrease'], ans: '4% decrease' },
  { id: 19, domain: 'Aptitude', q: 'In a group of 60 students, 40 like Cricket and 30 like Football. How many like both?', options: ['10', '15', '20', 'Cannot be determined'], ans: '10' },
  { id: 20, domain: 'Aptitude', q: 'A train 150m long is running at 90 km/h. How long will it take to cross a 100m long bridge?', options: ['8 seconds', '10 seconds', '12 seconds', '15 seconds'], ans: '10 seconds' }
];

export default function MockTest() {
  const navigate = useNavigate();
  const [questions] = useState(() => {
    return [...allQuestions].sort(() => 0.5 - Math.random()).slice(0, 15);
  });
  
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState({});
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes
  const [isFinished, setIsFinished] = useState(false);
  const [testResults, setTestResults] = useState(null);

  useEffect(() => {
    if (timeLeft <= 0) {
      finishTest();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelect = (opt) => {
    if (submitted[currentQ]) return; // Cannot change answer after submission
    setAnswers({ ...answers, [currentQ]: opt });
  };

  const handleSubmitQuestion = () => {
    if (!answers[currentQ]) return;
    setSubmitted({ ...submitted, [currentQ]: true });
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      finishTest();
    }
  };

  const finishTest = () => {
    let domains = { DSA: { correct: 0, total: 0 }, OOPs: { correct: 0, total: 0 }, CN: { correct: 0, total: 0 }, DBMS: { correct: 0, total: 0 }, Aptitude: { correct: 0, total: 0 } };
    let finalCorrect = 0;
    
    questions.forEach((q, idx) => {
      domains[q.domain].total++;
      if (answers[idx] === q.ans) {
         domains[q.domain].correct++;
         finalCorrect++;
      }
    });

    const getScore = (domain) => domains[domain].total > 0 ? Math.round((domains[domain].correct / domains[domain].total) * 100) : 50; 
    const dsaEquivalent = (getScore('DSA') * 3) + (getScore('Aptitude') * 0.5); 
    
    // Gamification Hook
    awardXP(150, "Completed Mock Assessment");
    if (finalCorrect === questions.length) {
       awardBadge('mock_test_100');
    } else {
       awardBadge('mock_test_1');
    }

    setTestResults({
      domains,
      totalCorrect: finalCorrect,
      totalQuestions: questions.length,
      autoFill: {
        dsaCount: Math.round(dsaEquivalent),
        oops: getScore('OOPs'),
        cn: getScore('CN'),
        dbms: getScore('DBMS')
      }
    });
    setIsFinished(true);
  };

  const q = questions[currentQ];
  const isCurrentSubmitted = submitted[currentQ];
  const isCorrect = answers[currentQ] === q.ans;

  if (isFinished && testResults) {
    return (
      <div className="page-container" style={{ paddingTop: '8rem', paddingBottom: '4rem', display: 'flex', justifyContent: 'center' }}>
        <motion.div className="glass-card" style={{ padding: '3rem', width: '100%', maxWidth: '800px', background: '#FFFFFF', textAlign: 'center' }} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
           <Award size={64} color="#F59E0B" style={{ margin: '0 auto 1.5rem' }} />
           <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '1rem' }}>Assessment Complete</h2>
           <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '3rem' }}>You answered {testResults.totalCorrect} out of {testResults.totalQuestions} questions correctly.</p>

           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', textAlign: 'left', marginBottom: '3rem' }}>
              {Object.keys(testResults.domains).map(dom => {
                 const data = testResults.domains[dom];
                 if (data.total === 0) return null;
                 const pct = Math.round((data.correct / data.total) * 100);
                 const color = pct >= 80 ? '#10B981' : pct >= 50 ? '#F59E0B' : '#EF4444';
                 return (
                    <div key={dom} style={{ background: '#F8FAFC', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)' }}>
                       <h4 style={{ color: 'var(--text-main)', marginBottom: '0.5rem', fontSize: '1.1rem' }}>{dom} Mastery</h4>
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                         <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: color }}>{pct}%</span>
                         <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{data.correct}/{data.total}</span>
                       </div>
                       <div style={{ width: '100%', height: '6px', background: '#E2E8F0', borderRadius: '10px', overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, height: '100%', background: color, transition: 'width 1s ease-out' }} />
                       </div>
                    </div>
                 )
              })}
           </div>

           <button className="btn" style={{ padding: '1.2rem 3rem', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.8rem', margin: '0 auto' }} onClick={() => navigate('/form', { state: { autoFill: testResults.autoFill } })}>
             <BarChart3 /> Calculate Placement Prediction <ArrowRight />
           </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ paddingTop: '8rem', paddingBottom: '4rem', display: 'flex', justifyContent: 'center' }}>
      <motion.div 
        className="glass-card" 
        style={{ padding: '3rem', width: '100%', maxWidth: '800px', background: '#FFFFFF' }}
        key={currentQ}
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', color: 'var(--text-muted)' }}>
          <span>Question {currentQ + 1} of {questions.length}</span>
          <span style={{ color: timeLeft <= 60 ? '#EF4444' : 'var(--text-main)', fontWeight: 'bold', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: timeLeft <= 60 ? '#EF4444' : '#10B981', animation: timeLeft <= 60 ? 'pulse 1s infinite' : 'none' }}></span>
            {formatTime(timeLeft)}
          </span>
          <span style={{ color: 'var(--primary)', fontWeight: 'bold', background: '#EEF2FF', padding: '0.2rem 0.8rem', borderRadius: '20px' }}>{q.domain}</span>
        </div>
        
        <h2 style={{ fontSize: '1.4rem', marginBottom: '2rem', lineHeight: '1.6', color: 'var(--text-main)' }}>{q.q}</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {q.options.map((opt, i) => {
            const isSelected = answers[currentQ] === opt;
            const isActualAnswer = opt === q.ans;
            
            let bg = '#FFFFFF';
            let border = '1px solid rgba(0,0,0,0.1)';
            let textColor = 'var(--text-main)';

            if (isCurrentSubmitted) {
              if (isActualAnswer) {
                bg = '#ECFDF5'; border = '2px solid #10B981'; textColor = '#065F46'; // Correct Answer Highlight
              } else if (isSelected && !isActualAnswer) {
                bg = '#FEF2F2'; border = '2px solid #EF4444'; textColor = '#991B1B'; // Wrong Selection Highlight
              } else {
                 bg = '#F8FAFC'; border = '1px solid rgba(0,0,0,0.05)'; textColor = '#94A3B8'; // Fade out others
              }
            } else {
              if (isSelected) {
                bg = '#EEF2FF'; border = '2px solid var(--primary)'; textColor = '#1E3A8A';
              }
            }

            return (
              <button
                key={i}
                onClick={() => handleSelect(opt)}
                disabled={isCurrentSubmitted}
                style={{
                  background: bg,
                  border: border,
                  padding: '1.2rem 1.5rem',
                  borderRadius: '12px',
                  color: textColor,
                  textAlign: 'left',
                  fontSize: '1.1rem',
                  cursor: isCurrentSubmitted ? 'default' : 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                {opt}
                {isCurrentSubmitted && isActualAnswer && <CheckCircle2 color="#10B981" size={20} />}
                {isCurrentSubmitted && isSelected && !isActualAnswer && <XCircle color="#EF4444" size={20} />}
              </button>
            )
          })}
        </div>
        
        {/* Instant Feedback Notice */}
        {isCurrentSubmitted && (
           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '2rem', padding: '1rem', borderRadius: '8px', background: isCorrect ? '#ECFDF5' : '#FEF2F2', color: isCorrect ? '#065F46' : '#991B1B', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
             {isCorrect ? <CheckCircle2 /> : <XCircle />} 
             {isCorrect ? "Correct! Well done." : `Incorrect. The correct answer was: ${q.ans}`}
           </motion.div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '2rem' }}>
          <button 
            className="btn" 
            style={{ background: 'rgba(0,0,0,0.05)', color: 'var(--text-main)', border: 'none', boxShadow: 'none', visibility: currentQ === 0 ? 'hidden' : 'visible' }}
            onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
          >
            ← Previous
          </button>
          
          {!isCurrentSubmitted ? (
            <button 
              className="btn" 
              onClick={handleSubmitQuestion}
              disabled={!answers[currentQ]}
              style={{ background: !answers[currentQ] ? '#E2E8F0' : '#4F46E5', color: !answers[currentQ] ? '#94A3B8' : 'white' }}
            >
              Check Answer
            </button>
          ) : (
            <button 
              className="btn" 
              onClick={handleNext}
              style={{ background: '#10B981', color: 'white' }}
            >
              {currentQ === questions.length - 1 ? 'Finish Assessment →' : 'Next Question →'}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
