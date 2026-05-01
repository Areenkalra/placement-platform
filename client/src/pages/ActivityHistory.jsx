import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, FileText, Cpu, Briefcase, Activity } from 'lucide-react';
import axios from 'axios';

export default function ActivityHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const userEmail = localStorage.getItem('userEmail') || 'user@example.com';
        const res = await axios.post('http://localhost:5000/api/activity/history', { email: userEmail });
        setHistory(res.data);
      } catch (error) {
        console.error("Failed to fetch history", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const getIcon = (action) => {
    if (action.includes('Resume')) return <FileText size={20} color="#3B82F6" />;
    if (action.includes('Twin')) return <Cpu size={20} color="#10B981" />;
    if (action.includes('Job')) return <Briefcase size={20} color="#F59E0B" />;
    return <Activity size={20} color="#8B5CF6" />;
  };

  return (
    <div className="page-container" style={{ padding: '8rem 2rem', minHeight: '100vh', background: '#F8FAFC' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '900', color: '#1E293B', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Clock color="#2563EB" size={40} /> Activity Log
        </h1>
        
        {loading ? (
           <p style={{ fontSize: '1.2rem', color: '#64748B' }}>Loading your timeline...</p>
        ) : history.length === 0 ? (
           <div style={{ background: 'white', padding: '4rem 2rem', borderRadius: '15px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0' }}>
              <Clock size={48} color="#94A3B8" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ color: '#1E293B', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>No Activity Yet</h3>
              <p style={{ color: '#64748B', fontSize: '1.1rem' }}>Start exploring the platform to build your history timeline.</p>
           </div>
        ) : (
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {history.map((item, idx) => (
                 <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={item.id} 
                    style={{ background: 'white', padding: '1.5rem', borderRadius: '15px', display: 'flex', alignItems: 'flex-start', gap: '1.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', border: '1px solid #E2E8F0' }}
                 >
                    <div style={{ padding: '1rem', background: '#F8FAFC', borderRadius: '50%', border: '1px solid #E2E8F0' }}>
                       {getIcon(item.action)}
                    </div>
                    <div>
                       <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1E293B', marginBottom: '0.3rem' }}>{item.action}</h3>
                       <p style={{ color: '#64748B', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                          {new Date(item.timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                       </p>
                       {item.details && <p style={{ color: '#475569', fontSize: '0.95rem', background: '#F1F5F9', padding: '0.8rem', borderRadius: '8px', marginTop: '0.5rem' }}>{item.details}</p>}
                    </div>
                 </motion.div>
              ))}
           </div>
        )}
      </div>
    </div>
  );
}
