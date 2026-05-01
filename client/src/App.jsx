import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { Trophy, UserCircle, LogOut, Calendar, Briefcase, Search } from 'lucide-react';
import Auth from './pages/Auth';
import InputForm from './pages/InputForm';
import Dashboard from './pages/Dashboard';
import MockTest from './pages/MockTest';
import PrepHub from './pages/PrepHub';
import CompanyInsights from './pages/CompanyInsights';
import ResumeUpgradation from './pages/ResumeUpgradation';
import MockInterview from './pages/MockInterview';
import CompanyPrep from './pages/CompanyPrep';
import DigitalTwin from './pages/DigitalTwin';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import StudyPlanner from './pages/StudyPlanner';
import JobMatch from './pages/JobMatch';
import ActivityHistory from './pages/ActivityHistory';
import GlobalJobSearch from './pages/GlobalJobSearch';

const NavDropdown = ({ title, children }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div 
      style={{ position: 'relative', display: 'flex', alignItems: 'center', height: '100%' }} 
      onMouseEnter={() => setIsOpen(true)} 
      onMouseLeave={() => setIsOpen(false)}
    >
      <span style={{ fontWeight: '500', cursor: 'pointer', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
        {title} <span style={{ fontSize: '0.7rem' }}>▼</span>
      </span>
      {isOpen && (
        <div style={{ position: 'absolute', top: '100%', left: '-10%', background: 'white', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', padding: '0.5rem 0', minWidth: '180px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {children}
        </div>
      )}
    </div>
  );
};

const DropdownLink = ({ to, currentPath, children }) => (
  <Link 
    to={to} 
    style={{ 
      color: currentPath === to ? 'var(--primary)' : 'var(--text-main)', 
      textDecoration: 'none', 
      fontWeight: '500', 
      padding: '0.8rem 1.5rem',
      transition: 'background 0.2s, color 0.2s',
      display: 'block'
    }}
    onMouseEnter={e => { e.currentTarget.style.background = '#F8FAFC'; e.currentTarget.style.color = 'var(--primary)'; }}
    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = currentPath === to ? 'var(--primary)' : 'var(--text-main)'; }}
  >
    {children}
  </Link>
);

function NavBar() {
  const location = useLocation();
  if (location.pathname === '/') return null; // No nav on login page

  return (
    <nav style={{ position: 'fixed', top: 0, left: 0, width: '100%', padding: '1rem 3rem', display: 'flex', alignItems: 'center', gap: '2.5rem', zIndex: 50, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
      <Link to="/dashboard" style={{ fontWeight: '900', fontSize: '1.4rem', color: 'var(--text-main)', marginRight: '1rem', textDecoration: 'none', letterSpacing: '1px' }}>Placement<span style={{ color: '#10B981' }}>AI</span></Link>
      
      <Link to="/dashboard" style={{ color: location.pathname === '/dashboard' ? 'var(--primary)' : 'var(--text-main)', textDecoration: 'none', fontWeight: '500', transition: 'color 0.2s' }}>Dashboard</Link>
      
      <NavDropdown title="Tools & Analysis">
        <DropdownLink to="/form" currentPath={location.pathname}>Analysis Form</DropdownLink>
        <DropdownLink to="/digital-twin" currentPath={location.pathname}>Virtual Twin</DropdownLink>
        <DropdownLink to="/insights" currentPath={location.pathname}>Company Insights</DropdownLink>
        <DropdownLink to="/resume-upgrade" currentPath={location.pathname}>Resume Upgrader</DropdownLink>
      </NavDropdown>

      <NavDropdown title="Preparation">
        <DropdownLink to="/test" currentPath={location.pathname}>Mock Test</DropdownLink>
        <DropdownLink to="/prep" currentPath={location.pathname}>Prep Hub</DropdownLink>
        <DropdownLink to="/interview" currentPath={location.pathname}>Mock Interview</DropdownLink>
        <DropdownLink to="/company-prep" currentPath={location.pathname}>Target Orgs</DropdownLink>
      </NavDropdown>

      <Link to="/history" style={{ color: location.pathname === '/history' ? 'var(--primary)' : 'var(--text-main)', textDecoration: 'none', fontWeight: '500', transition: 'color 0.2s' }}>History</Link>
      
      <div style={{ flexGrow: 1 }} />
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
         <Link to="/job-search" style={{ color: location.pathname === '/job-search' ? '#0284C7' : 'var(--text-muted)', display: 'flex', alignItems: 'center', transition: 'all 0.2s', transform: location.pathname === '/job-search' ? 'scale(1.1)' : 'scale(1)' }} title="Global LinkedIn Search">
            <Search size={22} />
         </Link>
         <Link to="/jobs" style={{ color: location.pathname === '/jobs' ? '#2563EB' : 'var(--text-muted)', display: 'flex', alignItems: 'center', transition: 'all 0.2s', transform: location.pathname === '/jobs' ? 'scale(1.1)' : 'scale(1)' }} title="AI Recruiter ATS Match">
            <Briefcase size={22} />
         </Link>
         <Link to="/planner" style={{ color: location.pathname === '/planner' ? '#10B981' : 'var(--text-muted)', display: 'flex', alignItems: 'center', transition: 'all 0.2s', transform: location.pathname === '/planner' ? 'scale(1.1)' : 'scale(1)' }} title="AI Study Planner">
            <Calendar size={22} />
         </Link>
         <Link to="/leaderboard" style={{ color: location.pathname === '/leaderboard' ? '#F59E0B' : 'var(--text-muted)', display: 'flex', alignItems: 'center', transition: 'all 0.2s', transform: location.pathname === '/leaderboard' ? 'scale(1.1)' : 'scale(1)' }} title="Leaderboard">
            <Trophy size={22} />
         </Link>
         <div style={{ width: '1px', height: '24px', background: 'rgba(0,0,0,0.1)', margin: '0 0.5rem' }} />
         <Link to="/profile" style={{ color: location.pathname === '/profile' ? 'var(--primary)' : 'var(--text-main)', display: 'flex', alignItems: 'center', transition: 'all 0.2s', transform: location.pathname === '/profile' ? 'scale(1.1)' : 'scale(1)' }}>
            <UserCircle size={26} />
         </Link>
         <span style={{ color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#EF4444'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'} onClick={() => { localStorage.clear(); window.location.href = '/'; }}>
            <LogOut size={22} />
         </span>
      </div>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <NavBar />
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/form" element={<InputForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/test" element={<MockTest />} />
          <Route path="/prep" element={<PrepHub />} />
          <Route path="/insights" element={<CompanyInsights />} />
          <Route path="/resume-upgrade" element={<ResumeUpgradation />} />
          <Route path="/interview" element={<MockInterview />} />
          <Route path="/company-prep" element={<CompanyPrep />} />
          <Route path="/digital-twin" element={<DigitalTwin />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/planner" element={<StudyPlanner />} />
          <Route path="/jobs" element={<JobMatch />} />
          <Route path="/job-search" element={<GlobalJobSearch />} />
          <Route path="/history" element={<ActivityHistory />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
export default App;
