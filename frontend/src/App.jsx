import { useState, useEffect } from 'react'; // Added useEffect
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

  // --- PERMANENT MEMORY LOGIC ---
  // 1. Load from localStorage when the app starts
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('ecoLensHistory');
    return saved ? JSON.parse(saved) : [];
  });

  // 2. Save to localStorage every time 'history' changes
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
      
      const prompt = `
        You are the EcoLens AI Sustainability Twin for the region: ${locationToAnalyze}. 
        Analyze this user profile:
        - Daily Habits: ${habit}
        - Transport: ${transport}

        Provide a response in exactly this format:
        Score: [A number 0-100]
        Simulation: [Provide a brief "What-If" scenario for their future carbon footprint in ${locationToAnalyze} and one specific green tip]
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      setAiResponse(text);

      // Extract Score
      const scoreMatch = text.match(/Score:\s*(\d+)/);
      const currentScore = scoreMatch ? parseInt(scoreMatch[1]) : 0;
      setScore(currentScore);

      // Add to History
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
          
          <label className={styles.label}>Select Your Region:</label>
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

          <label className={styles.label}>Describe your lifestyle habits:</label>
          <textarea 
            className={styles.input}
            placeholder="e.g., I use solar power and walk to the market."
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
            {loading ? "Simulating Twin..." : "Generate AI Simulation"}
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
              <h4>Insights for {city === 'Other' ? customCity : city}:</h4>
              <p style={{ whiteSpace: 'pre-wrap' }}>
                {aiResponse.replace(/Score:\s*\d+/, '').trim()}
              </p>
            </div>
          </div>
        )}

        {/* Persistent History List */}
        {history.length > 0 && (
          <div className={styles.historySection} style={{ marginTop: '30px', borderTop: '1px solid #ddd', paddingTop: '20px' }}>
            <h3>Your Recent Simulations (Saved)</h3>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {history.map(item => (
                <div key={item.id} style={{ background: '#f0fdf4', padding: '10px', borderRadius: '8px', border: '1px solid #bbf7d0', fontSize: '0.8rem' }}>
                  <strong>{item.location}</strong>: {item.score}% <br/>
                  <small>{item.date}</small>
                </div>
              ))}
            </div>
            <button 
              onClick={() => {setHistory([]); localStorage.removeItem('ecoLensHistory');}}
              style={{marginTop: '10px', fontSize: '0.7rem', color: 'red', border: 'none', background: 'none', cursor: 'pointer'}}
            >
              Clear All History
            </button>
          </div>
        )}
      </main>

      <footer style={{ marginTop: '40px', fontSize: '0.8rem', color: '#666' }}>
        Built for ET GenAI Hackathon 2026 Phase 2
      </footer>
    </div>
  );
}

export default App;