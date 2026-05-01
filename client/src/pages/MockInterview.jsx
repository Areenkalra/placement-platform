import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send, MessageSquare, AlertCircle, CheckCircle, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

const questions = [
  "Tell me about yourself and your background.",
  "What is your strongest technical skill and how have you applied it?",
  "Describe a time you faced a difficult bug. How did you resolve it?",
  "Why do you want to work as a Software Engineer?",
  "Where do you see yourself in 5 years?"
];

export default function MockInterview() {
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [answer, setAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { role: 'bot', text: questions[0] }
  ]);
  const [metrics, setMetrics] = useState({ score: 0, feedback: '', improvements: [] });
  const [loading, setLoading] = useState(false);
  const [recognition, setRecognition] = useState(null);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, metrics]);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;

      rec.onresult = (event) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setAnswer(prev => {
          // A bit hacky to manage continuous dictation without jumping, 
          // usually best to replace the current ongoing sentence.
          // For simplicity, we just set it. In a real app we'd manage final vs interim.
          // If the user types, mixing speech is hard, so we just append if final.
          if (event.results[event.results.length-1].isFinal) {
             return prev + " " + event.results[event.results.length-1][0].transcript;
          }
          return prev;
        });
      };

      rec.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsRecording(false);
      };

      setRecognition(rec);
    }
  }, []);

  const toggleRecording = () => {
    if (!recognition) {
      alert("Your browser does not support Speech Recognition. Try Google Chrome.");
      return;
    }
    
    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      recognition.start();
      setIsRecording(true);
    }
  };

  const handleSubmit = async () => {
    if (!answer.trim()) return;
    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    }

    const currentQuestion = questions[currentQIdx];
    
    // Add User Message
    setChatHistory(prev => [...prev, { role: 'user', text: answer }]);
    setLoading(true);

    try {
      const res = await axios.post('https://python-ml-service-bku1.onrender.com/analyze-interview', {
        question: currentQuestion,
        answer: answer
      });

      // Show NLP Metrics
      setMetrics({
        score: res.data.confidence_score,
        feedback: res.data.feedback,
        improvements: res.data.improvements || []
      });

      // Advance question or end
      if (currentQIdx < questions.length - 1) {
        setTimeout(() => {
          setChatHistory(prev => [...prev, { role: 'bot', text: questions[currentQIdx + 1] }]);
          setCurrentQIdx(prev => prev + 1);
        }, 1500);
      } else {
        setTimeout(() => {
          setChatHistory(prev => [...prev, { role: 'bot', text: "Interview complete! Great job practicing today." }]);
        }, 1500);
      }

    } catch (err) {
      console.error(err);
      alert('Error connecting to ML Service');
    } finally {
      setAnswer('');
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ padding: '8rem 1rem 4rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem', color: 'var(--text-main)' }}>
          AI Mock <span style={{ color: 'var(--primary)' }}>Interview</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          Simulate a real HR/Technical screening. Use your microphone to practice speaking clearly, and get instant NLP feedback.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem', width: '100%', maxWidth: '1100px', alignItems: 'flex-start' }}>
        
        {/* Chat Interface */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '600px', overflow: 'hidden', padding: 0 }}>
          
          <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(0,0,0,0.05)', background: '#F8FAFC', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #4F46E5, #0EA5E9)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
              <MessageSquare size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>AI Recruiter</h3>
              <p style={{ fontSize: '0.8rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <span style={{ width: '8px', height: '8px', background: '#10B981', borderRadius: '50%', display: 'inline-block' }}></span> Online
              </p>
            </div>
          </div>

          <div style={{ flexGrow: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', background: '#FFFFFF' }}>
            {chatHistory.map((chat, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  alignSelf: chat.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: chat.role === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div style={{ 
                  background: chat.role === 'user' ? '#4F46E5' : '#F1F5F9', 
                  color: chat.role === 'user' ? 'white' : '#1E293B',
                  padding: '1rem 1.2rem',
                  borderRadius: chat.role === 'user' ? '20px 20px 0 20px' : '20px 20px 20px 0',
                  lineHeight: '1.5',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                }}>
                  {chat.text}
                </div>
              </motion.div>
            ))}
            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ alignSelf: 'flex-start', background: '#F1F5F9', padding: '1rem', borderRadius: '20px 20px 20px 0', display: 'flex', gap: '0.5rem' }}>
                <div style={{ width: '8px', height: '8px', background: '#94A3B8', borderRadius: '50%', animation: 'pulse 1s infinite' }} />
                <div style={{ width: '8px', height: '8px', background: '#94A3B8', borderRadius: '50%', animation: 'pulse 1s infinite 0.2s' }} />
                <div style={{ width: '8px', height: '8px', background: '#94A3B8', borderRadius: '50%', animation: 'pulse 1s infinite 0.4s' }} />
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(0,0,0,0.05)', background: '#F8FAFC', display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button 
              onClick={toggleRecording}
              style={{ 
                width: '50px', height: '50px', borderRadius: '50%', flexShrink: 0,
                background: isRecording ? '#EF4444' : '#E2E8F0',
                color: isRecording ? 'white' : '#64748B',
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                boxShadow: isRecording ? '0 0 15px rgba(239, 68, 68, 0.4)' : 'none'
              }}
              title={isRecording ? "Stop Recording" : "Start Recording"}
            >
              {isRecording ? <MicOff size={22} /> : <Mic size={22} />}
            </button>
            <input 
              type="text" 
              className="input-field" 
              placeholder={isRecording ? "Listening..." : "Type your answer or use the microphone..."}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              style={{ flexGrow: 1, padding: '1rem', borderRadius: '25px', border: '1px solid rgba(0,0,0,0.1)' }}
            />
            <button 
              onClick={handleSubmit}
              disabled={loading || (!answer.trim() && !isRecording)}
              style={{
                width: '50px', height: '50px', borderRadius: '50%', flexShrink: 0,
                background: answer.trim() && !loading ? '#4F46E5' : '#E2E8F0',
                color: answer.trim() && !loading ? 'white' : '#94A3B8',
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                border: 'none', cursor: answer.trim() && !loading ? 'pointer' : 'not-allowed', transition: 'all 0.2s'
              }}
            >
              <Send size={20} />
            </button>
          </div>
        </div>

        {/* Live Feedback Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className="glass-card" style={{ padding: '2rem', background: '#FFFFFF' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>
              <Zap color="#F59E0B" /> Real-Time Analytics
            </h3>
            
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ 
                width: '120px', height: '120px', borderRadius: '50%', margin: '0 auto 1rem',
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                background: metrics.score >= 80 ? '#ECFDF5' : metrics.score >= 50 ? '#FFFBEB' : '#FEF2F2',
                border: `4px solid ${metrics.score >= 80 ? '#10B981' : metrics.score >= 50 ? '#F59E0B' : '#EF4444'}`,
                color: metrics.score >= 80 ? '#10B981' : metrics.score >= 50 ? '#F59E0B' : '#EF4444',
                fontSize: '2.5rem', fontWeight: 'bold'
              }}>
                {metrics.score || '--'}
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Confidence Score</p>
            </div>

            <div style={{ background: '#F8FAFC', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)' }}>
               <h4 style={{ fontSize: '1rem', color: '#1E293B', marginBottom: '0.5rem' }}>AI Feedback</h4>
               <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                 {metrics.feedback || "Answer a question to get real-time NLP feedback."}
               </p>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '2rem', background: '#FFFFFF' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: '#EF4444' }}>
              <AlertCircle /> Communication Tips
            </h3>
            {metrics.improvements.length > 0 ? (
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingLeft: '1.5rem', color: 'var(--text-muted)' }}>
                {metrics.improvements.map((imp, i) => (
                  <li key={i}>{imp}</li>
                ))}
              </ul>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10B981' }}>
                <CheckCircle size={20} /> <span style={{ fontSize: '0.95rem' }}>No critical issues detected. Keep it up!</span>
              </div>
            )}
          </div>

        </div>
        
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}} />
    </div>
  );
}
