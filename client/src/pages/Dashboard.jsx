import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, AlertTriangle, Building, BookOpen, ExternalLink, Sparkles, Activity, Trophy, Medal, Zap, Star, Calendar } from 'lucide-react';
import { getGameState, awardBadge } from '../utils/gamification';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import Confetti from 'react-confetti';
import { motion } from 'framer-motion';

const courseCatalog = {
  "Data Structures and Algorithms": [
    { title: "Data Structures and Algorithms Specialization", platform: "Coursera", link: "https://www.coursera.org/specializations/data-structures-algorithms" },
    { title: "Master the Coding Interview: DSA", platform: "Udemy", link: "https://www.udemy.com/course/master-the-coding-interview-data-structures-algorithms/" }
  ],
  "Object Oriented Programming (OOPs)": [
    { title: "Object-Oriented Programming in Java", platform: "Coursera", link: "https://www.coursera.org/learn/object-oriented-java" },
    { title: "Master Object Oriented Design in Java", platform: "Udemy", link: "https://www.udemy.com/course/master-object-oriented-design-in-java/" }
  ],
  "Computer Networks (CN)": [
    { title: "Computer Communications Specialization", platform: "Coursera", link: "https://www.coursera.org/specializations/computer-communications" },
    { title: "The Complete Networking Fundamentals Course", platform: "Udemy", link: "https://www.udemy.com/course/complete-networking-fundamentals-course-ccna-start/" }
  ],
  "Database Management Systems (DBMS)": [
    { title: "Database Management Essentials", platform: "Coursera", link: "https://www.coursera.org/learn/database-management" },
    { title: "The Ultimate MySQL Bootcamp", platform: "Udemy", link: "https://www.udemy.com/course/the-ultimate-mysql-bootcamp-go-from-sql-beginner-to-expert/" }
  ],
  "Practical Projects": [
    { title: "The Web Developer Bootcamp", platform: "Udemy", link: "https://www.udemy.com/course/the-web-developer-bootcamp/" },
    { title: "Full-Stack Web Development React", platform: "Coursera", link: "https://www.coursera.org/specializations/full-stack-react" }
  ]
};

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const resultObj = location.state?.result;
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    // If they score > 70 on prediction
    if (resultObj && resultObj.probability && resultObj.probability >= 70) {
      setShowCelebration(true);
      const timer = setTimeout(() => setShowCelebration(false), 6000);
      return () => clearTimeout(timer);
    }
  }, [resultObj]);

  // Initialize Gamification State for Dashboard Dashboard
  const [gameState, setGameState] = React.useState(() => {
    // We check for "First Analysis" badge if they landed here securely
    if (resultObj) {
       awardBadge('first_analysis');
    }
    return getGameState();
  });
  
  if (!resultObj) {
    return (
      <div style={{ padding: '8rem 2rem', textAlign: 'center' }}>
        <h2>No Data Found</h2>
        <button className="btn" onClick={() => navigate('/form')} style={{ marginTop: '1rem' }}>Go to Analysis Form</button>
      </div>
    );
  }

  const { probability, skillGaps, recommendations, cgpa, dsaCount, projects, internships, certifications, oops, cn, dbms } = resultObj;

  // Custom Balloons Component
  const BoundingBalloons = () => {
    const balloons = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      x: Math.random() * (window.innerWidth - 100),
      delay: Math.random() * 1.5,
      scale: 0.8 + Math.random() * 1.2,
      duration: 4 + Math.random() * 2
    }));

    return (
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
        <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={350} gravity={0.2} />
        {balloons.map(b => (
          <motion.div
            key={b.id}
            initial={{ y: window.innerHeight + 100, x: b.x, scale: b.scale }}
            animate={{ y: -200 }}
            transition={{ duration: b.duration, delay: b.delay, ease: 'easeOut' }}
            style={{ position: 'absolute' }}
          >
             <span style={{ fontSize: '4rem' }}>🎈</span>
          </motion.div>
        ))}
      </div>
    );
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#10B981'; // Success Green
    if (score >= 50) return '#F59E0B'; // Warning orange
    return '#EF4444'; // Danger Red
  };

  const scoreColor = getScoreColor(probability);

  // Data for Radar Chart (Skills vs Expectations)
  const radarData = [
    { subject: 'CGPA', user: (cgpa / 10) * 100, avg: 85 },
    { subject: 'DSA', user: Math.min((dsaCount / 500) * 100, 100), avg: 50 },
    { subject: 'Projects', user: Math.min((projects / 6) * 100, 100), avg: 60 },
    { subject: 'Interns', user: Math.min((internships / 3) * 100, 100), avg: 40 },
    { subject: 'OOPs', user: oops || 0, avg: 75 },
    { subject: 'CN', user: cn || 0, avg: 70 },
    { subject: 'DBMS', user: dbms || 0, avg: 75 },
  ];

  // Data for Bar Chart (Raw comparison)
  const barData = [
    { name: 'CGPA', User: Number(cgpa), Average: 8.5 },
    { name: 'OOPs', User: Number(oops || 0), Average: 75 },
    { name: 'CN', User: Number(cn || 0), Average: 70 },
    { name: 'DBMS', User: Number(dbms || 0), Average: 75 },
    { name: 'Projects', User: Number(projects), Average: 3 },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const getTierPrediction = (prob) => {
    if (prob >= 80) return { tier: "Top Product / FAANG", color: "#4F46E5", desc: "You are highly competitive for top tech giants. Focus on System Design and Hard LeetCode." };
    if (prob >= 65) return { tier: "Mid-Tier Product / Unicorns", color: "#0EA5E9", desc: "You have strong fundamentals. Keep grinding DSA mediums and participate in hackathons." };
    if (prob >= 45) return { tier: "Service Based / IT Giants", color: "#10B981", desc: "You meet the criteria for mass recruiters (TCS, Wipro, Infosys). Focus on Aptitude and Core CS." };
    return { tier: "Foundational Phase", color: "#F59E0B", desc: "You need to build your core profile. Focus on getting your first internship and doing CP." };
  };

  const tier = getTierPrediction(probability);

  return (
    <div className="page-container" style={{ padding: '2rem 1rem', minHeight: '100vh', display: 'flex', justifyContent: 'center' }}>
      {showCelebration && <BoundingBalloons />}
      <motion.div 
        style={{ width: '100%', maxWidth: '1000px' }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.button 
          variants={itemVariants}
          className="btn" 
          style={{ background: 'rgba(0,0,0,0.05)', color: 'var(--text-main)', border: '1px solid rgba(0,0,0,0.1)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: 'none' }} 
          onClick={() => navigate('/form')}
        >
          <ArrowLeft size={18} /> Update Details
        </motion.button>

        {/* Hero Score Card */}
        <motion.div variants={itemVariants} className="glass-card" style={{ padding: '3rem', marginBottom: '2rem', textAlign: 'center', background: '#FFFFFF' }}>
          <h2 style={{ fontSize: '1.2rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px' }}>Placement Probability</h2>
          <div style={{ 
            fontSize: '6rem', 
            fontWeight: '800', 
            color: scoreColor,
            textShadow: `0 8px 30px ${scoreColor}40`,
            lineHeight: '1.2',
            margin: '1rem 0'
          }}>
            {probability.toFixed(1)}%
          </div>
          <p style={{ color: 'var(--text-main)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
            {probability >= 80 ? 'Excellent! You are highly competitive for top product-based companies.' : 
             probability >= 50 ? 'Good, but focus on filling you skill gaps to reach top companies.' : 
             'You need serious preparation to boost your chances. Start with the recommendations below.'}
          </p>
        </motion.div>

        {/* Gamification Summary Card */}
        <motion.div variants={itemVariants} className="glass-card" style={{ padding: '2rem', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)', color: 'white', position: 'relative', overflow: 'hidden' }}>
           <div style={{ position: 'absolute', top: '-50%', right: '-10%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(245,158,11,0.2) 0%, transparent 60%)', filter: 'blur(30px)' }} />
           
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                 <div style={{ background: '#F59E0B', padding: '1rem', borderRadius: '15px', color: '#FFF', boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4)' }}>
                    <Star size={32} />
                 </div>
                 <div>
                    <h3 style={{ fontSize: '1.4rem', color: '#FFF', marginBottom: '0.2rem' }}>Level {gameState.level}: {gameState.title}</h3>
                    <p style={{ color: '#A5B4FC', fontSize: '1rem' }}>{gameState.xp.toLocaleString()} Total XP</p>
                 </div>
              </div>
              
              <button onClick={() => navigate('/profile')} className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: '#FFF', border: '1px solid rgba(255,255,255,0.2)', padding: '0.6rem 1.5rem', fontSize: '0.9rem' }}>
                 View Profile Platform &nbsp;→
              </button>
           </div>

           <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#A5B4FC', fontWeight: 'bold' }}>
                 <span>Progress to Level {gameState.level === 4 ? 'MAX' : gameState.level + 1}</span>
                 <span>{gameState.level === 4 ? 'MAX' : `${gameState.nextLevelXP} XP`}</span>
              </div>
              <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden' }}>
                 <div style={{ width: `${gameState.progress}%`, height: '100%', background: 'linear-gradient(90deg, #F59E0B, #FCD34D)', transition: 'width 1s ease-out' }} />
              </div>
           </div>

           <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative', zIndex: 1, marginTop: '0.5rem' }}>
              <Zap size={18} color="#FCD34D" />
              <span style={{ color: '#E0E7FF', fontSize: '0.95rem' }}>Next Reward: Unlock Master technical interview guides.</span>
           </div>
        </motion.div>

        {/* Tier Prediction Card */}
        <motion.div variants={itemVariants} className="glass-card" style={{ padding: '2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', background: '#FFFFFF' }}>
          <div style={{ padding: '1.5rem', background: `rgba(${tier.color === '#4F46E5' ? '79, 70, 229' : tier.color === '#0EA5E9' ? '14, 165, 233' : tier.color === '#10B981' ? '16, 185, 129' : '245, 158, 11'}, 0.1)`, borderRadius: '15px' }}>
            <Building size={48} color={tier.color} />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '0.2rem' }}>TARGET COMPANY TIER PREDICTION</p>
            <h3 style={{ fontSize: '1.8rem', color: tier.color, marginBottom: '0.5rem' }}>{tier.tier}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>{tier.desc}</p>
          </div>
        </motion.div>

        {/* Heatmap Data Calculation */}
        {(() => {
          const heatmapData = [
            { name: 'Data Structures', score: Math.min((dsaCount / 500) * 100, 100) },
            { name: 'Academic Record', score: (cgpa / 10) * 100 },
            { name: 'OOP Concepts', score: oops || 0 },
            { name: 'Database Management', score: dbms || 0 },
            { name: 'Computer Networks', score: cn || 0 },
            { name: 'Practical Projects', score: Math.min((projects / 6) * 100, 100) },
            { name: 'Industry Internships', score: Math.min((internships / 3) * 100, 100) },
            { name: 'Certifications', score: Math.min((certifications / 4) * 100, 100) }
          ];

          const getHeatmapStyle = (score) => {
             if(score >= 80) return { bg: '#ECFDF5', border: '#10B981', text: '#065F46', label: 'Strong Mastery' };
             if(score >= 50) return { bg: '#FFFBEB', border: '#F59E0B', text: '#B45309', label: 'Average' };
             return { bg: '#FEF2F2', border: '#EF4444', text: '#991B1B', label: 'Critical Gap' };
          };

          return (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
              
              {/* Spider Chart */}
              <motion.div variants={itemVariants} className="glass-card" style={{ padding: '2rem', height: '420px', background: '#FFFFFF' }}>
                <h3 style={{ textAlign: 'center', marginBottom: '0.5rem', color: 'var(--text-main)', fontSize: '1.2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                  <Activity size={20} color="var(--primary)" /> Skill Balance Radar
                </h3>
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>Compare your portfolio explicitly against Top Candidates.</p>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                    <PolarGrid stroke="rgba(0,0,0,0.1)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name="You" dataKey="user" stroke="#4F46E5" strokeWidth={2} fill="#4F46E5" fillOpacity={0.4} />
                    <Radar name="Top Candidate" dataKey="avg" stroke="#10B981" strokeWidth={2} fill="#10B981" fillOpacity={0.15} />
                    <Legend />
                    <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', color: '#1E293B' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Data-Driven Gap Heatmap */}
              <motion.div variants={itemVariants} className="glass-card" style={{ padding: '2rem', height: '420px', background: '#FFFFFF', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ textAlign: 'center', marginBottom: '0.5rem', color: 'var(--text-main)', fontSize: '1.2rem' }}>
                  Competency Heatmap
                </h3>
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Visual representation mapping weak vs strong skills.</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', overflowY: 'auto', flexGrow: 1, paddingRight: '0.5rem' }}>
                  {heatmapData.map((item, idx) => {
                    const style = getHeatmapStyle(item.score);
                    return (
                      <div key={idx} style={{ 
                        background: style.bg, border: `1px solid ${style.border}`, borderRadius: '8px', padding: '1rem', 
                        display: 'flex', flexDirection: 'column', gap: '0.5rem', transition: 'transform 0.2s', cursor: 'default' 
                      }}
                      onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                      onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        <span style={{ color: style.text, fontWeight: 'bold', fontSize: '0.9rem' }}>{item.name}</span>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                           <span style={{ fontSize: '1.2rem', fontWeight: '900', color: style.text }}>{Math.round(item.score)}%</span>
                           <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: style.text, background: 'rgba(255,255,255,0.5)', padding: '0.2rem 0.5rem', borderRadius: '12px', fontWeight: 'bold' }}>
                             {style.label}
                           </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </motion.div>

            </div>
          );
        })()}

        {/* Analysis Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
          <motion.div variants={itemVariants} className="glass-card" style={{ padding: '2.5rem' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.3rem' }}>
              <AlertTriangle color="#EF4444" size={24} /> Identified Skill Gaps
            </h3>
            {skillGaps && skillGaps.length > 0 ? (
              <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {skillGaps.map((gap, idx) => (
                  <li key={idx} style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.5' }}>{gap}</li>
                ))}
              </ul>
            ) : (
              <p style={{ color: '#10B981', fontSize: '1.1rem' }}>Great! No major skill gaps identified based on your input.</p>
            )}
          </motion.div>

          <motion.div variants={itemVariants} className="glass-card" style={{ padding: '2.5rem' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.3rem' }}>
              <CheckCircle color="#10B981" size={24} /> Actionable Recommendations
            </h3>
            {recommendations && recommendations.length > 0 ? (
              <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {recommendations.map((rec, idx) => (
                  <li key={idx} style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.5' }}>{rec}</li>
                ))}
              </ul>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>No immediate action items. Great job! Keep maintaining your current skills.</p>
            )}
          </motion.div>
        </div>

        {/* Execution Layer CTA */}
        <motion.div variants={itemVariants} className="glass-card" style={{ padding: '2.5rem', marginBottom: '2rem', background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)', border: '1px solid #10B98130', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
           <div>
             <h3 style={{ fontSize: '1.5rem', color: '#065F46', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar color="#10B981" /> Generate Execution Plan</h3>
             <p style={{ color: '#047857', fontSize: '1.1rem', maxWidth: '600px' }}>Convert your skill gaps into an actionable, day-by-day 7-day study sprint customized by our AI Auto-Scheduler.</p>
           </div>
           <button onClick={() => navigate('/planner', { state: { result } })} className="btn" style={{ background: '#10B981', color: 'white', border: 'none', padding: '1rem 2rem', fontSize: '1.1rem', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)' }}>
              Open AI Scheduler →
           </button>
        </motion.div>

        {/* Recommended Courses Section */}
        {skillGaps && skillGaps.some(gap => courseCatalog[gap]) && (
          <motion.div variants={itemVariants} className="glass-card" style={{ padding: '2.5rem', background: '#FFFFFF' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.3rem', color: '#1E293B' }}>
              <BookOpen color="#4F46E5" size={24} /> Recommended Courses (Based on Your Skill Gaps)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {skillGaps.filter(gap => courseCatalog[gap]).map((gap, gIdx) => (
                <div key={gIdx} style={{ background: '#F8FAFC', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)' }}>
                  <h4 style={{ color: 'var(--primary)', marginBottom: '1rem', fontSize: '1.1rem' }}>Upskill in: {gap}</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {courseCatalog[gap].map((course, cIdx) => (
                      <a 
                        key={cIdx} 
                        href={course.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ display: 'block', padding: '1rem', background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '8px', textDecoration: 'none', transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}
                        onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                        onMouseOut={(e) => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.05)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <span style={{ fontWeight: '600', color: '#1E293B', fontSize: '0.95rem', lineHeight: '1.4', paddingRight: '1rem' }}>{course.title}</span>
                          <ExternalLink size={16} color="#94A3B8" style={{ flexShrink: 0, marginTop: '2px' }} />
                        </div>
                        <span style={{ display: 'inline-block', marginTop: '0.5rem', fontSize: '0.8rem', padding: '0.2rem 0.6rem', background: course.platform === 'Coursera' ? '#DBEAFE' : '#FED7AA', color: course.platform === 'Coursera' ? '#1D4ED8' : '#C2410C', borderRadius: '20px', fontWeight: 'bold' }}>
                          {course.platform}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
        
        {/* Recruiter ATS Match CTA */}
        <motion.div variants={itemVariants} className="glass-card" style={{ padding: '3rem', background: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)', color: 'white', textAlign: 'center', marginTop: '2rem' }}>
          <div style={{ display: 'inline-block', padding: '0.4rem 1rem', background: 'rgba(255,255,255,0.1)', color: '#DBEAFE', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '1.5rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
             NEW PLATFORM FEATURE
          </div>
          <h3 style={{ fontSize: '2rem', marginBottom: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
             <Building color="#93C5FD" /> Unlock Active Job Matches
          </h3>
          <p style={{ color: '#DBEAFE', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 2rem', lineHeight: '1.6' }}>
             Stop guessing. We've matched your precise performance metrics against the requirements of top tech giants. See exactly which companies are looking for your skill profile right now.
          </p>
          <button 
             className="btn"
             style={{ padding: '1rem 3rem', fontSize: '1.1rem', background: '#FFFFFF', color: '#1E40AF', border: 'none', boxShadow: '0 4px 15px rgba(255, 255, 255, 0.2)', fontWeight: 'bold' }}
             onClick={() => navigate('/jobs', { state: { result: resultObj } })}
          >
             Open ATS Match Engine →
          </button>
        </motion.div>

        {/* Digital Twin CTA */}
        <motion.div variants={itemVariants} className="glass-card" style={{ padding: '3rem', background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)', color: 'white', textAlign: 'center', marginTop: '2rem' }}>
          <div style={{ display: 'inline-block', padding: '0.4rem 1rem', background: 'rgba(255,255,255,0.1)', color: '#DBEAFE', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '1.5rem', letterSpacing: '1px' }}>
            ADVANCED SIMULATOR
          </div>
          <h3 style={{ fontSize: '2rem', marginBottom: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles color="#FDE047" /> Test Your Digital Twin
          </h3>
          <p style={{ color: '#94A3B8', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 2rem', lineHeight: '1.6' }}>
            Curious about your future? Adjust the sliders on your virtual twin and see how improving specific skills physically recalculates your expected placement probability in real-time.
          </p>
          <button 
            className="btn"
            style={{ padding: '1rem 3rem', fontSize: '1.1rem', background: '#38BDF8', color: '#0F172A', border: 'none', boxShadow: '0 4px 15px rgba(56, 189, 248, 0.4)' }}
            onClick={() => navigate('/digital-twin', { 
              state: { 
                baseProfile: { cgpa, dsaCount, projects, internships, certifications, oops, cn, dbms }, 
                baseScore: probability 
              } 
            })}
          >
            Launch Twin Simulator
          </button>
        </motion.div>
        
      </motion.div>
    </div>
  );
}
