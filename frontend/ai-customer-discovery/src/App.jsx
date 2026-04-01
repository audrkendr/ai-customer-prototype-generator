import { useState } from "react";

const ClipboardIcon = ({ copied }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="18" 
    height="18" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    {copied ? (
      <polyline points="20 6 9 17 4 12"></polyline>
    ) : (
      <>
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </>
    )}
  </svg>
);

function Accordion({ title, items, icon }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div style={{ 
      border: "1px solid #3d3131e9", 
      borderRadius: "8px", 
      marginBottom: "12px", 
      overflow: "hidden",
      backgroundColor: "#0d152cff"
    }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "100%",
          padding: "15px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#2e6caaff",
          fontFamily: "sans-serif",
          border: "none",
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: "16px",
          color: "#ecebebff"
        }}
      >
        <span>{icon} {title}</span>
        <span>{isOpen ? "▲" : "▼"}</span>
      </button>
      
      {isOpen && (
        <div style={{ padding: "15px 20px", borderTop: "1px solid #3d3131e9", color: "#ecebebff" }}>
          <ul style={{ margin: 0, paddingLeft: "20px", lineHeight: "1.6" }}>
            {items?.map((item, i) => (
              <li key={i} style={{ marginBottom: "8px" }}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function App() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  // --- NEW: Copy as String Logic ---
  const handleCopy = () => {
    if (!result) return;
    
    // Create a clean text representation
    const textResult = `
AI PROTOTYPE ANALYSIS
---------------------
SUMMARY:
${result.summary}

REQUIREMENTS:
${result.requirements.map(r => `- ${r}`).join('\n')}

FEATURES:
${result.features.map(f => `- ${f}`).join('\n')}

SUCCESS METRICS:
${result.success_metrics.map(m => `- ${m}`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(textResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerate = async () => {
    if (!input.trim()) {
      setError("Please enter a problem description.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });

      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Error connecting to backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "50px auto", fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <h1>AI Prototype Generator</h1>

      <textarea
        rows="6"
        style={{
          width: "100%",
          padding: "12px",
          fontSize: "14px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          boxSizing: "border-box"
        }}
        placeholder="Describe a customer problem..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
        <button
          onClick={handleGenerate}
          style={{
            padding: "10px 20px",
            fontSize: "14px",
            borderRadius: "6px",
            border: "none",
            backgroundColor: "#007bff",
            color: "white",
            cursor: "pointer",
          }}
        >
          {loading ? "Generating..." : "Generate Prototype"}
        </button>

        {result && (
          <button 
            onClick={handleCopy}
            style={{
              padding: "10px 20px",
              fontSize: "14px",
              borderRadius: "6px",
              border: "1px solid #007bff",
              backgroundColor: copied ? "#e7f3ff" : "transparent",
              color: "#007bff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "all 0.2s"
            }}
          >
            <ClipboardIcon copied={copied} />
            {copied ? "Copied to Clipboard!" : "Copy as Text"}
          </button>
        )}
      </div>

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

      {result && (
        <div style={{ marginTop: "30px" }}>
          <h2>Results</h2>
          <Accordion title="Problem Summary" items={[result.summary]} icon="🧠" />
          <Accordion title="Requirements" items={result.requirements} icon="📋" />
          <Accordion title="Proposed Features" items={result.features} icon="⚙️" />
          <Accordion title="Success Metrics (KPIs)" items={result.success_metrics} icon="📈" />
        </div>
      )}
    </div>
  );
}

export default App;