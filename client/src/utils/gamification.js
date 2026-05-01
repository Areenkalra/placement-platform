/**
 * Gamification Core Utilities
 * Simulates a robust ranking and points system entirely on the frontend using localStorage.
 */

export const ALL_BADGES = [
  { id: 'first_login', name: 'Early Bird', desc: 'Signed in for the first time.', icon: '🌅' },
  { id: 'first_analysis', name: 'Data Miner', desc: 'Completed your first Prediction Analysis.', icon: '📊' },
  { id: 'mock_test_1', name: 'Knowledge Seeker', desc: 'Completed a Mock Test.', icon: '🧠' },
  { id: 'mock_test_100', name: 'Perfect Score', desc: 'Scored 100% on a Mock Assessment.', icon: '🎯' },
  { id: 'twin_used', name: 'Time Traveler', desc: 'Simulated a future outcome with the Digital Twin.', icon: '⏳' },
  { id: 'resume_god', name: 'Aesthetic Resume', desc: 'Used the AI resume upgrader.', icon: '📄' }
];

export const getGameState = () => {
  const xp = parseInt(localStorage.getItem('userXP') || '0');
  const rawBadges = JSON.parse(localStorage.getItem('userBadges') || '[]');
  const history = JSON.parse(localStorage.getItem('userHistory') || '[]');

  let level = 1;
  let title = "Beginner";
  let nextLevelXP = 500;
  let prevLevelXP = 0;

  if (xp >= 3000) { 
    level = 4; title = "Master"; nextLevelXP = 3000; prevLevelXP = 3000; 
  } else if (xp >= 1500) { 
    level = 3; title = "Pro"; nextLevelXP = 3000; prevLevelXP = 1500; 
  } else if (xp >= 500) { 
    level = 2; title = "Apprentice"; nextLevelXP = 1500; prevLevelXP = 500; 
  }

  // Calculate percentage through current level (0-100%)
  let progress = 100;
  if (level < 4) {
    const xpIntoLevel = xp - prevLevelXP;
    const levelRange = nextLevelXP - prevLevelXP;
    progress = Math.min(100, Math.round((xpIntoLevel / levelRange) * 100));
  }

  // Map to full objects
  const badges = rawBadges.map(bId => ALL_BADGES.find(b => b.id === bId)).filter(Boolean);

  return { xp, level, title, nextLevelXP, prevLevelXP, progress, badges, rawBadges, history };
};

export const awardXP = (amount, reason) => {
  const xp = parseInt(localStorage.getItem('userXP') || '0');
  const history = JSON.parse(localStorage.getItem('userHistory') || '[]');
  
  const newXP = xp + amount;
  
  history.unshift({ reason, amount, date: new Date().toISOString() });
  
  localStorage.setItem('userXP', newXP.toString());
  // Keep history capped at 50 events
  localStorage.setItem('userHistory', JSON.stringify(history.slice(0, 50)));
  
  return newXP;
};

export const awardBadge = (badgeId) => {
  const badges = JSON.parse(localStorage.getItem('userBadges') || '[]');
  if (!badges.includes(badgeId)) {
    badges.push(badgeId);
    localStorage.setItem('userBadges', JSON.stringify(badges));
    awardXP(100, `Badge Unlocked: ${badgeId}`);
    return true; 
  }
  return false;
};
