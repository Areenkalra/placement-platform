import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building, Target, Award, ArrowRight, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function CompanyInsights() {
  const navigate = useNavigate();
  const [liveInsights, setLiveInsights] = useState({});
  const [isFetching, setIsFetching] = useState({});

  const fetchInsight = async (tierName) => {
      setIsFetching(prev => ({...prev, [tierName]: true}));
      try {
          const res = await axios.post('https://node-server-jdys.onrender.com/api/live/insights', { companyTier: tierName });
          setLiveInsights(prev => ({...prev, [tierName]: res.data.text }));
      } catch (err) {
          setLiveInsights(prev => ({...prev, [tierName]: 'Failed to fetch live insights. Ensure your GEMINI_API_KEY is configured in the backend.' }));
      } finally {
          setIsFetching(prev => ({...prev, [tierName]: false}));
      }
  };

  const tiers = [
    {
      name: "Top Product / FAANG",
      color: "#4F46E5",
      icon: <Award size={40} color="#4F46E5" />,
      description: "Google, Microsoft, Amazon, Meta, Apple. Extremely high bar for Data Structures, Algorithms, and System Design.",
      targets: [
        { label: "CGPA", value: "8.5+" },
        { label: "DSA Problems", value: "400+" },
        { label: "Projects", value: "3+ (Full Stack/ML)" },
        { label: "Internships", value: "1-2" },
        { label: "Core CS", value: "90%+" }
      ]
    },
    {
      name: "Mid-Tier / Unicorns",
      color: "#0EA5E9",
      icon: <Target size={40} color="#0EA5E9" />,
      description: "Uber, Atlassian, Swiggy, Zomato, Razorpay. Strong focus on development skills, fast execution, and modern tech stacks.",
      targets: [
        { label: "CGPA", value: "8.0+" },
        { label: "DSA Problems", value: "250+" },
        { label: "Projects", value: "2+ (Solid impact)" },
        { label: "Internships", value: "0-1" },
        { label: "Core CS", value: "80%+" }
      ]
    },
    {
      name: "Service Based / IT Giants",
      color: "#10B981",
      icon: <Building size={40} color="#10B981" />,
      description: "TCS, Wipro, Infosys, Cognizant, Accenture. Structured interviews, focus on aptitude, communication, and basic technical knowledge.",
      targets: [
        { label: "CGPA", value: "7.0+" },
        { label: "DSA Problems", value: "100+" },
        { label: "Projects", value: "1-2 (Academic)" },
        { label: "Internships", value: "0" },
        { label: "Core CS", value: "70%+" }
      ]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="page-container" style={{ padding: '8rem 1rem 4rem', display: 'flex', justifyContent: 'center' }}>
      <motion.div 
        style={{ width: '100%', maxWidth: '1200px' }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '1rem', background: 'linear-gradient(to right, #1E293B, #4F46E5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Company Tier Insights
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto' }}>
            Understand what different tiers of companies are looking for in a fresh graduate. 
            Aim for these benchmarks to secure your dream role.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
          {tiers.map((tier, idx) => (
            <motion.div key={idx} variants={itemVariants} className="glass-card" style={{ padding: '2.5rem', position: 'relative', overflow: 'hidden', background: '#FFFFFF' }}>
              {/* Background Glow */}
              <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '150px', height: '150px', background: `radial-gradient(circle, ${tier.color}15 0%, transparent 70%)`, filter: 'blur(30px)', zIndex: 0 }} />
              
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ padding: '1rem', background: `${tier.color}15`, borderRadius: '15px', display: 'inline-block', marginBottom: '1.5rem' }}>
                  {tier.icon}
                </div>
                <h2 style={{ fontSize: '1.8rem', color: tier.color, marginBottom: '1rem' }}>{tier.name}</h2>
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '2rem', minHeight: '80px' }}>
                  {tier.description}
                </p>

                <div style={{ background: '#F8FAFC', borderRadius: '12px', padding: '1.5rem', border: '1px solid rgba(0,0,0,0.05)' }}>
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '1.5rem', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '0.5rem' }}>
                    Target Benchmarks
                  </h3>
                  <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {tier.targets.map((t, i) => (
                      <li key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>{t.label}</span>
                        <span style={{ color: 'var(--text-main)', fontWeight: 'bold', background: 'rgba(0,0,0,0.05)', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.9rem' }}>
                          {t.value}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{ background: 'linear-gradient(to right, #F8FAFC, #FFFFFF)', borderRadius: '12px', padding: '1.5rem', border: `1px solid ${tier.color}40`, marginTop: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <h3 style={{ fontSize: '1rem', color: tier.color, display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 'bold' }}>
                          <Zap size={16} /> Live Market Radar
                      </h3>
                      {!liveInsights[tier.name] && !isFetching[tier.name] && (
                          <button 
                             onClick={() => fetchInsight(tier.name)}
                             style={{ background: tier.color, color: 'white', border: 'none', padding: '0.4rem 1rem', borderRadius: '20px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}
                          >
                             Scan Now
                          </button>
                      )}
                  </div>
                  {isFetching[tier.name] && (
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic', animation: 'pulse 1.5s infinite' }}>
                         AI is scanning recent news and trends...
                      </p>
                  )}
                  {liveInsights[tier.name] && !isFetching[tier.name] && (
                      <p style={{ color: 'var(--text-main)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                         {liveInsights[tier.name]}
                      </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div variants={itemVariants} style={{ textAlign: 'center' }}>
          <button 
            className="btn" 
            style={{ padding: '1rem 2rem', fontSize: '1.1rem' }} 
            onClick={() => navigate('/form')}
          >
            Check My Score <ArrowRight size={20} />
          </button>
        </motion.div>
        <style dangerouslySetInnerHTML={{__html: `
            @keyframes pulse {
                0% { opacity: 1; }
                50% { opacity: 0.5; }
                100% { opacity: 1; }
            }
        `}} />
      </motion.div>
    </div>
  );
}
