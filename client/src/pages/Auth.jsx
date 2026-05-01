import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogIn, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const [otp, setOtp] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState('credentials'); // 'credentials', 'otp', 'forgot-password', 'reset-password'
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const res = await axios.post(`https://node-server-jdys.onrender.com${endpoint}`, formData);
      
      if (isLogin) {
        if (res.data.step === 'otp_required') {
           setStep('otp');
           alert(res.data.message);
        } else {
           localStorage.setItem('token', res.data.token);
           localStorage.setItem('user', JSON.stringify(res.data.user));
           navigate('/form');
        }
      } else {
        alert('Registration successful! Please log in.');
        setIsLogin(true);
        setStep('credentials');
      }
    } catch (err) {
      alert(err.response?.data?.error || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`https://node-server-jdys.onrender.com/api/auth/verify-otp`, {
          email: formData.email,
          otp
      });
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/form');
    } catch (err) {
      alert(err.response?.data?.error || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`https://node-server-jdys.onrender.com/api/auth/forgot-password`, { email: forgotEmail });
      setStep('reset-password');
      alert("OTP sent to your email!");
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`https://node-server-jdys.onrender.com/api/auth/reset-password`, { 
        email: forgotEmail, 
        otp, 
        newPassword 
      });
      alert("Password successfully reset! Please log in.");
      setStep('credentials');
      setIsLogin(true);
      setOtp('');
      setNewPassword('');
    } catch (err) {
      alert(err.response?.data?.error || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw', background: '#09090B', color: '#FAFAFA', fontFamily: '"Inter", sans-serif', overflow: 'hidden' }}>
      
      {/* Decorative Background Glows */}
      <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '800px', height: '800px', background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(80px)' }} />
      <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: '800px', height: '800px', background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(80px)' }} />

      {/* Main Split */}
      <div style={{ display: 'flex', width: '100%', maxWidth: '1600px', margin: '0 auto', zIndex: 1, position: 'relative' }}>
        
        {/* Auth Form Area - 40% Width on Left */}
        <div style={{ flex: '0 0 45%', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '4rem' }}>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ width: '100%', maxWidth: '420px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '24px', padding: '3.5rem 3rem', backdropFilter: 'blur(20px)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '3rem' }}>
               <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #10B981, #38BDF8)', borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)' }}>
                  <LogIn color="white" size={20} />
               </div>
               <span style={{ fontSize: '1.4rem', fontWeight: '900', letterSpacing: '1px' }}>Placement<span style={{color: '#10B981'}}>AI</span></span>
            </div>

            <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem', color: '#FFF' }}>
              {step === 'otp' ? 'Enter OTP' : step === 'forgot-password' ? 'Reset Password' : step === 'reset-password' ? 'New Password' : (isLogin ? 'Sign In' : 'Join PlacementAI')}
            </h2>
            <p style={{ color: '#A1A1AA', fontSize: '1rem', marginBottom: '2.5rem' }}>
              {step === 'otp' ? 'We sent a 6-digit code to your registered contact.' : step === 'forgot-password' ? 'Enter your email to receive a reset code.' : step === 'reset-password' ? 'Enter the OTP and your new password.' : (isLogin ? 'Enter your credentials to access your dashboard.' : 'Start your journey to tech placement supremacy.')}
            </p>

            {step === 'credentials' ? (
              <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} onSubmit={handleSubmit}>
                {!isLogin && (
                  <>
                    <div style={{ position: 'relative' }}>
                      <input type="text" placeholder="Full Name" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={{ width: '100%', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#FFF', padding: '1rem 1.2rem', borderRadius: '12px', fontSize: '1rem', outline: 'none', transition: 'border 0.3s' }} onFocus={e => e.target.style.border = '1px solid #10B981'} onBlur={e => e.target.style.border = '1px solid rgba(255, 255, 255, 0.1)'} />
                    </div>
                    <div style={{ position: 'relative' }}>
                      <input type="tel" placeholder="Phone Number (Optional)" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} style={{ width: '100%', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#FFF', padding: '1rem 1.2rem', borderRadius: '12px', fontSize: '1rem', outline: 'none', transition: 'border 0.3s' }} onFocus={e => e.target.style.border = '1px solid #10B981'} onBlur={e => e.target.style.border = '1px solid rgba(255, 255, 255, 0.1)'} />
                    </div>
                  </>
                )}
                <div style={{ position: 'relative' }}>
                  <input type="email" placeholder="Email Address" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} style={{ width: '100%', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#FFF', padding: '1rem 1.2rem', borderRadius: '12px', fontSize: '1rem', outline: 'none', transition: 'border 0.3s' }} onFocus={e => e.target.style.border = '1px solid #10B981'} onBlur={e => e.target.style.border = '1px solid rgba(255, 255, 255, 0.1)'} />
                </div>
                <div style={{ position: 'relative' }}>
                  <input type="password" placeholder="Password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} style={{ width: '100%', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#FFF', padding: '1rem 1.2rem', borderRadius: '12px', fontSize: '1rem', outline: 'none', transition: 'border 0.3s' }} onFocus={e => e.target.style.border = '1px solid #10B981'} onBlur={e => e.target.style.border = '1px solid rgba(255, 255, 255, 0.1)'} />
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  style={{ background: 'linear-gradient(135deg, #10B981, #059669)', color: 'white', border: 'none', padding: '1rem', borderRadius: '12px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', marginTop: '1rem', boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                  disabled={loading}
                >
                  {loading ? <span style={{ animation: 'spin 1s linear infinite' }}>↻</span> : (isLogin ? <><LogIn size={20} /> Access Portal</> : <><UserPlus size={20} /> Create Account</>)}
                </motion.button>
                
                {isLogin && (
                  <div style={{ textAlign: 'center', marginTop: '-0.5rem' }}>
                    <span onClick={() => setStep('forgot-password')} style={{ color: '#A1A1AA', fontSize: '0.9rem', cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = '#FFF'} onMouseOut={e => e.target.style.color = '#A1A1AA'}>
                      Forgot Password?
                    </span>
                  </div>
                )}
              </form>
            ) : step === 'otp' ? (
              <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} onSubmit={handleOtpSubmit}>
                <div style={{ position: 'relative' }}>
                  <input type="text" placeholder="Enter 6-digit OTP" required value={otp} onChange={(e) => setOtp(e.target.value)} style={{ width: '100%', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#FFF', padding: '1rem 1.2rem', borderRadius: '12px', fontSize: '1.5rem', outline: 'none', transition: 'border 0.3s', textAlign: 'center', letterSpacing: '4px' }} onFocus={e => e.target.style.border = '1px solid #10B981'} onBlur={e => e.target.style.border = '1px solid rgba(255, 255, 255, 0.1)'} maxLength={6} />
                </div>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  style={{ background: 'linear-gradient(135deg, #10B981, #059669)', color: 'white', border: 'none', padding: '1rem', borderRadius: '12px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', marginTop: '1rem', boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                  disabled={loading}
                >
                  {loading ? <span style={{ animation: 'spin 1s linear infinite' }}>↻</span> : 'Verify OTP'}
                </motion.button>
                <div style={{ textAlign: 'center' }}>
                  <span onClick={() => setStep('credentials')} style={{ color: '#A1A1AA', fontSize: '0.9rem', cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = '#FFF'} onMouseOut={e => e.target.style.color = '#A1A1AA'}>
                    ← Back to Login
                  </span>
                </div>
              </form>
            ) : step === 'forgot-password' ? (
              <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} onSubmit={handleForgotPassword}>
                <div style={{ position: 'relative' }}>
                  <input type="email" placeholder="Enter your registered email" required value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} style={{ width: '100%', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#FFF', padding: '1rem 1.2rem', borderRadius: '12px', fontSize: '1rem', outline: 'none', transition: 'border 0.3s' }} onFocus={e => e.target.style.border = '1px solid #10B981'} onBlur={e => e.target.style.border = '1px solid rgba(255, 255, 255, 0.1)'} />
                </div>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  style={{ background: 'linear-gradient(135deg, #10B981, #059669)', color: 'white', border: 'none', padding: '1rem', borderRadius: '12px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', marginTop: '1rem', boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                  disabled={loading}
                >
                  {loading ? <span style={{ animation: 'spin 1s linear infinite' }}>↻</span> : 'Send Reset Code'}
                </motion.button>
                <div style={{ textAlign: 'center' }}>
                  <span onClick={() => setStep('credentials')} style={{ color: '#A1A1AA', fontSize: '0.9rem', cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = '#FFF'} onMouseOut={e => e.target.style.color = '#A1A1AA'}>
                    ← Back to Login
                  </span>
                </div>
              </form>
            ) : (
              <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} onSubmit={handleResetPassword}>
                <div style={{ position: 'relative' }}>
                  <input type="text" placeholder="Enter 6-digit OTP" required value={otp} onChange={(e) => setOtp(e.target.value)} style={{ width: '100%', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#FFF', padding: '1rem 1.2rem', borderRadius: '12px', fontSize: '1.5rem', outline: 'none', transition: 'border 0.3s', textAlign: 'center', letterSpacing: '4px' }} onFocus={e => e.target.style.border = '1px solid #10B981'} onBlur={e => e.target.style.border = '1px solid rgba(255, 255, 255, 0.1)'} maxLength={6} />
                </div>
                <div style={{ position: 'relative' }}>
                  <input type="password" placeholder="Enter new password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} style={{ width: '100%', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#FFF', padding: '1rem 1.2rem', borderRadius: '12px', fontSize: '1rem', outline: 'none', transition: 'border 0.3s' }} onFocus={e => e.target.style.border = '1px solid #10B981'} onBlur={e => e.target.style.border = '1px solid rgba(255, 255, 255, 0.1)'} />
                </div>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  style={{ background: 'linear-gradient(135deg, #10B981, #059669)', color: 'white', border: 'none', padding: '1rem', borderRadius: '12px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', marginTop: '1rem', boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                  disabled={loading}
                >
                  {loading ? <span style={{ animation: 'spin 1s linear infinite' }}>↻</span> : 'Reset Password'}
                </motion.button>
              </form>
            )}

            {step === 'credentials' && (
              <div style={{ marginTop: '2rem', textAlign: 'center', color: '#A1A1AA', fontSize: '0.95rem' }}>
                 {isLogin ? "Don't have an account? " : "Already have an account? "}
                 <span 
                   onClick={() => setIsLogin(!isLogin)}
                   style={{ color: '#38BDF8', cursor: 'pointer', fontWeight: '600', transition: 'color 0.2s' }}
                   onMouseOver={e => e.target.style.color = '#7DD3FC'}
                   onMouseOut={e => e.target.style.color = '#38BDF8'}
                 >
                   {isLogin ? 'Sign up' : 'Sign in'}
                 </span>
              </div>
            )}
          </motion.div>
        </div>

        {/* Right Side - Hero Splash */}
        <div style={{ flex: '1 1 55%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '4rem', paddingLeft: '6rem' }}>
           <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', color: '#34D399', padding: '0.5rem 1rem', borderRadius: '30px', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '2rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
                 v4.0 Next-Gen Core
              </div>
              <h1 style={{ fontSize: '5rem', fontWeight: '900', lineHeight: 1.1, marginBottom: '2rem', color: '#FFFFFF' }}>
                 Accelerate Your <br />
                 <span style={{ background: 'linear-gradient(to right, #10B981, #38BDF8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Tech Career.</span>
              </h1>
              <p style={{ color: '#A1A1AA', fontSize: '1.3rem', lineHeight: 1.7, maxWidth: '600px', marginBottom: '3rem' }}>
                 Harness an advanced AI engine to instantly pinpoint your exact placement probability, build resilient daily roadmaps, and secure your dream offer at top product organizations.
              </p>
              
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                 <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem 1.5rem', borderRadius: '15px' }}>
                    <div style={{ color: '#10B981', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '0.2rem' }}>AI Digital Twin</div>
                    <div style={{ color: '#71717A', fontSize: '0.9rem' }}>Predict Future Outcomes</div>
                 </div>
                 <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem 1.5rem', borderRadius: '15px' }}>
                    <div style={{ color: '#38BDF8', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '0.2rem' }}>Auto-Scheduler</div>
                    <div style={{ color: '#71717A', fontSize: '0.9rem' }}>Smart 7-Day Sprints</div>
                 </div>
              </div>
           </motion.div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}} /> 
    </div>
  );
}
