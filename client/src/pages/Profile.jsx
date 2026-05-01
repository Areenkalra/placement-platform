import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Star, History, Target, Zap } from 'lucide-react';
import { getGameState, ALL_BADGES } from '../utils/gamification';

export default function Profile() {
  const [gameState, setGameState] = useState(getGameState());

  useEffect(() => {
    // Poll localstorage just to be fresh if another tab updated it, though usually manual refresh is fine
    setGameState(getGameState());
  }, []);

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return `${d.toLocaleDateString()} at ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <div className="page-container" style={{ paddingTop: '8rem', paddingBottom: '4rem', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Profile Header Block */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass-card" style={{ padding: '3rem', display: 'flex', alignItems: 'center', gap: '3rem', background: '#FFFFFF' }}>
           
           <div style={{ position: 'relative' }}>
              <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'linear-gradient(135deg, #4F46E5 0%, #0EA5E9 100%)', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 8px 30px rgba(79, 70, 229, 0.3)' }}>
                 <span style={{ fontSize: '3rem', color: '#FFF' }}>🎓</span>
              </div>
              <div style={{ position: 'absolute', bottom: '-10px', right: '-10px', background: '#F59E0B', color: '#FFF', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', border: '3px solid #FFF', boxShadow: '0 4px 10px rgba(245, 158, 11, 0.4)' }}>
                 L{gameState.level}
              </div>
           </div>

           <div style={{ flexGrow: 1 }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <div>
                   <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.2rem' }}>Local Candidate</h1>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.2rem', letterSpacing: '1px' }}>
                     <Star size={18} fill="currentColor" /> {gameState.title} Rank
                   </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                   <div style={{ fontSize: '2rem', fontWeight: '900', color: '#10B981' }}>{gameState.xp} XP</div>
                   <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Experience Points</div>
                </div>
             </div>
             
             {/* Progress Bar */}
             <div style={{ marginTop: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>
                   <span>{gameState.prevLevelXP} XP</span>
                   <span>{gameState.level === 4 ? 'MAX LEVEL' : `${gameState.nextLevelXP} XP`}</span>
                </div>
                <div style={{ width: '100%', height: '10px', background: '#E2E8F0', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ width: `${gameState.progress}%`, height: '100%', background: 'linear-gradient(90deg, #4F46E5, #38BDF8)', transition: 'width 1s ease-out' }} />
                </div>
             </div>
           </div>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
           
           {/* Badges Collection */}
           <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="glass-card" style={{ padding: '2.5rem', background: '#FFFFFF' }}>
             <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.3rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>
                <Award color="#4F46E5" /> Unlocked Badges
             </h3>

             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
               {ALL_BADGES.map(badge => {
                 const isUnlocked = gameState.rawBadges.includes(badge.id);
                 return (
                   <div key={badge.id} style={{ 
                     display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', 
                     borderRadius: '12px', border: isUnlocked ? '1px solid #10B981' : '1px solid rgba(0,0,0,0.05)',
                     background: isUnlocked ? '#ECFDF5' : '#F8FAFC',
                     opacity: isUnlocked ? 1 : 0.6,
                     filter: isUnlocked ? 'none' : 'grayscale(100%)'
                   }}>
                      <div style={{ fontSize: '2rem' }}>{badge.icon}</div>
                      <div>
                         <div style={{ fontWeight: 'bold', color: isUnlocked ? '#065F46' : 'var(--text-muted)', fontSize: '1rem' }}>{badge.name}</div>
                         <div style={{ fontSize: '0.75rem', color: isUnlocked ? '#047857' : 'var(--text-muted)' }}>{badge.desc}</div>
                      </div>
                   </div>
                 )
               })}
             </div>
           </motion.div>

           {/* History Module */}
           <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="glass-card" style={{ padding: '2.5rem', background: '#FFFFFF' }}>
             <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.3rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>
                <History color="#4F46E5" /> Recent Progression
             </h3>
             
             {gameState.history.length === 0 ? (
               <div style={{ padding: '2rem', textAlign: 'center', background: '#F8FAFC', borderRadius: '12px', color: 'var(--text-muted)' }}>
                 <Target size={40} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                 <p>No activity yet. Complete some assessments or upload a resume to earn XP!</p>
               </div>
             ) : (
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '400px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                 {gameState.history.map((h, i) => (
                   <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', paddingBottom: '1rem', borderBottom: i !== gameState.history.length-1 ? '1px solid rgba(0,0,0,0.05)' : 'none' }}>
                      <div style={{ background: '#EEF2FF', padding: '0.5rem', borderRadius: '50%', color: '#4F46E5' }}>
                        <Zap size={16} />
                      </div>
                      <div style={{ flexGrow: 1 }}>
                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 'bold', color: 'var(--text-main)', fontSize: '0.95rem' }}>{h.reason}</span>
                            <span style={{ color: '#10B981', fontWeight: '900' }}>+{h.amount} XP</span>
                         </div>
                         <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{formatDate(h.date)}</div>
                      </div>
                   </div>
                 ))}
               </div>
             )}
           </motion.div>

        </div>
      </div>
    </div>
  );
}
