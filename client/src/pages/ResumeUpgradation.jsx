import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { UploadCloud, FileText, Briefcase, Zap, CheckCircle, AlertTriangle } from 'lucide-react';
import { logActivity } from '../utils/activityLogger';

export default function ResumeUpgradation() {
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeName, setResumeName] = useState("");
  const [jdText, setJdText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [editedText, setEditedText] = useState("");

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResumeFile(file);
      setResumeName(file.name);
    }
  };

  const handleAnalyze = async () => {
    if (!resumeFile) {
      alert("Please upload your PDF resume.");
      return;
    }
    if (!jdText.trim()) {
      alert("Please paste the Job Description.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('resume', resumeFile);
    formData.append('jd', jdText);

    try {
      const res = await axios.post('http://localhost:5001/analyze-resume-jd', formData);
      setResult(res.data);
      setEditedText(res.data.extractedText || "");
      logActivity("Resume Upgrader Analysis", `Analyzed resume "${resumeFile.name}" against target JD.`);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Error analyzing resume. Make sure ML service is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleReAnalyze = async () => {
    if (!editedText.trim()) {
      alert("Text cannot be empty.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('resume_text', editedText);
    formData.append('jd', jdText);

    try {
      const res = await axios.post('http://localhost:5001/analyze-resume-jd', formData);
      setResult(res.data);
      setEditedText(res.data.extractedText || editedText);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Error re-analyzing resume text.");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="page-container" style={{ padding: '8rem 1rem 4rem', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
      <motion.div 
        style={{ width: '100%', maxWidth: '900px' }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem', color: 'var(--text-main)' }}>
            AI Resume <span style={{ color: 'var(--primary)' }}>Upgrader</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>
            Compare your resume against any Job Description. Uncover missing skills and get actionable tweaks.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
          
          {/* Resume Upload Card */}
          <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>
              <FileText color="var(--primary)" /> 1. Upload Resume
            </h3>
            <div style={{ 
              border: '2px dashed #CBD5E1', 
              borderRadius: '12px', 
              padding: '2rem', 
              textAlign: 'center',
              background: '#F8FAFC',
              position: 'relative',
              cursor: 'pointer',
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              {resumeName ? (
                <>
                  <CheckCircle size={40} color="#10B981" style={{ margin: '0 auto 1rem' }} />
                  <p style={{ color: '#10B981', fontWeight: 'bold' }}>{resumeName}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Click to change file</p>
                </>
              ) : (
                <>
                  <UploadCloud size={40} color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
                  <p style={{ color: 'var(--text-main)', fontWeight: 'bold' }}>Select PDF File</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Max size: 5MB</p>
                </>
              )}
              <input 
                type="file" 
                accept=".pdf" 
                onChange={handleFileUpload}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} 
              />
            </div>
          </div>

          {/* JD Input Card */}
          <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>
              <Briefcase color="#F59E0B" /> 2. Paste Job Description
            </h3>
            <textarea 
              className="input-field"
              placeholder="Paste the target job description requirements here..."
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              style={{ minHeight: '200px', flexGrow: 1, resize: 'vertical' }}
            />
          </div>
        </div>

        <motion.button 
          className="btn" 
          style={{ width: '100%', padding: '1.2rem', fontSize: '1.2rem', marginBottom: '3rem' }}
          onClick={handleAnalyze}
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '20px', height: '20px', border: '3px solid rgba(0,0,0,0.1)', borderTopColor: '#4F46E5', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              Running AI Analysis...
            </span>
          ) : (
            <><Zap size={24} /> Generate Upgrade Report</>
          )}
        </motion.button>

        {/* Results Section */}
        {result && (
          <motion.div 
            className="glass-card" 
            style={{ padding: '3rem', background: '#FFFFFF' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '2rem' }}>
              <div>
                <h2 style={{ fontSize: '2rem', color: 'var(--text-main)' }}>Analysis Results</h2>
                <p style={{ color: 'var(--text-muted)' }}>Here is how your resume aligns with the JD.</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: '3rem', 
                  fontWeight: '800', 
                  color: result.matchPercentage >= 75 ? '#10B981' : result.matchPercentage >= 50 ? '#F59E0B' : '#EF4444' 
                }}>
                  {result.matchPercentage}%
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px' }}>Match Score</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
              <div>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10B981', marginBottom: '1rem', fontSize: '1.1rem' }}>
                  <CheckCircle size={20} /> Matched Skills
                </h4>
                {result.matchedSkills.length > 0 ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {result.matchedSkills.map(skill => (
                      <span key={skill} style={{ background: '#ECFDF5', color: '#10B981', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.9rem', border: '1px solid #A7F3D0' }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: 'var(--text-muted)' }}>No explicit tech skills matched.</p>
                )}
              </div>

              <div>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#EF4444', marginBottom: '1rem', fontSize: '1.1rem' }}>
                  <AlertTriangle size={20} /> Missing Skills
                </h4>
                {result.missingSkills.length > 0 ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {result.missingSkills.map(skill => (
                      <span key={skill} style={{ background: '#FEF2F2', color: '#EF4444', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.9rem', border: '1px solid #FECACA' }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: 'var(--text-muted)' }}>You have all the required base skills!</p>
                )}
              </div>
            </div>

            <div style={{ background: '#F8FAFC', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)' }}>
              <h3 style={{ color: 'var(--primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Zap size={22} /> Recommended Tweaks
              </h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingLeft: '1.5rem', color: 'var(--text-main)', lineHeight: '1.6' }}>
                {result.tweaks.map((tweak, idx) => (
                  <li key={idx}>{tweak}</li>
                ))}
              </ul>
            </div>

            {/* Editor Section */}
            <div style={{ background: '#F8FAFC', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)', marginTop: '2rem' }}>
              <h3 style={{ color: 'var(--text-main)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={22} color="#6366F1" /> Resume Text Editor (Fix Typos & Re-run)
              </h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                Browser spellcheck is enabled! Edit your parsed resume text directly below to fix typos, correct bad OCR formatting, or experiment with adding missing JD keywords, then re-analyze to test your new score.
              </p>
              <textarea 
                className="input-field"
                spellCheck="true"
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                style={{ width: '100%', minHeight: '300px', resize: 'vertical', fontFamily: 'monospace', fontSize: '0.9rem', lineHeight: '1.5', padding: '1rem', borderRadius: '8px' }}
              />
              <button 
                className="btn" 
                onClick={handleReAnalyze} 
                disabled={loading}
                style={{ marginTop: '1rem', width: '100%', padding: '1rem', background: '#6366F1', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
              >
                {loading ? 'Re-analyzing...' : <><Zap size={20} /> Re-Analyze Edited Text</>}
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}} />
    </div>
  );
}
