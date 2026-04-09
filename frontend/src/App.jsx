import { useState } from "react";
import axios from "axios";
import { QRCode } from "react-qr-code";
import * as QRCodeGenerator from "qrcode";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export default function App() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [qrImage, setQrImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);

  const handleShorten = async () => {
    if (!url || loading) return;
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/shorten`, {
        originalUrl: url,
      });
      const newShortUrl = res.data.shortUrl;
      setShortUrl(newShortUrl);
      setCopied(false);
      const qr = await QRCodeGenerator.toDataURL(newShortUrl);
      setQrImage(qr);
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleShorten();
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #080b14;
          --surface: rgba(255,255,255,0.04);
          --surface-hover: rgba(255,255,255,0.07);
          --border: rgba(255,255,255,0.08);
          --border-glow: rgba(99,179,255,0.35);
          --accent: #63b3ff;
          --accent2: #a78bfa;
          --accent-grad: linear-gradient(135deg, #63b3ff 0%, #a78bfa 100%);
          --success: #34d399;
          --text: #f0f4ff;
          --text-muted: rgba(240,244,255,0.45);
          --radius: 16px;
          --radius-sm: 10px;
        }

        body {
          background: var(--bg);
          color: var(--text);
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          overflow-x: hidden;
        }

        .page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px 16px 48px;
          position: relative;
        }

        /* Ambient background blobs */
        .blob {
          position: fixed;
          border-radius: 50%;
          filter: blur(120px);
          pointer-events: none;
          opacity: 0.18;
          z-index: 0;
        }
        .blob-1 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, #63b3ff, transparent);
          top: -150px; left: -150px;
        }
        .blob-2 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, #a78bfa, transparent);
          bottom: -100px; right: -100px;
        }

        .card {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 600px;
          background: rgba(255,255,255,0.035);
          border: 1px solid var(--border);
          border-radius: 24px;
          padding: 40px 36px;
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.04) inset,
            0 32px 64px rgba(0,0,0,0.5),
            0 0 80px rgba(99,179,255,0.04);
          animation: fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) both;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(99,179,255,0.1);
          border: 1px solid rgba(99,179,255,0.2);
          border-radius: 100px;
          padding: 4px 12px;
          font-size: 11px;
          font-family: 'Syne', sans-serif;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 18px;
        }
        .badge-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--accent);
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }

        h1 {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(28px, 5vw, 40px);
          letter-spacing: -0.03em;
          line-height: 1.1;
          margin-bottom: 8px;
          background: var(--accent-grad);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .subtitle {
          font-size: 14px;
          color: var(--text-muted);
          font-weight: 400;
          margin-bottom: 32px;
          letter-spacing: 0.01em;
        }

        .input-row {
          display: flex;
          gap: 10px;
          align-items: stretch;
        }

        .input-wrap {
          flex: 1;
          position: relative;
          border-radius: var(--radius-sm);
          transition: box-shadow 0.25s;
        }
        .input-wrap.focused {
          box-shadow: 0 0 0 2px rgba(99,179,255,0.3);
        }

        .url-input {
          width: 100%;
          height: 52px;
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          padding: 0 16px 0 42px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: var(--text);
          outline: none;
          transition: border-color 0.2s, background 0.2s;
        }
        .url-input::placeholder { color: var(--text-muted); }
        .url-input:focus {
          background: rgba(255,255,255,0.07);
          border-color: rgba(99,179,255,0.4);
        }

        .input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          display: flex;
          align-items: center;
          pointer-events: none;
        }

        .btn-shorten {
          height: 52px;
          padding: 0 24px;
          background: var(--accent-grad);
          border: none;
          border-radius: var(--radius-sm);
          font-family: 'Syne', sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: #fff;
          cursor: pointer;
          white-space: nowrap;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 20px rgba(99,179,255,0.25);
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .btn-shorten:hover:not(:disabled) {
          opacity: 0.9;
          transform: translateY(-1px);
          box-shadow: 0 8px 28px rgba(99,179,255,0.35);
        }
        .btn-shorten:active:not(:disabled) { transform: translateY(0); }
        .btn-shorten:disabled { opacity: 0.5; cursor: not-allowed; }

        /* Spinner */
        .spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Result section */
        .result {
          margin-top: 28px;
          animation: fadeUp 0.45s cubic-bezier(0.22,1,0.36,1) both;
        }

        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
          color: var(--text-muted);
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          font-family: 'Syne', sans-serif;
        }
        .divider::before, .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--border);
        }

        .result-box {
          background: rgba(99,179,255,0.05);
          border: 1px solid rgba(99,179,255,0.15);
          border-radius: var(--radius-sm);
          padding: 14px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }

        .short-url-link {
          color: var(--accent);
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 500;
          text-decoration: none;
          word-break: break-all;
          letter-spacing: 0.01em;
          transition: opacity 0.2s;
        }
        .short-url-link:hover { opacity: 0.75; text-decoration: underline; }

        .btn-copy {
          flex-shrink: 0;
          height: 36px;
          padding: 0 16px;
          border-radius: 8px;
          border: 1px solid;
          font-family: 'Syne', sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s;
        }
        .btn-copy.idle {
          background: transparent;
          border-color: rgba(99,179,255,0.3);
          color: var(--accent);
        }
        .btn-copy.idle:hover {
          background: rgba(99,179,255,0.1);
          border-color: var(--accent);
        }
        .btn-copy.success {
          background: rgba(52,211,153,0.12);
          border-color: rgba(52,211,153,0.4);
          color: var(--success);
        }

        /* QR section */
        .qr-section {
          margin-top: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .qr-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          width: 100%;
        }

        .qr-label {
          font-family: 'Syne', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--text-muted);
        }

        .qr-wrapper {
          background: #fff;
          border-radius: 12px;
          padding: 12px;
          line-height: 0;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
        }

        .btn-download {
          width: 100%;
          height: 46px;
          background: transparent;
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          font-family: 'Syne', sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-muted);
          cursor: pointer;
          text-decoration: none;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s;
        }
        .btn-download:hover {
          border-color: rgba(167,139,250,0.4);
          color: var(--accent2);
          background: rgba(167,139,250,0.06);
        }

        /* Mobile */
        @media (max-width: 480px) {
          .card { padding: 28px 20px; }
          .input-row { flex-direction: column; }
          .btn-shorten { height: 48px; justify-content: center; }
          .url-input { height: 48px; }
        }
      `}</style>

      <div className="page">
        <div className="blob blob-1" />
        <div className="blob blob-2" />

        <div className="card">
          {/* Header */}
          <div className="badge">
            <span className="badge-dot" />
            Link Shortener
          </div>
          <h1>Shorten. Share.<br />Track.</h1>
          <p className="subtitle">Paste any long URL and get a clean, shareable link instantly.</p>

          {/* Input */}
          <div className="input-row">
            <div className={`input-wrap ${focused ? "focused" : ""}`}>
              <span className="input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
                  <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
                </svg>
              </span>
              <input
                className="url-input"
                type="text"
                placeholder="https://your-very-long-url.com/goes/here"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <button className="btn-shorten" onClick={handleShorten} disabled={loading}>
              {loading ? <span className="spinner" /> : (
                <>
                  Shorten
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </>
              )}
            </button>
          </div>

          {/* Result */}
          {shortUrl && (
            <div className="result">
              <div className="divider">Your link</div>

              <div className="result-box">
                <a className="short-url-link" href={shortUrl} target="_blank" rel="noreferrer">
                  {shortUrl}
                </a>
                <button
                  className={`btn-copy ${copied ? "success" : "idle"}`}
                  onClick={handleCopy}
                >
                  {copied ? (
                    <>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      Copied
                    </>
                  ) : (
                    <>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                      </svg>
                      Copy
                    </>
                  )}
                </button>
              </div>

              {/* QR Code */}
              <div className="qr-section">
                <div className="qr-card">
                  <span className="qr-label">QR Code</span>
                  <div className="qr-wrapper">
                    <QRCode value={shortUrl} size={160} />
                  </div>
                  {qrImage && (
                    <a className="btn-download" download="qr-code.png" href={qrImage}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                      Download QR Code
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}