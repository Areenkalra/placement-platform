import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Sparkles, TrendingUp, SlidersHorizontal, ArrowRight } from 'lucide-react';
import { awardXP, awardBadge } from '../utils/gamification';
import { logActivity } from '../utils/activityLogger';

export default function DigitalTwin() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Default values or user's actual base values from the dashboard
  const baseProfile = location.state?.baseProfile || {
    cgpa: 7.0,
    dsaCount: 50,
    projects: 1,
    internships: 0,
    certifications: 0,
    oops: 50,
    cn: 50,
    dbms: 50
  };

  const baseScore = location.state?.baseScore || 45.0;

  const [twinProfile, setTwinProfile] = useState({ ...baseProfile });
  const [twinScore, setTwinScore] = useState(baseScore);
  const [loading, setLoading] = useState(false);

  // Gamification Reward
  useEffect(() => {
    awardXP(50, 'Simulated Alternative Reality');
    awardBadge('twin_used');
    logActivity("Virtual Twin Simulation", "Started a new what-if analysis session.");
  }, []);

  // Debouncing for the API call to avoid spamming the backend
  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await axios.post('https://python-ml-service-bku1.onrender.com/predict', twinProfile);
        setTwinScore(res.data.probability);
      } catch (err) {
        console.error("Twin Predict Error:", err);
      } finally {
        setLoading(false);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [twinProfile]);

  const handleSliderChange = (e) => {
    const { name, value } = e.target;
    setTwinProfile(prev => ({
      ...prev,
      [name]: parseFloat(value) === parseInt(value) ? parseInt(value) : parseFloat(value)
    }));
  };

  const scoreDiff = (twinScore - baseScore).toFixed(1);
  const diffColor = scoreDiff > 0 ? '#10B981' : scoreDiff < 0 ? '#EF4444' : 'var(--text-muted)';
  
  // Highlighting the variable with the most impact relative to base
  let topImprovement = "No changes yet.";
  if (scoreDiff > 0) {
     if (twinProfile.dsaCount - baseProfile.dsaCount > 50) topImprovement = "Solving more DSA problems highly boosted your score!";
     else if (twinProfile.projects - baseProfile.projects > 0) topImprovement = "Adding projects acts as a strong multiplier.";
     else if (twinProfile.internships - baseProfile.internships > 0) topImprovement = "Real world experience heavily impacted your employability.";
     else if (twinProfile.cgpa - baseProfile.cgpa > 0.5) topImprovement = "A stellar academic record lifts your foundational baseline.";
     else topImprovement = "A healthy mix of diverse skill increases gives you a solid bump.";
  } else if (scoreDiff < 0) {
     topImprovement = "Your twin simulated a skill drop, reducing overall capability.";
  }

  return (
    <div className="page-container" style={{ padding: '8rem 1rem 4rem', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
      <div style={{ width: '100%', maxWidth: '1200px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ display: 'inline-block', padding: '0.4rem 1rem', background: '#EEF2FF', color: '#4F46E5', borderRadius: '30px', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '1rem', letterSpacing: '1px' }}>
            WHAT-IF ANALYSIS LAB
          </div>
          <h1 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '1rem', color: 'var(--text-main)' }}>
            Digital <span style={{ color: 'var(--primary)', background: 'linear-gradient(to right, #4F46E5, #0EA5E9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Twin Simulator</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto' }}>
            Adjust the metrics of your virtual twin. We will instantly run these alternate realities through our Machine Learning model to simulate your eventual Placement Probability.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '3rem' }}>
          
          {/* Sliders Area (The Laboratory) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card" 
            style={{ padding: '2.5rem', background: '#FFFFFF' }}
          >
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)', marginBottom: '2rem', fontSize: '1.5rem' }}>
              <SlidersHorizontal color="var(--primary)" /> Twin Configurations
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              {/* Variable: DSA */}
              <div className="slider-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text-main)', fontWeight: '600' }}>
                  <span>DSA Problems Solved</span>
                  <span style={{ color: 'var(--primary)' }}>{twinProfile.dsaCount} <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 'normal' }}>(Base: {baseProfile.dsaCount})</span></span>
                </div>
                <input 
                  type="range" name="dsaCount" min="0" max="1000" step="10" 
                  value={twinProfile.dsaCount} onChange={handleSliderChange} 
                  style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
                />
              </div>

              {/* Variable: CGPA */}
              <div className="slider-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text-main)', fontWeight: '600' }}>
                  <span>CGPA (Academics)</span>
                  <span style={{ color: 'var(--primary)' }}>{twinProfile.cgpa} <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 'normal' }}>(Base: {baseProfile.cgpa})</span></span>
                </div>
                <input 
                  type="range" name="cgpa" min="5.0" max="10.0" step="0.1" 
                  value={twinProfile.cgpa} onChange={handleSliderChange} 
                  style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
                />
              </div>

              {/* Variable: Projects */}
              <div className="slider-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text-main)', fontWeight: '600' }}>
                  <span>Practical Projects</span>
                  <span style={{ color: 'var(--primary)' }}>{twinProfile.projects} <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 'normal' }}>(Base: {baseProfile.projects})</span></span>
                </div>
                <input 
                  type="range" name="projects" min="0" max="10" step="1" 
                  value={twinProfile.projects} onChange={handleSliderChange} 
                  style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
                />
              </div>

              {/* Variable: Internships */}
              <div className="slider-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text-main)', fontWeight: '600' }}>
                  <span>Internships Completed</span>
                  <span style={{ color: 'var(--primary)' }}>{twinProfile.internships} <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 'normal' }}>(Base: {baseProfile.internships})</span></span>
                </div>
                <input 
                  type="range" name="internships" min="0" max="4" step="1" 
                  value={twinProfile.internships} onChange={handleSliderChange} 
                  style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
                />
              </div>

              {/* Group Core CS into a single block to save space, but individual sliders */}
              <div style={{ background: '#F8FAFC', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)' }}>
                 <h4 style={{ color: 'var(--text-main)', marginBottom: '1.5rem', fontSize: '1.1rem' }}>Core CS Fundamentals (%)</h4>
                 
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="slider-group">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text-main)', fontSize: '0.9rem' }}>
                          <span>OOPs Score</span>
                          <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{twinProfile.oops}% <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 'normal' }}>(Base: {baseProfile.oops}%)</span></span>
                        </div>
                        <input type="range" name="oops" min="40" max="100" step="1" value={twinProfile.oops} onChange={handleSliderChange} style={{ width: '100%', accentColor: '#0EA5E9' }} />
                    </div>
                    <div className="slider-group">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text-main)', fontSize: '0.9rem' }}>
                          <span>DBMS Score</span>
                          <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{twinProfile.dbms}% <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 'normal' }}>(Base: {baseProfile.dbms}%)</span></span>
                        </div>
                        <input type="range" name="dbms" min="40" max="100" step="1" value={twinProfile.dbms} onChange={handleSliderChange} style={{ width: '100%', accentColor: '#0EA5E9' }} />
                    </div>
                 </div>
              </div>

            </div>
          </motion.div>

          {/* Results Area (The Outcome) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
          >
            <div className="glass-card" style={{ padding: '3rem', background: '#FFFFFF', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
               <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '250px', height: '250px', background: `radial-gradient(circle, #10B98120 0%, transparent 70%)`, filter: 'blur(30px)', zIndex: 0 }} />
               <h2 style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
                 <Sparkles color="#F59E0B" /> Projected Outcome
               </h2>

               <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'center', gap: '3rem', alignItems: 'center' }}>
                 {/* Original User */}
                 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: '600' }}>Current You</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{baseScore.toFixed(1)}%</div>
                 </div>

                 <ArrowRight size={32} color="var(--text-muted)" style={{ opacity: 0.5 }} />

                 {/* Digital Twin */}
                 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ fontSize: '1rem', color: 'var(--primary)', marginBottom: '0.5rem', fontWeight: 'bold' }}>Future Twin</div>
                    
                    {loading ? (
                      <div style={{ height: '56px', display: 'flex', alignItems: 'center' }}>
                         <div style={{ width: '30px', height: '30px', border: '3px solid rgba(79, 70, 229, 0.2)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                      </div>
                    ) : (
                      <div style={{ 
                        fontSize: '3.5rem', fontWeight: '900', color: twinScore >= 80 ? '#10B981' : twinScore >= 50 ? '#F59E0B' : '#EF4444',
                        background: 'rgba(0,0,0,0.02)', padding: '0 1rem', borderRadius: '12px', border: `2px solid ${twinScore >= 80 ? '#10B98140' : twinScore >= 50 ? '#F59E0B40' : '#EF444440'}`
                      }}>
                        {twinScore.toFixed(1)}%
                      </div>
                    )}
                 </div>
               </div>

               <div style={{ marginTop: '2.5rem', background: '#F8FAFC', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)', position: 'relative', zIndex: 1 }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: diffColor, marginBottom: '0.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                     {scoreDiff > 0 ? <TrendingUp /> : null}
                     {scoreDiff > 0 ? '+' : ''}{scoreDiff}% Impact
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{topImprovement}</p>
               </div>
            </div>

            <div className="glass-card" style={{ padding: '2rem', background: '#FFFFFF' }}>
              <h3 style={{ color: 'var(--text-main)', marginBottom: '1rem', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                How this works
              </h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.95rem' }}>
                Your "Future Twin" connects directly to the exact exact Machine Learning model (`RandomForestRegressor`) computing your analytics dashboard. The algorithm evaluates your slider inputs exactly as it would real data, meaning these percentage boosts reflect true, data-backed algorithmic behavior—not hardcoded math tricks. Focus on moving sliders that generate the largest positive delta!
              </p>
            </div>

          </motion.div>
        </div>

      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}} />
    </div>
  );
}
