import { useState } from 'react';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAiResponse('');
    setScore(0);

    try {
      // Using the latest model as you discovered
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      
      const prompt = `
        You are the EcoLens AI Sustainability Twin. 
        Analyze this user profile:
        - Daily Habits: ${habit}
        - Transport: ${transport}

        Provide a response in exactly this format:
        Score: [A number 0-100]
        Simulation: [Provide a brief "What-If" scenario for their future carbon footprint and one specific green tip]
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      setAiResponse(text);

      // Logic to extract the number from "Score: XX"
      const scoreMatch = text.match(/Score:\s*(\d+)/);
      if (scoreMatch) {
        setScore(parseInt(scoreMatch[1]));
      }

    } catch (error) {
      setAiResponse("Error connecting to your AI Twin. Please check your connection or API key.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Determine progress bar color based on score
  const getScoreColor = () => {
    if (score > 70) return '#22c55e'; // Green
    if (score > 40) return '#eab308'; // Yellow
    return '#ef4444'; // Red
  };

  return (
    <div className={styles.container}>
      <header>
        <h1 className={styles.title}>EcoLens AI</h1>
        <p className={styles.subtitle}>Your AI Sustainability Twin™</p>
      </header>

      <main>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label}>Describe your lifestyle habits:</label>
          <textarea 
            className={styles.input}
            placeholder="e.g., I eat meat daily, use plastic bags, and forget to turn off the AC."
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
                    style={{ 
                      width: `${score}%`, 
                      backgroundColor: getScoreColor() 
                    }}
                  ></div>
                </div>
              </div>
            )}
            
            <div className={styles.aiText}>
              <h4>AI Simulation Insights:</h4>
              <p style={{ whiteSpace: 'pre-wrap' }}>
                {aiResponse.replace(/Score:\s*\d+/, '').trim()}
              </p>
            </div>
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