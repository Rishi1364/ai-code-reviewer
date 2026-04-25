import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

// --- EDITORS ---
import Editor from "@monaco-editor/react";
import CodeEditor from "@uiw/react-textarea-code-editor";

// --- ICONS ---
import {
  FaGoogle,
  FaSignOutAlt,
  FaHistory,
  FaShareAlt,
  FaCode,
  FaBolt,
  FaWrench,
  FaSun,
  FaMoon,
  FaChartLine,
  FaFileAlt,
  FaSyncAlt,
  FaLinkedin,
  FaGithub,
} from "react-icons/fa";

// --- FIREBASE ---
import { collection, addDoc } from 'firebase/firestore';
import { auth, logout, signInWithGoogle, db } from './firebase';
import { onAuthStateChanged } from "firebase/auth";

// --- COMPONENTS ---
import ProfileDropdown from './components/ProfileDropdown';
import HistoryPanel from './components/HistoryPanel';
import ShareModal from './components/ShareModal';
// import Login from "./components/Auth/Login";

// --- STYLES ---
import "./App.css";

function App() {

  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  /// --- LISTENS FOR SHARED CODE IN URL ---
  useEffect(() => {
    // 1. Check if there is ?code=... in the URL
    const params = new URLSearchParams(window.location.search);
    const sharedCode = params.get('code');

    // 2. If found, update the editor
    if (sharedCode) {
      setCode(sharedCode);
      // Optional: Clean the URL back to normal
      window.history.replaceState({}, document.title, "/");
    }
  }, []);

  // ---------------------------------------------------------------
  // 1. ALL STATE VARIABLES (MUST BE AT THE TOP)
  // ---------------------------------------------------------------

  // --- Auth State ---
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- UI Theme ---
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  // --- Code & API Outputs ---
  const [code, setCode] = useState("// Paste your code here...");
  const [review, setReview] = useState("");
  const [fixedCode, setFixedCode] = useState("");
  const [complexityAnalysis, setComplexityAnalysis] = useState("");
  const [documentation, setDocumentation] = useState("");
  const [convertedCode, setConvertedCode] = useState("");

  // --- NEW: Compiler State (Moved safely inside the component) ---
  const [runOutput, setRunOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  // --- Language Selectors ---
  const [sourceLanguage, setSourceLanguage] = useState("JavaScript");
  const [targetLanguage, setTargetLanguage] = useState("Python");

  // --- UI Status ---
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeView, setActiveView] = useState("placeholder");
  const [copyButtonText, setCopyButtonText] = useState("Copy");

  // ---------------------------------------------------------------
  // 2. USE EFFECTS (LISTENERS)
  // ---------------------------------------------------------------

  // Check Login Status on Start
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Persist Theme Selection
  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // ---------------------------------------------------------------
  // 3. HELPER FUNCTIONS
  // ---------------------------------------------------------------

  const languages = [
    "JavaScript",
    "Python",
    "Java",
    "C++",
    "Go",
    "TypeScript",
    "Ruby",
    "PHP",
  ];
  
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const handleCopy = () => {
    const contentToCopy =
      activeView === "review"
        ? review
        : activeView === "fix"
          ? fixedCode
          : activeView === "complexity"
            ? complexityAnalysis
            : activeView === "document"
              ? documentation
              : convertedCode;

    if (contentToCopy) {
      navigator.clipboard.writeText(contentToCopy); 
      setCopyButtonText("Copied!");
      setTimeout(() => setCopyButtonText("Copy"), 2000);
    }
  };

  const loadHistoryItem = (item) => {
    setCode(item.code);
    setReview(item.review);
    setActiveView("review"); 
    setShowHistory(false);  
  };

  const handleApiRequest = async (endpoint, payload, viewName, successCallback) => {
    if (!code.trim()) {
      setError("Please enter some code to analyze.");
      setActiveView("error");
      return;
    }

    setIsLoading(true);
    setError("");
    setActiveView(viewName);

    try {
      const response = await axios.post(`https://ai-code-reviewer-2fw5.onrender.com/${endpoint}`, payload);
      successCallback(response.data);

      if (user && viewName === "review") {
        try {
          await addDoc(collection(db, "history"), {
            uid: user.uid,              
            code: code,                 
            review: response.data.review, 
            timestamp: new Date()       
          });
          console.log("✅ History saved successfully!");
        } catch (e) {
          console.error("❌ Error saving history:", e);
        }
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || `Failed to fetch ${viewName}.`;
      setError(errorMessage);
      setActiveView("error");
    } finally {
      setIsLoading(false);
    }
  };

  // --- NEW: Dedicated Compiler Execution Function ---
  const handleRunCode = async () => {
    if (!code.trim()) return;
    
    setIsRunning(true);
    setRunOutput("Compiling and running code... ⏳");

    try {
        const response = await axios.post('https://ai-code-reviewer-2fw5.onrender.com/run', { 
            code: code, 
            language: sourceLanguage 
        });

        const data = response.data;
        
        if (data.isError) {
            setRunOutput(`🔴 Error:\n${data.output}`);
        } else {
            setRunOutput(`🟢 Output:\n${data.output || "Code executed successfully with no output."}`);
        }
    } catch (err) {
        const errorMessage = err.response?.data?.error || err.message;
        setRunOutput(`🔴 Failed to connect to the server: ${errorMessage}`);
    } finally {
        setIsRunning(false);
    }
  };

  const renderRightPanelContent = () => {
    if (isLoading)
      return <div className="placeholder-content">Working on it...</div>;
    if (activeView === "error")
      return <div className="placeholder-content error-message">{error}</div>;

    if (
      activeView === "review" ||
      activeView === "complexity" ||
      activeView === "document"
    ) {
      const content =
        activeView === "review"
          ? review
          : activeView === "complexity"
            ? complexityAnalysis
            : documentation;
      if (content)
        return (
          <div className="review-output">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        );
    }

    if (activeView === "fix" && fixedCode) {
      return (
        <CodeEditor
          value={fixedCode}
          language={sourceLanguage.toLowerCase()}
          data-color-mode={theme}
          padding={15}
          readOnly
          style={{ flexGrow: 1, fontFamily: "monospace" }}
        />
      );
    }
    if (activeView === "convert" && convertedCode) {
      return (
        <CodeEditor
          value={convertedCode}
          language={targetLanguage.toLowerCase()}
          data-color-mode={theme}
          padding={15}
          readOnly
          style={{ flexGrow: 1, fontFamily: "monospace" }}
        />
      );
    }

    return (
      <div className="placeholder-content">
        <FaBolt />
        <p>Run an analysis to see the results here.</p>
      </div>
    );
  };

  const getPanelTitle = () => {
    switch (activeView) {
      case "review":
        return { icon: <FaBolt />, text: "Analysis Results" };
      case "fix":
        return { icon: <FaWrench />, text: "Corrected Code" };
      case "complexity":
        return { icon: <FaChartLine />, text: "Complexity Analysis" };
      case "document":
        return { icon: <FaFileAlt />, text: "Generated Documentation" };
      case "convert":
        return {
          icon: <FaSyncAlt />,
          text: `Converted Code (${targetLanguage})`,
        };
      default:
        return { icon: <FaBolt />, text: "Analysis Results" };
    }
  };
  
  const { icon, text } = getPanelTitle();

  // ---------------------------------------------------------------
  // 4. THE GATES (MUST BE AFTER HOOKS)
  // ---------------------------------------------------------------

  if (loading)
    return (
      <div style={{ color: "white", textAlign: "center", marginTop: "20%" }}>
        Loading...
      </div>
    );

  // ---------------------------------------------------------------
  // 5. THE MAIN APP UI
  // ---------------------------------------------------------------
  return (
    <div className={`App ${theme}`}>
      <header className="App-header">
        <h1 className="app-title">🤖 AI Code Reviewer</h1>

        <div className="header-right">
          {user && (
            <>
              <button
                className="nav-btn share-btn-gradient"
                onClick={() => setIsShareOpen(true)}
              >
                <FaShareAlt /> Share
              </button>
              <button onClick={() => setShowHistory(true)} className="nav-btn history-btn">
                <FaHistory /> History
              </button>
              <button onClick={logout} className="nav-btn logout-btn">
                <FaSignOutAlt /> Logout
              </button>
            </>
          )}

          <button onClick={toggleTheme} className="theme-btn" aria-label="Toggle Theme">
            {theme === "dark" ? <FaSun /> : <FaMoon />}
          </button>

          {user ? (
            <div className="profile-container">
              <img
                src={user.photoURL || "https://ui-avatars.com/api/?background=random"}
                alt="Profile"
                className="profile-pic"
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                title={user.displayName}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://ui-avatars.com/api/?name=" + user.email + "&background=random&color=fff";
                }}
              />

              {showProfileDropdown && (
                <ProfileDropdown
                  user={user}
                  onClose={() => setShowProfileDropdown(false)}
                  onLogout={logout}
                  onAddAccount={signInWithGoogle}
                  theme={theme}
                />
              )}
            </div>
          ) : (
            <button onClick={signInWithGoogle} className="login-btn">
              <FaGoogle /> Sign In
            </button>
          )}
        </div>
      </header>

      <main className="main-content">
        
        {/* 🛠️ FIX 1: Added overflowY: 'auto' so the entire left side can scroll! */}
        <div className="panel" style={{ overflowY: 'auto', paddingBottom: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <h2 className="panel-title" style={{ margin: '0' }}>
            <FaCode /> Code Input
          </h2>

          <div className="language-selectors">
            <div>
              <label htmlFor="source-lang">From</label>
              <select
                id="source-lang"
                value={sourceLanguage}
                onChange={(e) => setSourceLanguage(e.target.value)}
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="target-lang">To</label>
              <select
                id="target-lang"
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 🛠️ FIX 2: Added minHeight so the editor doesn't shrink to zero when the terminal appears */}
          <div
            className="code-editor-container"
            style={{
              minHeight: "350px", 
              width: "100%",
              borderRadius: "8px",
              overflow: "hidden",
              border: "1px solid var(--border-color)",
            }}
          >
            <Editor
              height="100%"
              width="100%"
              language={sourceLanguage.toLowerCase()}
              value={code}
              theme={theme === "dark" ? "vs-dark" : "light"}
              onChange={(value) => setCode(value || "")}
              options={{
                minimap: { enabled: false },
                fontSize: 15,
                automaticLayout: true,
                fontFamily: "'Fira Code', 'Courier New', monospace",
              }}
            />
          </div>

          {/* 🛠️ FIX 3: Added flexWrap so the buttons don't get squeezed */}
          <div className="button-group" style={{ flexWrap: 'wrap' }}>
            <button
              onClick={() =>
                handleApiRequest("review", { code }, "review", (data) =>
                  setReview(data.review),
                )
              }
              disabled={isLoading}
              className="analyze-button"
            >
              <FaBolt /> Review
            </button>
            <button
              onClick={() =>
                handleApiRequest("fix", { code }, "fix", (data) =>
                  setFixedCode(data.fixedCode),
                )
              }
              disabled={isLoading}
              className="analyze-button secondary-button"
            >
              <FaWrench /> Fix
            </button>
            <button
              onClick={() =>
                handleApiRequest("complexity", { code }, "complexity", (data) =>
                  setComplexityAnalysis(data.analysis),
                )
              }
              disabled={isLoading}
              className="analyze-button tertiary-button"
            >
              <FaChartLine /> Complexity
            </button>
            <button
              onClick={() =>
                handleApiRequest("document", { code }, "document", (data) =>
                  setDocumentation(data.documentation),
                )
              }
              disabled={isLoading}
              className="analyze-button quaternary-button"
            >
              <FaFileAlt /> Write Docs
            </button>
            <button
              onClick={() =>
                handleApiRequest(
                  "convert",
                  { code, sourceLanguage, targetLanguage },
                  "convert",
                  (data) => setConvertedCode(data.convertedCode),
                )
              }
              disabled={isLoading}
              className="analyze-button quinary-button"
            >
              <FaSyncAlt /> Convert
            </button>
            
            {/* --- NEW: RUN CODE BUTTON --- */}
            <button 
                className="analyze-button" 
                style={{ background: "linear-gradient(90deg, #11998e, #38ef7d)" }}
                onClick={handleRunCode} 
                disabled={isRunning || !code.trim()}
            >
                {isRunning ? "Running..." : "▶ Run Code"}
            </button>
          </div>

          {/* 🛠️ FIX 4: Bulletproof Terminal Box with internal scrolling */}
          {runOutput && (
            <div style={{ marginTop: '10px', borderLeft: '4px solid #38ef7d', padding: '15px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: 'var(--text-color)' }}>🖥️ Terminal Output</h3>
                <div style={{ 
                    maxHeight: '200px', 
                    overflowY: 'auto', 
                    background: '#0D0B1A', 
                    borderRadius: '5px' 
                }}>
                    <pre style={{ 
                        margin: 0, 
                        padding: '15px', 
                        color: '#E0E0E0',
                        whiteSpace: 'pre-wrap',
                        fontFamily: "'Fira Code', 'Courier New', monospace"
                    }}>
                        {runOutput}
                    </pre>
                </div>
            </div>
          )}

        </div>

        <div className="panel">
          <h2 className="panel-title">
            {icon} {text}
          </h2>
          {(review ||
            fixedCode ||
            complexityAnalysis ||
            documentation ||
            convertedCode) &&
            !isLoading && (
              <button onClick={handleCopy} className="copy-button">
                {copyButtonText}
              </button>
            )}
          <div className="right-panel-content">{renderRightPanelContent()}</div>
        </div>
      </main>

      <footer className="App-footer">
        <p>
          Developed by Rushikesh :{" "}
          <a
            href="https://www.linkedin.com/feed/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin /> Rushikesh Kale
          </a>{" "}
          <span className="footer-separator">|</span>{" "}
          <a
            href="https://github.com/Rishi1364"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub /> Rishi1364
          </a>
        </p>
      </footer>

      {showHistory && (
        <HistoryPanel
          user={user}
          onClose={() => setShowHistory(false)}
          onLoad={loadHistoryItem}
          theme={theme}
        />
      )}

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        code={code} 
      />

    </div>
  );
}

export default App;