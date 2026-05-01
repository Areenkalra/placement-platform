import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, CheckCircle2, Circle, Clock, Flame, BrainCircuit, Coffee } from 'lucide-react';
import { awardXP } from '../utils/gamification';

// Helper to generate a tailored 7-day schedule based on identified gaps
const generateSchedule = (result) => {
  const isWeak = (key) => result ? (result[key] !== undefined && result[key] < 60) : false;
  const dsaHours = result ? (result.dsaCount < 100 ? 2.5 : result.dsaCount < 300 ? 1.5 : 0.5) : 2;

  const basicDSATask = { text: `${dsaHours} hrs DSA (Leetcode/GFG)`, duration: dsaHours * 60, icon: 'BrainCircuit', completed: false };
  const mockTestTask = { text: '1 Full Mock Assessment', duration: 90, icon: 'Clock', completed: false };
  
  const schedule = [
    { day: 'Monday', label: 'Fundamentals', tasks: [{...basicDSATask, id: 'm1'}] },
    { day: 'Tuesday', label: 'Deep Dive', tasks: [{...basicDSATask, id: 'tu1'}] },
    { day: 'Wednesday', label: 'Mid-Week Review', tasks: [{...basicDSATask, id: 'w1'}] },
    { day: 'Thursday', label: 'Core Concepts', tasks: [{...basicDSATask, id: 'th1'}] },
    { day: 'Friday', label: 'Application', tasks: [{...basicDSATask, id: 'f1'}] },
    { day: 'Saturday', label: 'Mock Day', tasks: [{...mockTestTask, id: 's1'}] },
    { day: 'Sunday', label: 'Rest & Plan', tasks: [{ text: 'Weekly Review & Light Revision', duration: 30, icon: 'Coffee', completed: false, id: 'su1' }] }
  ];

  // Dynamically inject topic-specific modules based on weaknesses
  if (isWeak('oops') || (!result)) {
    schedule[0].tasks.push({ id: 'm2', text: '1.5 hrs Object Oriented Principles (Classes/Inheritance)', duration: 90, icon: 'CheckCircle2', completed: false });
    schedule[3].tasks.push({ id: 'th2', text: '1 hr OOPs Design Patterns & Pseudo-coding', duration: 60, icon: 'CheckCircle2', completed: false });
  }
  if (isWeak('dbms') || (!result)) {
    schedule[1].tasks.push({ id: 'tu2', text: '1.5 hrs SQL Queries & Normalization', duration: 90, icon: 'CheckCircle2', completed: false });
    schedule[4].tasks.push({ id: 'f2', text: '1 hr Advanced Joins & Indexing', duration: 60, icon: 'CheckCircle2', completed: false });
  }
  if (isWeak('cn')) {
    schedule[2].tasks.push({ id: 'w2', text: '1.5 hrs Computer Networks (OSI Model/TCP)', duration: 90, icon: 'CheckCircle2', completed: false });
  }
  if (result && result.projects < 2) {
    schedule[5].tasks.push({ id: 's2', text: '3 hrs Personal Project Development', duration: 180, icon: 'CheckCircle2', completed: false });
    schedule[6].tasks.push({ id: 'su2', text: 'Resume: Document Project Achievements', duration: 45, icon: 'CheckCircle2', completed: false });
  }

  return schedule;
};

