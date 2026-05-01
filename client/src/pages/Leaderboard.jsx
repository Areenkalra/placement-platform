import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Star, TrendingUp, Users } from 'lucide-react';
import { getGameState } from '../utils/gamification';

export default function Leaderboard() {
  const [gameState, setGameState] = useState(getGameState());
  const [board, setBoard] = useState([]);

  useEffect(() => {
    // We recreate a realistic leaderboard array and inject our local user based on their actual XP points
    const baseMock = [
       { id: 'm1', name: 'Aarav Sharma', xp: 5200, title: 'Master' },
       { id: 'm2', name: 'Ishita Patel', xp: 4850, title: 'Master' },
       { id: 'm3', name: 'Rohan Gupta', xp: 4100, title: 'Master' },
       { id: 'm4', name: 'Neha Singh', xp: 3500, title: 'Master' },
       { id: 'm5', name: 'Dev Joshi', xp: 2900, title: 'Pro' },
       { id: 'm6', name: 'Priya Mehta', xp: 2750, title: 'Pro' },
       { id: 'm7', name: 'Karan Desai', xp: 2200, title: 'Pro' },
       { id: 'm8', name: 'Sneha Verma', xp: 1800, title: 'Pro' },
       { id: 'm9', name: 'Ananya Rao', xp: 1200, title: 'Apprentice' },
       { id: 'm10', name: 'Varun Kumar', xp: 800, title: 'Apprentice' }
    ];

    const currentState = getGameState();
    setGameState(currentState);

    const userEntry = { id: 'local_user', name: 'You (Local User)', xp: currentState.xp, title: currentState.title, isUser: true };
    
    // Combine and sort
    const combined = [...baseMock, userEntry].sort((a, b) => b.xp - a.xp);
    
    // Add rank
    const ranked = combined.map((u, i) => ({ ...u, rank: i + 1 }));
    setBoard(ranked);

  }, []);

  // Top 3 distinct styles
  const renderPodium = () => {
     if (board.length < 3) return null;
     
     const getPodiumStyle = (rank) => {
        if(rank === 1) return { height: '180px', bg: 'linear-gradient(135deg, #FCD34D, #F59E0B)', border: '#D97706', star: '#FFF', width: '35%' };
        if(rank === 2) return { height: '140px', bg: 'linear-gradient(135deg, #E2E8F0, #94A3B8)', border: '#64748B', star: '#FFF', width: '32%' };
        return { height: '120px', bg: 'linear-gradient(135deg, #FDBA74, #D97706)', border: '#B45309', star: '#FFF', width: '32%' };
     };

     // Render order visually: 2, 1, 3
     const top3Display = [board[1], board[0], board[2]];

     return (
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '0.5rem', marginBottom: '4rem', height: '250px' }}>
           {top3Display.map(user => {
              const p = getPodiumStyle(user.rank);
              const isUser = user.isUser;
              
              return (
                 <motion.div key={user.rank} initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: user.rank * 0.1 }} style={{ width: p.width, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: isUser ? 'var(--primary)' : 'var(--text-main)', marginBottom: '0.5rem', textAlign: 'center' }}>
                      {user.name.split(' ')[0]} 
                      {isUser && <span style={{ fontSize: '0.8rem', display: 'block', color: 'var(--primary)' }}>(You)</span>}
                    </div>
                    <div style={{ background: '#F8FAFC', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '1rem' }}>{user.xp} XP</div>
                    
                    <div style={{ width: '100%', height: p.height, background: p.bg, borderTop: `4px solid ${p.border}`, borderTopLeftRadius: '12px', borderTopRightRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '1.5rem', position: 'relative', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                       <div style={{ position: 'absolute', top: '-25px', width: '50px', height: '50px', background: p.border, borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: p.star, fontWeight: '900', fontSize: '1.5rem', border: '3px solid #FFF', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>
                          {user.rank}
                       </div>
                    </div>
                 </motion.div>
              )
           })}
        </div>
     )
  };

  return (
    <div className="page-container" style={{ paddingTop: '8rem', paddingBottom: '4rem', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '800px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem', background: '#FFFBEB', color: '#D97706', borderRadius: '30px', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '1rem', letterSpacing: '1px' }}>
            <Trophy size={16} /> GLOBAL RANKINGS (MOCK)
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
            The <span style={{ color: 'var(--primary)' }}>Leaderboard</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Compare your Experience Points (XP) against top performing virtual engineers.</p>
        </div>

        {renderPodium()}

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass-card" style={{ padding: '0', background: '#FFFFFF', overflow: 'hidden' }}>
           <div style={{ display: 'flex', backgroundColor: '#F8FAFC', padding: '1.5rem 2rem', fontWeight: 'bold', color: 'var(--text-muted)', borderBottom: '1px solid rgba(0,0,0,0.05)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
              <div style={{ width: '10%' }}>Rank</div>
              <div style={{ width: '50%' }}>Candidate</div>
              <div style={{ width: '20%' }}>Level</div>
              <div style={{ width: '20%', textAlign: 'right' }}>Score</div>
           </div>

           <div style={{ display: 'flex', flexDirection: 'column' }}>
             {board.map((user, idx) => {
                const isUser = user.isUser;
                return (
                   <div key={user.id} style={{ display: 'flex', alignItems: 'center', padding: '1.5rem 2rem', borderBottom: idx !== board.length-1 ? '1px solid rgba(0,0,0,0.05)' : 'none', background: isUser ? '#EEF2FF' : '#FFFFFF', transition: 'background 0.2s', cursor: 'default' }} onMouseOver={e => { if(!isUser) e.currentTarget.style.background = '#F8FAFC' }} onMouseOut={e => { if(!isUser) e.currentTarget.style.background = '#FFFFFF' }}>
                      <div style={{ width: '10%', fontWeight: '900', color: isUser ? 'var(--primary)' : 'var(--text-muted)', fontSize: '1.2rem' }}>
                         #{user.rank}
                      </div>
                      <div style={{ width: '50%', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                         <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: isUser ? 'var(--primary)' : '#E2E8F0', color: isUser ? 'white' : 'var(--text-muted)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>
                            {user.name.charAt(0)}
                         </div>
                         <strong style={{ color: isUser ? 'var(--primary)' : 'var(--text-main)', fontSize: '1.1rem' }}>{user.name}</strong>
                      </div>
                      <div style={{ width: '20%' }}>
                         <span style={{ background: isUser ? 'rgba(79, 70, 229, 0.1)' : '#F1F5F9', color: isUser ? 'var(--primary)' : 'var(--text-muted)', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>{user.title}</span>
                      </div>
                      <div style={{ width: '20%', textAlign: 'right', fontWeight: '900', color: isUser ? '#10B981' : 'var(--text-main)', fontSize: '1.1rem' }}>
                         {user.xp.toLocaleString()} XP
                      </div>
                   </div>
                )
             })}
           </div>
        </motion.div>

      </div>
    </div>
  );
}
