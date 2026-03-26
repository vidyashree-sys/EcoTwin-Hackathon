# 🌍 EcoLens AI: Your Sustainability Digital Twin™

**Built for ET GenAI Hackathon 2026 - Phase 2** *Empowering individuals from Tier-1 cities to rural villages with AI-driven environmental forecasting.*

---

## 🚀 Live Demo
**Check out the live project here:** https://eco-twin-hackathon-git-main-vidyashree-sys-projects.vercel.app/


---

## 📖 Project Overview
EcoLens AI is a Generative AI-powered "What-If" engine that simulates a user's environmental impact over a 5-year horizon. Unlike static carbon calculators that provide one-time figures, EcoLens creates a **Behavioral Digital Twin** to project future ecological outcomes based on lifestyle choices, regional context, and habit consistency.

### 🧠 The Core Innovation
- **Digital Twin Simulation:** Moves beyond tracking the past to simulating the future.
- **Hyper-Local Intelligence:** Adapts reasoning based on the specific power grids and climates of Indian cities and villages.
- **Greenwashing Detector:** Uses LLM reasoning to identify inefficient "eco-friendly" habits and suggests high-impact alternatives.

---

## ✨ Key Features
- **Regional Context Engine:** Select from major metros (Bengaluru, Delhi, Mumbai) or enter any specific Village/Town for localized analysis.
- **5-Year Outlook:** Provides a predictive "Risk vs. Reward" analysis of the user's current trajectory.
- **Sustainability Score:** A dynamic 0-100% rating with visual feedback.
- **Persistent Memory:** Integration with Browser `localStorage` ensures your "Twin's" history is saved across sessions without a database.
- **Professional UI:** Built with React and CSS Modules for a clean, scalable, and responsive experience.

---
## 📸 Interface Preview

<img width="1877" height="951" alt="Screenshot 2026-03-26 203818" src="https://github.com/user-attachments/assets/df98902f-a276-43d3-a629-84a2c383c799" />


<img width="1878" height="947" alt="image" src="https://github.com/user-attachments/assets/070317e5-85fc-41d7-869f-97598a9ceb11" />


*Visualizing the 5-Year Environmental Outlook and Sustainability Score.*
---

## 🛠️ Tech Stack
| Layer | Technology |
| :--- | :--- |
| **Frontend** | React.js (Vite) |
| **Styling** | CSS Modules (Scoped Styles) |
| **AI Engine** | Google Gemini 2.5 Flash API |
| **Persistence** | Browser LocalStorage API |
| **Hosting** | Vercel Edge Network |

---

## 🏗️ Architecture
The project follows a **Decoupled Client-AI Model**:
1. **Input Layer:** Captures regional data, lifestyle habits, and transport preferences.
2. **Intelligence Layer:** Sends data to the **Gemini 2.5 Flash** model for multi-step reasoning.
3. **Persistence Layer:** Automatically syncs results to `localStorage` using React `useEffect` hooks.
4. **Display Layer:** Renders structured insights (Current Path vs. Optimized Path).

---

## 🚦 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- A Google Gemini API Key

### Installation & Local Setup
1. **Clone the repository:**
   ```bash
   git clone https://github.com/vidyashree-sys/EcoTwin-Hackathon.git
   cd frontend
