import { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import styles from './App.module.css';

// Initialize the AI with your Environment Variable
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_KEY);

function App() {
  const [habit, setHabit] = useState('');
  const [transport, setTransport] = useState('Public Transport');
  const [aiResponse, setAiResponse] = useState('');
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Location States
  const [city, setCity] = useState('Bengaluru'); 
  const [customCity, setCustomCity] = useState('');

  // Permanent Memory Logic
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('ecoLensHistory');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('ecoLensHistory', JSON.stringify(history));
  }, [history]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAiResponse('');
    setScore(0);

    const locationToAnalyze = city === 'Other' ? customCity : city;

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      
      // DAY 3 UPGRADED PROMPT: Focuses on "What-If" Simulations and Greenwashing
      const prompt = `
        You are the EcoLens AI Sustainability Twin for the region: ${locationToAnalyze}.
        Analyze this user profile:
        - Daily Habits: ${habit}
        - Transport: ${transport}

        Provide a response in exactly this format:
        Score: [A number 0-100]
        
        Current Path (5-Year Outlook): [Describe the environmental impact if these habits continue in ${locationToAnalyze}]
        
        Optimized Path (The Reward): [Describe the positive change if the user adopts ONE specific local habit]
        
        Expert Insight: [Identify if any of the user's habits are 'Greenwashing' or actually inefficient]
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      setAiResponse(text);

      const scoreMatch = text.match(/Score:\s*(\d+)/);
      const currentScore = scoreMatch ? parseInt(scoreMatch[1]) : 0;
      setScore(currentScore);

      const newEntry = {
        id: Date.now(),
        location: locationToAnalyze,
        score: currentScore,
        date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setHistory(prev => [newEntry, ...prev]);

    } catch (error) {
      setAiResponse("Error connecting to your AI Twin. Please check your connection.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = () => {
    if (score > 70) return '#22c55e';
    if (score > 40) return '#eab308';
    return '#ef4444';
  };

  return (
    <div className={styles.container}>
      <header>
        <h1 className={styles.title}>EcoLens AI</h1>
        <p className={styles.subtitle}>Your AI Sustainability Twin™</p>
      </header>

      <main>
        <form className={styles.form} onSubmit={handleSubmit}>
          
          <label className={styles.label}>Location Context:</label>
          <select 
            className={styles.select} 
            value={city} 
            onChange={(e) => setCity(e.target.value)}
          >
            <option value="Bengaluru">Bengaluru</option>
            <option value="Delhi">Delhi</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Other">Other (Village/Town)</option>
          </select>

          {city === 'Other' && (
            <input 
              type="text"
              className={styles.input}
              placeholder="Enter Village or Town Name"
              value={customCity}
              onChange={(e) => setCustomCity(e.target.value)}
              required
              style={{ marginTop: '10px' }}
            />
          )}

          <label className={styles.label}>Daily Habits & Lifestyle:</label>
          <textarea 
            className={styles.input}
            placeholder="e.g., I drink bottled water, use a petrol scooter, and compost waste."
            value={habit}
            onChange={(e) => setHabit(e.target.value)}
            required
            rows="3"
          />

          <label className={styles.label}>Primary Transport:</label>
          <select 
            className={styles.select} 
            value={transport} 
            onChange={(e) => setTransport(e.target.value)}
          >
            <option value="Petrol/Diesel Car">Petrol/Diesel Car</option>
            <option value="Electric Vehicle">Electric Vehicle</option>
            <option value="Public Transport">Public Transport</option>
            <option value="Bicycle/Walking">Bicycle/Walking</option>
          </select>

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Running Simulation..." : "Sync My Digital Twin"}
          </button>
        </form>

        {/* Results Section */}
        {aiResponse && (
          <div className={styles.responseBox}>
            {score > 0 && (
              <div className={styles.scoreSection}>
                <h3>Sustainability Rating: {score}%</h3>
                <div className={styles.progressBarContainer}>
                  <div 
                    className={styles.progressBar}
                    style={{ width: `${score}%`, backgroundColor: getScoreColor() }}
                  ></div>
                </div>
              </div>
            )}
            
            <div className={styles.aiText}>
              <h4>EcoLens Twin Analysis for {city === 'Other' ? customCity : city}:</h4>
              <div className={styles.insightCard}>
                {/* Logic to format the AI text into structured blocks */}
                {aiResponse.replace(/Score:\s*\d+/, '').trim().split('\n').map((line, index) => (
                  <p key={index} className={line.includes(':') ? styles.insightHeader : styles.insightLine}>
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Persistent History List */}
        {history.length > 0 && (
          <div className={styles.historySection} style={{ marginTop: '40px', borderTop: '2px solid #eee', paddingTop: '20px' }}>
            <h3>Your Twin's Timeline (History)</h3>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {history.map(item => (
                <div key={item.id} style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', minWidth: '150px' }}>
                  <strong>{item.location}</strong><br/>
                  <span style={{color: '#059669', fontWeight: 'bold'}}>{item.score}% Score</span><br/>
                  <small style={{color: '#94a3b8'}}>{item.date}</small>
                </div>
              ))}
            </div>
            <button 
              onClick={() => {setHistory([]); localStorage.removeItem('ecoLensHistory');}}
              style={{marginTop: '15px', fontSize: '0.75rem', color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer', textDecoration: 'underline'}}
            >
              Reset History
            </button>
          </div>
        )}
      </main>

      <footer style={{ marginTop: '50px', fontSize: '0.8rem', color: '#94a3b8', textAlign: 'center' }}>
        EcoLens AI • GenAI Hackathon Phase 2 • 2026
      </footer>
    </div>
  );
}

export default App;