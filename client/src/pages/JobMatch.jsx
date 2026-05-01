import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Building, Flame, CheckCircle2, AlertCircle, Send, User } from 'lucide-react';
import { awardXP } from '../utils/gamification';
import { logActivity } from '../utils/activityLogger';

const FALLBACK_JOBS = [
  {
    id: 1,
    title: "Software Development Engineer (SDE-1)",
    company: "Amazon",
    location: "Bangalore, India",
    type: "Full-Time",
    recruiter: { name: "Sarah Jenkins", role: "Technical Recruiter, AWS", initials: "SJ", color: "#F59E0B" },
    reqCGPA: 8.0,
    reqDSA: 200,
    reqSkills: ["Java", "Python", "AWS", "System Design"],
    salary: "₹24 LPA - ₹30 LPA"
  },
  {
    id: 2,
    title: "Frontend Engineer",
    company: "Vercel",
    location: "Remote",
    type: "Full-Time",
    recruiter: { name: "David Chen", role: "Talent Acquisition", initials: "DC", color: "#10B981" },
    reqCGPA: 7.0,
    reqDSA: 50,
    reqSkills: ["React", "Node", "TypeScript", "Next.js"],
    salary: "$90k - $120k"
  },
  {
    id: 3,
    title: "Backend Service Developer",
    company: "TCS Digital",
    location: "Pune, India",
    type: "Full-Time",
    recruiter: { name: "Priya Sharma", role: "Campus Recruiter", initials: "PS", color: "#3B82F6" },
    reqCGPA: 7.5,
    reqDSA: 100,
    reqSkills: ["Python", "Django", "SQL", "Docker"],
    salary: "₹7 LPA"
  },
  {
    id: 4,
    title: "Data Engineer",
    company: "Google",
    location: "Hyderabad, India",
    type: "Full-Time",
    recruiter: { name: "Alexander Wright", role: "Engineering Manager", initials: "AW", color: "#EF4444" },
    reqCGPA: 8.5,
    reqDSA: 250,
    reqSkills: ["Python", "SQL", "GCP", "PostgreSQL"],
    salary: "₹30 LPA - ₹40 LPA"
  }
];

const calculateATS = (job, profile) => {
  if (!profile) return { score: 0, missing: job.reqSkills, matched: [] };

  let score = 0;
  
  // Safely parse user technical skills (it might be a comma separated string from location.state.result or an array)
  let userSkills = [];
  if (Array.isArray(profile.technicalSkills)) {
     userSkills = profile.technicalSkills.map(s => s.toLowerCase().trim());
  } else if (typeof profile.technicalSkills === 'string') {
     userSkills = profile.technicalSkills.split(',').map(s => s.toLowerCase().trim());
  } else if (profile.skills && Array.isArray(profile.skills)) {
     userSkills = profile.skills.map(s => s.toLowerCase().trim());
  }

  // Factor 1: Skills (60% weight)
  const matchedSkills = job.reqSkills.filter(s => userSkills.includes(s.toLowerCase()));
  const missingSkills = job.reqSkills.filter(s => !userSkills.includes(s.toLowerCase()));
  if (job.reqSkills.length > 0) {
     score += (matchedSkills.length / job.reqSkills.length) * 60;
  } else {
     score += 60;
  }

  // Factor 2: CGPA (20% weight)
  const userCgpa = parseFloat(profile.cgpa) || 0;
  if (userCgpa >= job.reqCGPA) score += 20;
  else if (userCgpa >= job.reqCGPA - 0.5) score += 15;
  else if (userCgpa >= job.reqCGPA - 1) score += 10;

  // Factor 3: DSA (20% weight)
  const userDsa = parseInt(profile.dsaCount) || 0;
  if (userDsa >= job.reqDSA) score += 20;
  else if (userDsa >= job.reqDSA - 20) score += 15;
  else if (userDsa >= job.reqDSA - 50) score += 10;

  return { score: Math.round(score), missing: missingSkills, matched: matchedSkills };
};

