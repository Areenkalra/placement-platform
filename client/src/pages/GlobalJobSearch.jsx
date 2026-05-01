import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Briefcase, ExternalLink, Globe } from 'lucide-react';
import axios from 'axios';
import { logActivity } from '../utils/activityLogger';

export default function GlobalJobSearch() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setHasSearched(true);
    try {
      const res = await axios.post('https://node-server-jdys.onrender.com/api/live/search', {
        query: query.trim(),
        location: location.trim()
      });
      setJobs(res.data);
      logActivity("Global LinkedIn Search", `Searched for ${query} in ${location || 'Anywhere'}`);
    } catch (err) {
      console.error(err);
      alert("Error fetching LinkedIn jobs. Try again.");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ padding: '8rem 2rem', minHeight: '100vh', background: '#F8FAFC' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem', background: '#E0F2FE', color: '#0284C7', borderRadius: '30px', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '1rem', letterSpacing: '1px' }}>
            <Globe size={16} /> LINKEDIN INTEGRATION
          </div>
          <h1 style={{ fontSize: '3.5rem', fontWeight: '900', color: '#1E293B', letterSpacing: '-1px', marginBottom: '1rem' }}>
            Global <span style={{ color: '#0284C7' }}>Job Search</span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#64748B', maxWidth: '600px', margin: '0 auto' }}>
            Search for any role, anywhere. Our AI will scan LinkedIn in real-time to find active listings.
          </p>
        </div>

        {/* Search Bar */}
        <motion.form 
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ background: 'white', padding: '1.5rem', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', display: 'flex', gap: '1rem', marginBottom: '4rem', flexWrap: 'wrap' }}
        >
          <div style={{ flexGrow: 2, display: 'flex', alignItems: 'center', background: '#F1F5F9', borderRadius: '12px', padding: '0 1rem', minWidth: '250px' }}>
            <Search color="#64748B" size={20} />
            <input 
              type="text" 
              placeholder="Job title, keywords, or company..." 
              value={query}
              onChange={e => setQuery(e.target.value)}
              style={{ width: '100%', background: 'transparent', border: 'none', padding: '1rem', fontSize: '1.1rem', outline: 'none', color: '#1E293B' }}
              required
            />
          </div>
          <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', background: '#F1F5F9', borderRadius: '12px', padding: '0 1rem', minWidth: '200px' }}>
            <MapPin color="#64748B" size={20} />
            <input 
              type="text" 
              placeholder="City, state, or Remote" 
              value={location}
              onChange={e => setLocation(e.target.value)}
              style={{ width: '100%', background: 'transparent', border: 'none', padding: '1rem', fontSize: '1.1rem', outline: 'none', color: '#1E293B' }}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            style={{ background: '#0284C7', color: 'white', border: 'none', padding: '0 2.5rem', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', minHeight: '60px' }}
          >
            {loading ? <div style={{ width: '20px', height: '20px', border: '3px solid #E0F2FE', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /> : 'Search'}
          </button>
        </motion.form>

        {/* Results */}
        {loading ? (
           <div style={{ textAlign: 'center', padding: '4rem 0' }}>
               <h3 style={{ fontSize: '1.5rem', color: '#1E293B', marginBottom: '1rem' }}>AI is scanning LinkedIn...</h3>
               <p style={{ color: '#64748B' }}>This can take up to 10 seconds to process live results.</p>
           </div>
        ) : hasSearched && jobs.length === 0 ? (
           <div style={{ textAlign: 'center', padding: '4rem 0', color: '#64748B' }}>
               No jobs found for this exact criteria. Try broadening your search.
           </div>
        ) : (
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {jobs.map((job, idx) => (
                 <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={idx} 
                    className="glass-card"
                    style={{ background: 'white', padding: '2rem', borderRadius: '15px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}
                 >
                    <div>
                       <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#1E293B', marginBottom: '0.5rem' }}>{job.title}</h2>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', color: '#64748B', fontSize: '0.95rem', fontWeight: '500', flexWrap: 'wrap' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#0284C7', fontWeight: 'bold' }}><Briefcase size={16} /> {job.company}</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><MapPin size={16} /> {job.location}</span>
                          {job.salary && <span>{job.salary}</span>}
                       </div>
                       {job.postedDate && <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginTop: '1rem' }}>Posted: {job.postedDate}</p>}
                    </div>
                    
                    {job.url && job.url !== '#' && (
                       <button 
                          onClick={() => window.open(job.url, '_blank')}
                          style={{ background: '#0284C7', color: 'white', border: 'none', padding: '0.8rem 2rem', borderRadius: '10px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                       >
                          Apply on LinkedIn <ExternalLink size={18} />
                       </button>
                    )}
                 </motion.div>
              ))}
           </div>
        )}

      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}} />
    </div>
  );
}
