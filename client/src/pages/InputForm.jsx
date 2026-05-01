import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { UploadCloud, FileText, CheckCircle, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function InputForm() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [parseLoading, setParseLoading] = useState(false);
  const [resumeName, setResumeName] = useState("");
  
  const location = useLocation();
  const [formData, setFormData] = useState({
    cgpa: 8.0,
    dsaCount: 100,
    projects: 2,
    internships: 0,
    certifications: 1,
    oops: 75,
    cn: 70,
    dbms: 70,
    technicalSkills: 'React, Node, Python'
  });

  useEffect(() => {
    // If arriving from Mock Test, autobill the state
    if (location.state && location.state.autoFill) {
      setFormData(prev => ({ ...prev, ...location.state.autoFill }));
    }

    // Basic auth check for demo purposes
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      // Allow testing without login
      setUser({ name: "Demo User", email: "demo@example.com" });
    }
  }, [navigate, location.state]);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const fillDemoData = () => {
    setFormData({
      cgpa: 8.8,
      dsaCount: 350,
      projects: 3,
      internships: 1,
      certifications: 2,
      oops: 85,
      cn: 80,
      dbms: 85,
      technicalSkills: 'React, Node, Python, AWS, Docker'
    });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setResumeName(file.name);
    setParseLoading(true);
    const pdfData = new FormData();
    pdfData.append('resume', file);

    try {
      const res = await axios.post('https://python-ml-service-bku1.onrender.com/upload-resume', pdfData);
      const parsedData = res.data;
      
      setFormData(prev => ({
        ...prev,
        cgpa: parsedData.cgpa || prev.cgpa,
        dsaCount: parsedData.dsaCount || prev.dsaCount,
        projects: Math.max(parsedData.projects || prev.projects, 1),
        internships: parsedData.internships || prev.internships,
        certifications: parsedData.certifications || prev.certifications,
        oops: parsedData.oops || prev.oops,
        cn: parsedData.cn || prev.cn,
        dbms: parsedData.dbms || prev.dbms,
        technicalSkills: parsedData.skills && parsedData.skills.length > 0 
            ? parsedData.skills.join(', ') 
            : prev.technicalSkills
      }));
      
      alert(parsedData.message || 'Resume parsed! Form automatically filled.');
    } catch (err) {
      console.error(err);
      alert('Error parsing resume. Make sure ML service is running.');
    } finally {
      setParseLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: user?.name,
        email: user?.email,
        cgpa: Number(formData.cgpa),
        dsaCount: Number(formData.dsaCount),
        projects: Number(formData.projects),
        internships: Number(formData.internships),
        certifications: Number(formData.certifications),
        oops: Number(formData.oops),
        cn: Number(formData.cn),
        dbms: Number(formData.dbms),
        technicalSkills: formData.technicalSkills.split(',').map(s => s.trim())
      };
      
      const res = await axios.post('https://node-server-jdys.onrender.com/api/predict', payload);
      navigate('/dashboard', { state: { result: res.data } });
    } catch (error) {
      console.error(error);
      alert('Error connecting to backend API');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAFA', paddingTop: '8rem', paddingBottom: '4rem', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '1200px', padding: '0 2rem' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
           <h1 style={{ fontSize: '3rem', fontWeight: '900', color: '#1E293B', letterSpacing: '-1px' }}>PlacementAI <span style={{ color: '#10B981' }}>Intake</span></h1>
           <p style={{ fontSize: '1.2rem', color: '#64748B', maxWidth: '600px', margin: '0 auto' }}>Provide your core metrics below to generate a hyper-accurate placement prediction and a personalized upskilling roadmap.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem' }}>
            
            {/* LEFT COLUMN: Fast-Track Tools */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
               <motion.div whileHover={{ y: -5 }} className="glass-card" style={{ padding: '2rem', background: 'linear-gradient(145deg, #1E293B, #0F172A)', color: 'white', borderRadius: '20px', border: '1px solid #334155', position: 'relative', overflow: 'hidden' }}>
                  {parseLoading ? (
                     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '120px' }}>
                        <div className="spinner" style={{ border: '3px solid rgba(255,255,255,0.1)', borderTop: '3px solid #10B981', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', marginBottom: '1rem' }} />
                        <span style={{ fontWeight: 'bold', color: '#34D399' }}>AI Matrix Scanning...</span>
                     </div>
                  ) : resumeName ? (
                     <div style={{ textAlign: 'center' }}>
                        <CheckCircle size={40} color="#10B981" style={{ margin: '0 auto 1rem' }} />
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Resume Parsed!</h3>
                        <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>{resumeName}</p>
                     </div>
                  ) : (
                     <div style={{ textAlign: 'center', cursor: 'pointer' }}>
                        <UploadCloud size={40} color="#38BDF8" style={{ margin: '0 auto 1rem' }} />
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>AI Auto-Extract</h3>
                        <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>Upload your PDF Resume here to instantly populate your metrics.</p>
                     </div>
                  )}
                  <input type="file" accept=".pdf" onChange={handleFileUpload} disabled={parseLoading} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: parseLoading ? 'not-allowed' : 'pointer' }} />
               </motion.div>

               <motion.div whileHover={{ y: -5 }} onClick={() => navigate('/test')} className="glass-card" style={{ padding: '2rem', background: '#ECFDF5', color: '#064E3B', borderRadius: '20px', border: '1px solid #A7F3D0', textAlign: 'center', cursor: 'pointer' }}>
                  <FileText size={40} color="#10B981" style={{ margin: '0 auto 1rem' }} />
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Don't know your scores?</h3>
                  <p style={{ color: '#059669', fontSize: '0.9rem', marginBottom: '1rem' }}>Take our adaptive MCQ test to accurately gauge your domain knowledge.</p>
                  <span style={{ fontWeight: 'bold', color: '#047857' }}>Start Assessment →</span>
               </motion.div>

               <motion.div whileHover={{ y: -5 }} onClick={fillDemoData} className="glass-card" style={{ padding: '1.5rem', background: '#F8FAFC', color: '#334155', borderRadius: '20px', border: '1px solid #E2E8F0', textAlign: 'center', cursor: 'pointer' }}>
                  <Zap size={24} color="#F59E0B" style={{ margin: '0 auto 0.5rem' }} />
                  <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>Populate Sample Data</span>
               </motion.div>
            </div>

            {/* RIGHT COLUMN: Manual Form */}
            <motion.div className="glass-card" style={{ padding: '3rem', background: '#FFFFFF', borderRadius: '20px', border: '1px solid #F1F5F9', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.05)' }}>
               <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '2rem', color: '#1E293B', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ background: '#10B981', width: '8px', height: '24px', borderRadius: '4px' }}></span>
                  Manual Entry Fields
               </h3>

               <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  
                  {/* Category 1: Academics & Experience */}
                  <div>
                     <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#94A3B8', marginBottom: '1rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.5rem' }}>Academics & Experience</h4>
                     <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.5rem' }}>
                        <div>
                           <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#64748B', marginBottom: '0.5rem' }}>CGPA (10.0)</label>
                           <input type="number" step="0.1" name="cgpa" value={formData.cgpa} onChange={handleChange} required style={{ width: '100%', padding: '0.8rem 1rem', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', fontSize: '1rem', outline: 'none' }} onFocus={e => e.target.style.borderColor='#10B981'} onBlur={e => e.target.style.borderColor='#E2E8F0'} />
                        </div>
                        <div>
                           <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#64748B', marginBottom: '0.5rem' }}>Projects Built</label>
                           <input type="number" name="projects" value={formData.projects} onChange={handleChange} required style={{ width: '100%', padding: '0.8rem 1rem', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', fontSize: '1rem', outline: 'none' }} onFocus={e => e.target.style.borderColor='#10B981'} onBlur={e => e.target.style.borderColor='#E2E8F0'} />
                        </div>
                        <div>
                           <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#64748B', marginBottom: '0.5rem' }}>Internships</label>
                           <input type="number" name="internships" value={formData.internships} onChange={handleChange} required style={{ width: '100%', padding: '0.8rem 1rem', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', fontSize: '1rem', outline: 'none' }} onFocus={e => e.target.style.borderColor='#10B981'} onBlur={e => e.target.style.borderColor='#E2E8F0'} />
                        </div>
                        <div>
                           <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#64748B', marginBottom: '0.5rem' }}>Certifications</label>
                           <input type="number" name="certifications" value={formData.certifications} onChange={handleChange} required style={{ width: '100%', padding: '0.8rem 1rem', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', fontSize: '1rem', outline: 'none' }} onFocus={e => e.target.style.borderColor='#10B981'} onBlur={e => e.target.style.borderColor='#E2E8F0'} />
                        </div>
                     </div>
                  </div>

                  {/* Category 2: Domain Knowledge */}
                  <div>
                     <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#94A3B8', marginBottom: '1rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.5rem' }}>Domain Competence (%)</h4>
                     <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1.5rem' }}>
                        <div>
                           <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#64748B', marginBottom: '0.5rem' }}>DSA Solved</label>
                           <input type="number" name="dsaCount" value={formData.dsaCount} onChange={handleChange} required style={{ width: '100%', padding: '0.8rem 1rem', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', fontSize: '1rem', outline: 'none' }} onFocus={e => e.target.style.borderColor='#10B981'} onBlur={e => e.target.style.borderColor='#E2E8F0'} />
                        </div>
                        <div>
                           <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#64748B', marginBottom: '0.5rem' }}>OOPs Score</label>
                           <input type="number" name="oops" value={formData.oops} onChange={handleChange} required style={{ width: '100%', padding: '0.8rem 1rem', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', fontSize: '1rem', outline: 'none' }} onFocus={e => e.target.style.borderColor='#10B981'} onBlur={e => e.target.style.borderColor='#E2E8F0'} />
                        </div>
                        <div>
                           <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#64748B', marginBottom: '0.5rem' }}>CN Score</label>
                           <input type="number" name="cn" value={formData.cn} onChange={handleChange} required style={{ width: '100%', padding: '0.8rem 1rem', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', fontSize: '1rem', outline: 'none' }} onFocus={e => e.target.style.borderColor='#10B981'} onBlur={e => e.target.style.borderColor='#E2E8F0'} />
                        </div>
                        <div>
                           <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#64748B', marginBottom: '0.5rem' }}>DBMS Score</label>
                           <input type="number" name="dbms" value={formData.dbms} onChange={handleChange} required style={{ width: '100%', padding: '0.8rem 1rem', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', fontSize: '1rem', outline: 'none' }} onFocus={e => e.target.style.borderColor='#10B981'} onBlur={e => e.target.style.borderColor='#E2E8F0'} />
                        </div>
                     </div>
                  </div>

                  {/* Category 3: Tech Stack */}
                  <div>
                     <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#94A3B8', marginBottom: '1rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.5rem' }}>Technical Stack</h4>
                     <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#64748B', marginBottom: '0.5rem' }}>Core Skills (Comma Separated)</label>
                        <input type="text" name="technicalSkills" value={formData.technicalSkills} onChange={handleChange} placeholder="e.g. React, Python, PostgreSQL" style={{ width: '100%', padding: '1rem', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', fontSize: '1rem', outline: 'none' }} onFocus={e => e.target.style.borderColor='#10B981'} onBlur={e => e.target.style.borderColor='#E2E8F0'} />
                     </div>
                  </div>

                  <motion.button 
                     whileHover={{ scale: 1.01 }}
                     whileTap={{ scale: 0.99 }}
                     type="submit" 
                     disabled={loading}
                     style={{ marginTop: '1rem', padding: '1.2rem', width: '100%', background: 'linear-gradient(135deg, #1E293B, #0F172A)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 10px 20px -5px rgba(15, 23, 42, 0.4)' }}
                  >
                     {loading ? 'Processing Twin Analysis...' : 'Generate Prediction Matrix →'}
                  </motion.button>

               </form>
            </motion.div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}} />
    </div>
  );
}