export default function StudyPlanner() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [schedule, setSchedule] = useState([]);
  const [activeDayIdx, setActiveDayIdx] = useState(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1); // 0 = Monday, 6 = Sunday
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    // Generate the personalized schedule once
    const rawResult = location.state?.result;
    setSchedule(generateSchedule(rawResult));
    // Check if the user has an existing streak
    setStreak(parseInt(localStorage.getItem('studyStreak') || '0'));
  }, [location.state]);

  const toggleTask = (dayIdx, taskId) => {
    setSchedule(prev => {
      const newSched = prev.map((day, i) => {
        if (i !== dayIdx) return day;
        return {
          ...day,
          tasks: day.tasks.map(task => {
            if (task.id !== taskId) return task;
            return { ...task, completed: !task.completed };
          })
        };
      });

      // Check if all tasks for the day are done
      const wasAllDone = prev[dayIdx].tasks.every(t => t.completed);
      const isAllDoneNow = newSched[dayIdx].tasks.every(t => t.completed);

      // Give a massive XP drop if they just finished a whole day
      if (!wasAllDone && isAllDoneNow) {
         awardXP(100, `Crushed the ${newSched[dayIdx].day} Plan!`);
         setStreak(s => {
           const ns = s + 1;
           localStorage.setItem('studyStreak', ns.toString());
           return ns;
         });
      }
      
      return newSched;
    });
  };

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'BrainCircuit': return <BrainCircuit size={18} />;
      case 'Clock': return <Clock size={18} />;
      case 'Coffee': return <Coffee size={18} />;
      default: return null;
    }
  };

  if (schedule.length === 0) return null;

  const activeDay = schedule[activeDayIdx];
  const completedToday = activeDay.tasks.filter(t => t.completed).length;
  const totalToday = activeDay.tasks.length;
  const progressPct = Math.round((completedToday / totalToday) * 100);

  return (
    <div className="page-container" style={{ paddingTop: '8rem', paddingBottom: '4rem', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '1100px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Header Block */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
           <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem', background: '#FCE7F3', color: '#DB2777', borderRadius: '30px', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '1rem', letterSpacing: '1px' }}>
              <Calendar size={16} /> AI AUTO-SCHEDULER
           </div>
           <h1 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '1rem', color: 'var(--text-main)' }}>
              Your <span style={{ color: 'var(--primary)' }}>Personalized</span> Study Sprint
           </h1>
           <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto' }}>
              We've dynamically generated an execution plan based specifically on the skill gaps identified in your latest performance analysis.
           </p>

           {streak > 0 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem', color: '#F59E0B', fontWeight: 'bold', fontSize: '1.2rem', background: '#FFFBEB', padding: '0.8rem 1.5rem', borderRadius: '30px', border: '1px solid #FCD34D', width: 'fit-content', margin: '1.5rem auto 0' }}>
                 <Flame size={24} fill="#F59E0B" /> {streak} Day Study Streak Active!
              </div>
           )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) 3fr', gap: '2rem' }}>
           
           {/* Navigation Sidebar */}
           <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="glass-card" style={{ padding: '1.5rem', background: '#FFFFFF', alignSelf: 'start' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.5rem' }}>The 7-Day Sprint</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                 {schedule.map((dayObj, idx) => {
                    const isActive = idx === activeDayIdx;
                    const isAllDone = dayObj.tasks.every(t => t.completed);
                    
                    return (
                       <button 
                          key={idx}
                          onClick={() => setActiveDayIdx(idx)}
                          style={{
                             background: isActive ? 'var(--primary)' : isAllDone ? '#ECFDF5' : 'transparent',
                             color: isActive ? '#FFFFFF' : isAllDone ? '#065F46' : 'var(--text-main)',
                             border: 'none',
                             padding: '1rem',
                             borderRadius: '8px',
                             textAlign: 'left',
                             cursor: 'pointer',
                             fontSize: '1.1rem',
                             fontWeight: isActive || isAllDone ? 'bold' : 'normal',
                             transition: 'all 0.2s',
                             display: 'flex',
                             justifyContent: 'space-between',
                             alignItems: 'center'
                          }}
                       >
                          {dayObj.day}
                          {isAllDone && !isActive && <CheckCircle2 size={18} color="#10B981" />}
                       </button>
                    )
                 })}
              </div>
           </motion.div>

           {/* Active Day View */}
           <motion.div 
             key={activeDayIdx} 
             initial={{ opacity: 0, y: 10 }} 
             animate={{ opacity: 1, y: 0 }} 
             exit={{ opacity: 0, scale: 0.95 }}
             style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
           >
              <div className="glass-card" style={{ padding: '2.5rem', background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)', color: 'white' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div>
                       <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>{activeDay.day}</h2>
                       <p style={{ color: '#94A3B8', fontSize: '1.1rem' }}>Focus: {activeDay.label}</p>
                    </div>
                    {progressPct === 100 ? (
                       <div style={{ background: '#10B981', color: 'white', padding: '0.8rem 1.5rem', borderRadius: '30px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)' }}>
                          <CheckCircle2 size={20} /> Day Complete
                       </div>
                    ) : (
                       <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#38BDF8' }}>{progressPct}%</div>
                          <div style={{ color: '#94A3B8', fontSize: '0.9rem' }}>Daily Progress</div>
                       </div>
                    )}
                 </div>

                 {/* Progress Bar Component */}
                 <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ width: `${progressPct}%`, height: '100%', background: '#38BDF8', transition: 'width 0.5s ease-out' }} />
                 </div>
              </div>

              {/* Task Checklist */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                 {activeDay.tasks.map((task) => (
                    <motion.div 
                       key={task.id}
                       layout
                       className="glass-card"
                       style={{ 
                          padding: '1.5rem 2rem', 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '1.5rem', 
                          cursor: 'pointer',
                          background: task.completed ? '#F8FAFC' : '#FFFFFF',
                          border: task.completed ? '1px solid rgba(0,0,0,0.02)' : '1px solid rgba(0,0,0,0.08)',
                          boxShadow: task.completed ? 'none' : '0 4px 10px rgba(0,0,0,0.02)',
                          opacity: task.completed ? 0.7 : 1,
                          transition: 'all 0.2s'
                       }}
                       onClick={() => toggleTask(activeDayIdx, task.id)}
                       whileHover={{ scale: task.completed ? 1 : 1.01 }}
                       whileTap={{ scale: 0.98 }}
                    >
                       <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', border: `2px solid ${task.completed ? '#10B981' : '#CBD5E1'}`, position: 'relative', overflow: 'hidden' }}>
                          <motion.div 
                             initial={{ scale: 0 }} 
                             animate={{ scale: task.completed ? 1 : 0 }} 
                             transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                             style={{ width: '100%', height: '100%', background: '#10B981', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                          >
                             <CheckCircle2 size={20} color="#FFFFFF" style={{ position: 'absolute' }} />
                          </motion.div>
                       </div>
                       
                       <div style={{ flexGrow: 1, textDecoration: task.completed ? 'line-through' : 'none', color: task.completed ? 'var(--text-muted)' : 'var(--text-main)', fontWeight: task.completed ? 'normal' : '600', fontSize: '1.2rem' }}>
                          {task.text}
                       </div>

                       <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', background: '#F1F5F9', padding: '0.3rem 0.8rem', borderRadius: '20px', fontWeight: 'bold' }}>
                          {getIcon(task.icon)} {task.duration}m
                       </div>
                    </motion.div>
                 ))}
              </div>

           </motion.div>
        </div>

      </div>
    </div>
  );
}