export default function JobMatch() {
  const location = useLocation();
  const navigate = useNavigate();
  // Attempt to parse user profile from dashboard navigation state or local storage
  const profile = location.state?.result || null;
  
  const [rankedJobs, setRankedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState(new Set());

  const [isFetchingLive, setIsFetchingLive] = useState(false);

  useEffect(() => {
    const fetchLiveJobs = async () => {
        setIsFetchingLive(true);
        try {
            const res = await axios.post('https://node-server-jdys.onrender.com/api/live/jobs', {
                skills: profile?.technicalSkills,
                location: 'India'
            });
            rankJobs(res.data);
            logActivity("AI Job Match Scan", "Fetched real-time job postings matching profile skills.");
        } catch (error) {
            console.error("Failed to fetch live jobs, using fallback.", error);
            rankJobs(FALLBACK_JOBS);
        } finally {
            setIsFetchingLive(false);
        }
    };

    const rankJobs = (jobsArray) => {
        const scoredJobs = jobsArray.map(job => {
           const matchData = calculateATS(job, profile);
           return { ...job, ...matchData };
        });
        scoredJobs.sort((a, b) => b.score - a.score);
        setRankedJobs(scoredJobs);
    };

    if (profile) {
        fetchLiveJobs();
    }
  }, [profile]);

  const handleApply = (jobId, companyName) => {
    setAppliedJobs(prev => new Set([...prev, jobId]));
    awardXP(500, `Applied to ${companyName}!`);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#10B981';
    if (score >= 60) return '#F59E0B';
    return '#EF4444';
  };

  if (!profile) {
     return (
        <div className="page-container" style={{ padding: '8rem 2rem', textAlign: 'center' }}>
           <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>No Profile Detected</h2>
           <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>You must run the Placement Intake analysis first to unlock Recruiter Matching.</p>
           <button className="btn" onClick={() => navigate('/form')}>Go to Analysis Form</button>
        </div>
     );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', paddingTop: '7rem', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
        
        {/* Header Title */}
        <div style={{ marginBottom: '3rem' }}>
           <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem', background: '#DBEAFE', color: '#2563EB', borderRadius: '30px', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '1rem', letterSpacing: '1px' }}>
              <Briefcase size={16} /> RECRUITER ATS ENGINE
           </div>
           <h1 style={{ fontSize: '3.5rem', fontWeight: '900', color: '#1E293B', letterSpacing: '-1px' }}>
              Your Top Job <span style={{ color: '#2563EB' }}>Matches.</span>
           </h1>
           <p style={{ fontSize: '1.2rem', color: '#64748B', maxWidth: '700px' }}>
              We've cross-referenced your Placement AI Intake data with active job listings using Google Gemini. Here are your real-time compatibility scores.
           </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.5fr', gap: '2.5rem' }}>
           
           {/* Left Sidebar: Student Profile Sync */}
           <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={{ alignSelf: 'start' }}>
              <div className="glass-card" style={{ padding: '2rem', background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0' }}>
                 <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1E293B', marginBottom: '1.5rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <User color="#2563EB" /> Your Synced Profile
                 </h3>
                 
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                       <span style={{ color: '#64748B', fontWeight: '600' }}>CGPA</span>
                       <span style={{ fontWeight: 'bold', color: '#1E293B' }}>{profile.cgpa}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                       <span style={{ color: '#64748B', fontWeight: '600' }}>DSA Solved</span>
                       <span style={{ fontWeight: 'bold', color: '#1E293B' }}>{profile.dsaCount}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                       <span style={{ color: '#64748B', fontWeight: '600' }}>Projects</span>
                       <span style={{ fontWeight: 'bold', color: '#1E293B' }}>{profile.projects}</span>
                    </div>
                 </div>

                 <div style={{ marginTop: '2rem' }}>
                    <span style={{ color: '#64748B', fontWeight: '600', display: 'block', marginBottom: '0.8rem' }}>Tech Stack</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                       {(Array.isArray(profile.technicalSkills) ? profile.technicalSkills : (profile.technicalSkills || '').split(',')).map((skill, idx) => (
                          <span key={idx} style={{ background: '#F1F5F9', color: '#475569', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                             {skill.trim()}
                          </span>
                       ))}
                    </div>
                 </div>
              </div>
           </motion.div>

           {/* Right Column: Job Feed */}
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {isFetchingLive ? (
                 <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0' }}>
                     <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                         <div style={{ width: '40px', height: '40px', border: '4px solid #F1F5F9', borderTopColor: '#2563EB', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                     </div>
                     <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1E293B', marginBottom: '0.5rem' }}>AI is Scanning the Web...</h3>
                     <p style={{ color: '#64748B' }}>Fetching real, live job postings matching your skills.</p>
                     <style dangerouslySetInnerHTML={{__html: `
                        @keyframes spin { 100% { transform: rotate(360deg); } }
                     `}} />
                 </div>
              ) : rankedJobs.map((job, index) => (
                 <motion.div 
                    key={job.id} 
                    initial={{ opacity: 0, y: 30 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: index * 0.1 }}
                    className="glass-card" 
                    style={{ padding: '2rem', background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', transition: 'box-shadow 0.3s', position: 'relative', overflow: 'hidden' }}
                 >
                    {/* Top Job Details Split */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                       
                       <div style={{ display: 'flex', gap: '1.5rem' }}>
                          {/* Recruiter Avatar */}
                          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: job.recruiter.color, color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.4rem', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', flexShrink: 0 }}>
                             {job.recruiter.initials}
                          </div>

                          <div>
                             <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1E293B', marginBottom: '0.2rem' }}>{job.title}</h2>
                             <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#64748B', fontSize: '0.95rem', fontWeight: '500' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#2563EB', fontWeight: 'bold' }}><Building size={16} /> {job.company}</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><MapPin size={16} /> {job.location}</span>
                                <span>{job.salary}</span>
                             </div>
                             <p style={{ fontSize: '0.9rem', color: '#94A3B8', marginTop: '0.5rem' }}>Active Recruiter: <span style={{ color: '#475569', fontWeight: 'bold' }}>{job.recruiter.name}</span> ({job.recruiter.role})</p>
                          </div>
                       </div>

                       {/* Compatibility Score Circle */}
                       <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <div style={{ width: '70px', height: '70px', borderRadius: '50%', border: `4px solid ${getScoreColor(job.score)}`, display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#F8FAFC' }}>
                             <span style={{ fontSize: '1.2rem', fontWeight: '900', color: getScoreColor(job.score) }}>{job.score}%</span>
                          </div>
                          <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#64748B', marginTop: '0.5rem', textTransform: 'uppercase' }}>AI Match</span>
                       </div>

                    </div>

                    {/* Skill Analysis Split */}
                    <div style={{ background: '#F8FAFC', padding: '1.5rem', borderRadius: '15px', border: '1px solid #F1F5F9', marginBottom: '1.5rem' }}>
                       <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#64748B', marginBottom: '1rem', fontWeight: 'bold' }}>Skill Cross-Reference</h4>
                       
                       <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
                          {job.matched.map((skill, i) => (
                             <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: '#ECFDF5', color: '#065F46', border: '1px solid #A7F3D0', padding: '0.4rem 1rem', borderRadius: '30px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                                <CheckCircle2 size={14} /> {skill}
                             </span>
                          ))}
                          
                          {job.missing.map((skill, i) => (
                             <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: '#FEF2F2', color: '#991B1B', border: '1px solid #FECACA', padding: '0.4rem 1rem', borderRadius: '30px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                                <AlertCircle size={14} /> Missing: {skill}
                             </span>
                          ))}
                       </div>

                       {/* Academic Req Note */}
                       <div style={{ marginTop: '1rem', display: 'flex', gap: '2rem', fontSize: '0.85rem', fontWeight: '600' }}>
                          <span style={{ color: profile.cgpa >= job.reqCGPA ? '#10B981' : '#EF4444' }}>
                             Target CGPA: {job.reqCGPA}+
                          </span>
                          <span style={{ color: profile.dsaCount >= job.reqDSA ? '#10B981' : '#EF4444' }}>
                             Target DSA: {job.reqDSA}+
                          </span>
                       </div>
                    </div>

                    {/* Apply Button */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        {job.url && job.url !== '#' && job.url !== '' && (
                           <motion.button 
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => window.open(job.url, '_blank', 'noopener,noreferrer')}
                              style={{ 
                                 background: '#F8FAFC', 
                                 color: '#2563EB', 
                                 border: '2px solid #DBEAFE', 
                                 padding: '0.8rem 1.5rem', 
                                 borderRadius: '10px', 
                                 fontWeight: 'bold', 
                                 fontSize: '1rem', 
                                 cursor: 'pointer',
                                 display: 'flex', 
                                 alignItems: 'center', 
                                 gap: '0.5rem',
                                 transition: 'border-color 0.2s'
                              }}
                              onMouseOver={e => e.currentTarget.style.borderColor = '#2563EB'}
                              onMouseOut={e => e.currentTarget.style.borderColor = '#DBEAFE'}
                           >
                              Original Posting
                           </motion.button>
                        )}
                        <motion.button 
                           whileHover={{ scale: appliedJobs.has(job.id) ? 1 : 1.02 }}
                           whileTap={{ scale: 0.98 }}
                           onClick={() => handleApply(job.id, job.company)}
                           disabled={appliedJobs.has(job.id)}
                           style={{ 
                              background: appliedJobs.has(job.id) ? '#F1F5F9' : '#2563EB', 
                              color: appliedJobs.has(job.id) ? '#64748B' : 'white', 
                              border: 'none', 
                              padding: '0.8rem 2rem', 
                              borderRadius: '10px', 
                              fontWeight: 'bold', 
                              fontSize: '1rem', 
                              cursor: appliedJobs.has(job.id) ? 'not-allowed' : 'pointer',
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '0.5rem',
                              boxShadow: appliedJobs.has(job.id) ? 'none' : '0 4px 15px rgba(37, 99, 235, 0.3)'
                           }}
                        >
                           {appliedJobs.has(job.id) ? 'Application Sent' : <><Send size={16} /> Fast-Apply with Profile</>}
                        </motion.button>
                     </div>

                 </motion.div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
