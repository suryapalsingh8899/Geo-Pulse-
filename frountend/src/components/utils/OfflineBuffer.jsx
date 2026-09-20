import React, { useState, useEffect } from "react";

const OfflineBuffer = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [dots, setDots] = useState(0);
  const [isDark, setIsDark] = useState(() => !document.body.classList.contains("light-mode"));

  // Track online/offline
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Track light/dark mode changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(!document.body.classList.contains("light-mode"));
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  // Animate "Reconnecting..." ellipsis
  useEffect(() => {
    if (!isOnline) {
      const id = setInterval(() => setDots((d) => (d + 1) % 4), 600);
      return () => clearInterval(id);
    }
  }, [isOnline]);

  if (isOnline) return null;

  const reconnectText = "Reconnecting" + ".".repeat(dots);

  // ── Theme-specific values ────────────────────────────────────────────────
  const theme = isDark ? darkTheme : lightTheme;

  return (
    <div style={{ ...styles.wrapper, background: theme.bg }} >
      <style>{css}</style>

      {/* Background layer: stars (dark) or clouds/sky shimmer (light) */}
      <div style={styles.bgLayer} aria-hidden="true">
        {isDark
          ? stars.map((s, i) => <div key={i} className="ob-star" style={s} />)
          : clouds.map((c, i) => <div key={i} className="ob-cloud" style={c} />)
        }
      </div>

      {/* Globe + Orbital system */}
      <div style={styles.globeWrap} aria-hidden="true">

        {/* Signal rings — colour-themed */}
        <div className="ob-ring" style={{ border: `2px solid ${theme.ring1}`, animationDelay: "0s" }} />
        <div className="ob-ring" style={{ border: `1.5px solid ${theme.ring2}`, animationDelay: "0.87s" }} />
        <div className="ob-ring" style={{ border: `1px solid ${theme.ring3}`, animationDelay: "1.74s" }} />

        {/* Atmosphere glow — themed */}
        <div className="ob-atmosphere" style={{ background: theme.atmosphere }} />

        {/* Earth globe */}
        <div style={{ ...styles.earthClip, boxShadow: theme.earthShadow }}>
          <svg
            className="ob-earth-spin"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: "100%", height: "100%", display: "block" }}
          >
            <defs>
              {/* Ocean gradient */}
              {isDark ? (
                <radialGradient id="ob-ocean" cx="35%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#1a4a6e" />
                  <stop offset="100%" stopColor="#061629" />
                </radialGradient>
              ) : (
                <radialGradient id="ob-ocean" cx="30%" cy="25%" r="75%">
                  <stop offset="0%" stopColor="#60c8ff" />
                  <stop offset="40%" stopColor="#2a9dd8" />
                  <stop offset="100%" stopColor="#0d6fa8" />
                </radialGradient>
              )}

              {/* Specular / sun glint */}
              <radialGradient id="ob-specular" cx="32%" cy="28%" r="50%">
                <stop offset="0%" stopColor={isDark ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.65)"} />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </radialGradient>

              {/* Light mode: cloud layer */}
              {!isDark && (
                <radialGradient id="ob-cloud-fill" cx="50%" cy="50%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0.4)" />
                </radialGradient>
              )}

              {/* Light mode: sunlit land highlight */}
              {!isDark && (
                <linearGradient id="ob-land-hi" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255,230,140,0.25)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                </linearGradient>
              )}
            </defs>

            {/* Ocean base */}
            <circle cx="100" cy="100" r="100" fill="url(#ob-ocean)" />

            {/* ── Continents ── */}
            {/* South America */}
            <path
              d="M 30 55 C 35 42 50 38 58 50 C 65 62 62 78 52 90 C 44 100 38 112 35 126 C 32 140 35 154 42 162 C 48 170 44 178 35 180 C 24 182 18 170 22 155 C 26 140 20 126 23 112 C 26 98 22 82 24 68 Z"
              fill={isDark ? "#276749" : "#3ab06a"}
            />
            <path d="M 36 53 C 42 40 55 38 60 50 C 64 60 58 74 50 82"
              fill={isDark ? "#22543d" : "#2d9658"} />

            {/* North America */}
            <path
              d="M 28 18 C 38 10 55 12 62 24 C 68 36 64 52 55 58 C 47 63 38 58 33 50 C 28 42 30 30 28 18 Z"
              fill={isDark ? "#2f855a" : "#48bb78"}
            />

            {/* Europe */}
            <path
              d="M 95 22 C 108 18 122 24 125 36 C 128 48 118 56 110 58 C 103 60 98 66 100 76 C 102 86 112 92 110 104 C 108 120 98 136 94 152 C 90 164 84 170 78 164 C 72 156 74 142 80 132 C 87 120 85 106 83 94 C 80 80 77 68 82 55 C 86 44 90 26 95 22 Z"
              fill={isDark ? "#2f855a" : "#48bb78"}
            />

            {/* Africa */}
            <path
              d="M 100 80 C 112 76 128 82 132 96 C 136 110 128 128 120 140 C 112 152 108 164 104 175 C 100 184 92 186 86 178 C 80 168 84 152 90 140 C 96 128 94 114 92 100 C 90 88 96 82 100 80 Z"
              fill={isDark ? "#276749" : "#3ab06a"}
            />

            {/* Sahara/desert tones in light mode */}
            {!isDark && (
              <path
                d="M 100 82 C 110 80 122 84 126 94 C 118 91 108 92 102 96 C 96 90 97 84 100 82 Z"
                fill="#f6ad55"
                opacity="0.6"
              />
            )}

            {/* Asia */}
            <path
              d="M 128 18 C 145 14 170 20 180 34 C 192 48 192 66 182 80 C 170 96 152 102 138 110 C 125 118 118 130 114 144 C 110 155 104 162 100 154 C 96 145 100 130 108 118 C 116 106 125 94 128 80 C 130 64 126 48 128 34 Z"
              fill={isDark ? "#276749" : "#48bb78"}
            />
            <path d="M 158 16 C 174 13 188 22 194 36 C 198 50 190 64 180 72"
              fill={isDark ? "#22543d" : "#2d9658"} />

            {/* Australia */}
            <path
              d="M 155 145 C 163 140 177 144 182 155 C 187 168 182 180 172 183 C 162 186 152 177 150 166 C 147 155 148 148 155 145 Z"
              fill={isDark ? "#2f855a" : "#e8a04a"}
            />

            {/* Ice cap */}
            <ellipse cx="100" cy="6" rx="52" ry="14"
              fill={isDark ? "rgba(218,238,255,0.45)" : "rgba(240,248,255,0.9)"} />
            {/* South ice */}
            <ellipse cx="100" cy="196" rx="38" ry="10"
              fill={isDark ? "rgba(218,238,255,0.3)" : "rgba(240,248,255,0.8)"} />

            {/* Ocean shimmer lines */}
            <path d="M 8 80 Q 40 74 72 82 Q 104 89 138 80 Q 164 72 195 78"
              stroke={isDark ? "rgba(56,189,248,0.12)" : "rgba(255,255,255,0.35)"}
              strokeWidth="1.5" fill="none" />
            <path d="M 4 118 Q 48 110 94 118 Q 140 126 192 114"
              stroke={isDark ? "rgba(56,189,248,0.08)" : "rgba(255,255,255,0.25)"}
              strokeWidth="1" fill="none" />
            <path d="M 10 152 Q 58 145 102 152 Q 148 160 192 148"
              stroke={isDark ? "rgba(56,189,248,0.06)" : "rgba(255,255,255,0.18)"}
              strokeWidth="1" fill="none" />

            {/* Light mode: cloud wisps over the ocean */}
            {!isDark && (
              <>
                <path d="M 15 65 Q 30 60 45 66 Q 35 70 15 68 Z"
                  fill="rgba(255,255,255,0.7)" />
                <path d="M 160 50 Q 178 45 192 52 Q 180 58 160 55 Z"
                  fill="rgba(255,255,255,0.6)" />
                <path d="M 60 130 Q 75 125 90 131 Q 78 137 60 134 Z"
                  fill="rgba(255,255,255,0.55)" />
                <path d="M 130 160 Q 148 155 165 162 Q 150 168 130 164 Z"
                  fill="rgba(255,255,255,0.5)" />
                <ellipse cx="40" cy="108" rx="14" ry="5" fill="rgba(255,255,255,0.5)" />
                <ellipse cx="168" cy="98" rx="12" ry="4" fill="rgba(255,255,255,0.45)" />
              </>
            )}

            {/* Land sunny highlight (light mode only) */}
            {!isDark && (
              <circle cx="100" cy="100" r="100" fill="url(#ob-land-hi)" />
            )}

            {/* Specular sun glint */}
            <ellipse cx={isDark ? 65 : 60} cy={isDark ? 55 : 50}
              rx={isDark ? 32 : 38} ry={isDark ? 22 : 28}
              fill="url(#ob-specular)" />
          </svg>
        </div>

        {/* Orbital path rings */}
        <div className="ob-orbit ob-orbit-1" style={{ borderColor: theme.orbitColor1 }} />
        <div className="ob-orbit ob-orbit-2" style={{ borderColor: theme.orbitColor2 }} />

        {/* Satellites */}
        <div className="ob-satellite ob-sat-1">🛰️</div>
        <div className="ob-satellite ob-sat-2">🛰️</div>
        <div className="ob-satellite ob-sat-3">🛰️</div>
      </div>

      {/* Info card */}
      <div style={{ ...styles.card, ...theme.card }}>
        {/* WiFi-off icon + title */}
        <div style={styles.titleRow}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
            stroke="#ef4444" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="1" y1="1" x2="23" y2="23" />
            <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
            <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
            <path d="M10.71 5.05A16 16 0 0 1 22.56 9" />
            <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
            <circle cx="12" cy="20" r="1.5" fill="#ef4444" stroke="none" />
          </svg>
          <h2 style={{ ...styles.title, background: theme.titleGrad,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            No Connection
          </h2>
        </div>

        <p style={{ ...styles.subtitle, color: theme.subtitleColor }}>
          Geo Pulse needs the internet to stream<br />live map data, reports &amp; events near you.
        </p>

        <div style={{ ...styles.reconnect, color: theme.accentColor }} aria-live="polite">
          {reconnectText}
        </div>

        <div style={styles.dotsRow} aria-hidden="true">
          <div className="ob-dot" style={{ background: theme.accentColor, animationDelay: "-0.32s" }} />
          <div className="ob-dot" style={{ background: theme.accentColor, animationDelay: "-0.16s" }} />
          <div className="ob-dot" style={{ background: theme.accentColor, animationDelay: "0s" }} />
        </div>

        <p style={{ ...styles.tip, color: theme.tipColor, borderTopColor: theme.tipBorder }}>
          📡 Check your WiFi or mobile data — the app will resume automatically.
        </p>
      </div>
    </div>
  );
};

/* ─── Theme tokens ──────────────────────────────────────────────────────── */
const darkTheme = {
  bg: "radial-gradient(ellipse at 50% 38%, #0d2040 0%, #050b1a 100%)",
  ring1: "rgba(56,189,248,0.55)",
  ring2: "rgba(129,140,248,0.4)",
  ring3: "rgba(56,189,248,0.3)",
  atmosphere: "radial-gradient(circle, transparent 48%, rgba(56,189,248,0.28) 72%, rgba(56,189,248,0.05) 100%)",
  earthShadow: "0 0 50px rgba(56,189,248,0.45), 0 0 100px rgba(56,189,248,0.12), inset 0 0 30px rgba(0,0,0,0.6)",
  orbitColor1: "rgba(56,189,248,0.18)",
  orbitColor2: "rgba(129,140,248,0.13)",
  titleGrad: "linear-gradient(135deg, #f1f5f9, #94a3b8)",
  subtitleColor: "#64748b",
  accentColor: "#38bdf8",
  tipColor: "#334155",
  tipBorder: "rgba(255,255,255,0.06)",
  card: {},
};

const lightTheme = {
  // Sky-blue daytime gradient — like looking down from orbit
  bg: "radial-gradient(ellipse at 50% 20%, #b8e4ff 0%, #6bc5f5 30%, #2a93d5 70%, #0e5fa3 100%)",
  ring1: "rgba(255,255,255,0.7)",
  ring2: "rgba(100,200,255,0.5)",
  ring3: "rgba(255,255,255,0.35)",
  // Warm golden atmosphere around the sunlit globe
  atmosphere: "radial-gradient(circle, transparent 48%, rgba(255,230,100,0.35) 68%, rgba(255,140,50,0.12) 82%, transparent 100%)",
  // Vivid sunlit glow
  earthShadow: [
    "0 0 0 3px rgba(255,255,255,0.5)",
    "0 0 40px rgba(255,220,80,0.55)",
    "0 0 80px rgba(255,180,40,0.2)",
    "0 8px 40px rgba(0,80,160,0.3)",
    "inset 0 0 20px rgba(0,0,0,0.08)",
  ].join(", "),
  orbitColor1: "rgba(255,255,255,0.35)",
  orbitColor2: "rgba(255,255,255,0.2)",
  titleGrad: "linear-gradient(135deg, #0f172a, #1e40af)",
  subtitleColor: "#1e3a5f",
  accentColor: "#0369a1",
  tipColor: "#1e40af",
  tipBorder: "rgba(0,0,0,0.08)",
  card: {},
};

/* ─── Static styles ─────────────────────────────────────────────────────── */
const styles = {
  wrapper: {
    position: "fixed", inset: 0, zIndex: 99999,
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    fontFamily: "'Outfit', sans-serif",
    animation: "ob-fadeIn 0.5s ease-out",
  },
  bgLayer: { position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" },
  globeWrap: {
    position: "relative", width: "200px", height: "200px",
    display: "flex", alignItems: "center", justifyContent: "center",
    marginBottom: "2.5rem",
  },
  earthClip: {
    width: "155px", height: "155px",
    borderRadius: "50%", overflow: "hidden",
    position: "relative", zIndex: 2,
  },
  card: {
    textAlign: "center", maxWidth: "340px", padding: "0 1.5rem",
    animation: "ob-slideUp 0.5s 0.1s ease-out both",
  },
  titleRow: { display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "0.6rem" },
  title: { margin: 0, fontSize: "1.7rem", fontWeight: 800 },
  subtitle: { fontSize: "0.93rem", lineHeight: 1.65, marginBottom: "1.5rem" },
  reconnect: { fontSize: "0.88rem", fontWeight: 600, letterSpacing: "0.04em", minHeight: "1.4em", marginBottom: "1.1rem" },
  dotsRow: { display: "flex", gap: "8px", justifyContent: "center", marginBottom: "1.75rem" },
  tip: { fontSize: "0.78rem", lineHeight: 1.55, borderTop: "1px solid", paddingTop: "1rem" },
};

/* ─── Pre-generated stars (dark mode) ──────────────────────────────────── */
const stars = Array.from({ length: 70 }, (_, i) => ({
  position: "absolute",
  borderRadius: "50%",
  background: "#ffffff",
  width: `${(((i * 13 + 7) % 3) + 1)}px`,
  height: `${(((i * 13 + 7) % 3) + 1)}px`,
  top: `${((i * 137.5) % 100).toFixed(2)}%`,
  left: `${((i * 97.3 + 11) % 100).toFixed(2)}%`,
  opacity: `${(0.2 + ((i * 41) % 60) / 100).toFixed(2)}`,
  animationName: "ob-twinkle",
  animationDuration: `${(2 + (i % 4))}s`,
  animationDelay: `${((i * 0.37) % 4).toFixed(1)}s`,
  animationTimingFunction: "ease-in-out",
  animationIterationCount: "infinite",
}));

/* ─── Pre-generated drifting clouds (light mode background) ─────────────  */
const clouds = Array.from({ length: 12 }, (_, i) => ({
  position: "absolute",
  borderRadius: "50%",
  background: "rgba(255,255,255,0.45)",
  filter: "blur(18px)",
  width: `${80 + ((i * 47) % 120)}px`,
  height: `${30 + ((i * 31) % 50)}px`,
  top: `${((i * 83.7) % 90).toFixed(1)}%`,
  left: `${((i * 61.3 + 5) % 100).toFixed(1)}%`,
  animationName: "ob-cloudDrift",
  animationDuration: `${12 + (i % 8)}s`,
  animationDelay: `${((i * 1.3) % 6).toFixed(1)}s`,
  animationTimingFunction: "ease-in-out",
  animationIterationCount: "infinite",
  animationDirection: i % 2 === 0 ? "alternate" : "alternate-reverse",
}));

/* ─── CSS keyframes ─────────────────────────────────────────────────────── */
const css = `
  @keyframes ob-fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes ob-slideUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes ob-twinkle {
    0%, 100% { transform: scale(1);   opacity: inherit; }
    50%       { transform: scale(0.5); opacity: 0.1; }
  }
  @keyframes ob-cloudDrift {
    from { transform: translateX(-15px) translateY(-6px); }
    to   { transform: translateX(15px)  translateY(6px); }
  }

  /* Earth spin */
  @keyframes ob-earthSpin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  .ob-earth-spin {
    animation: ob-earthSpin 22s linear infinite;
    transform-origin: center;
  }

  /* Atmosphere ring */
  .ob-atmosphere {
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 178px; height: 178px; border-radius: 50%;
    animation: ob-atmoPulse 3.5s ease-in-out infinite;
    pointer-events: none; z-index: 3;
  }
  @keyframes ob-atmoPulse {
    0%, 100% { opacity: 0.8; transform: translate(-50%, -50%) scale(1); }
    50%       { opacity: 1;   transform: translate(-50%, -50%) scale(1.06); }
  }

  /* Signal rings */
  .ob-ring {
    position: absolute; top: 50%; left: 50%;
    width: 200px; height: 200px; border-radius: 50%;
    margin: -100px 0 0 -100px;
    pointer-events: none;
    animation: ob-ringPulse 2.6s ease-out infinite;
  }
  @keyframes ob-ringPulse {
    0%   { transform: scale(0.85); opacity: 0.8; }
    100% { transform: scale(2.0);  opacity: 0; }
  }

  /* Orbit paths */
  .ob-orbit {
    position: absolute; top: 50%; left: 50%;
    border-radius: 50%; pointer-events: none;
    border-style: dashed;
  }
  .ob-orbit-1 {
    width: 200px; height: 130px;
    transform: translate(-50%, -50%) rotateX(65deg);
    border-width: 1px;
  }
  .ob-orbit-2 {
    width: 230px; height: 148px;
    transform: translate(-50%, -50%) rotateX(65deg) rotate(55deg);
    border-width: 1px;
  }

  /* Satellites */
  .ob-satellite {
    position: absolute; top: 50%; left: 50%;
    transform-origin: 0 0;
    font-size: 15px; line-height: 1;
    pointer-events: none;
  }
  .ob-sat-1 { animation: ob-sat1 7s linear infinite; }
  .ob-sat-2 { font-size: 12px; opacity: 0.85; animation: ob-sat2 11s linear infinite; }
  .ob-sat-3 { font-size: 10px; opacity: 0.65; animation: ob-sat3 15s linear infinite; }

  @keyframes ob-sat1 {
    from { transform: translate(-50%,-50%) rotate(0deg)   translateX(100px) rotate(0deg); }
    to   { transform: translate(-50%,-50%) rotate(360deg) translateX(100px) rotate(-360deg); }
  }
  @keyframes ob-sat2 {
    from { transform: translate(-50%,-50%) rotate(120deg)  translateX(115px) rotate(-120deg); }
    to   { transform: translate(-50%,-50%) rotate(480deg)  translateX(115px) rotate(-480deg); }
  }
  @keyframes ob-sat3 {
    from { transform: translate(-50%,-50%) rotate(240deg)  translateX(128px) rotate(-240deg); }
    to   { transform: translate(-50%,-50%) rotate(600deg)  translateX(128px) rotate(-600deg); }
  }

  /* Loading dots */
  .ob-dot {
    width: 8px; height: 8px; border-radius: 50%;
    animation: ob-dotBounce 1.4s ease-in-out infinite both;
  }
  @keyframes ob-dotBounce {
    0%, 80%, 100% { transform: scale(0.35); opacity: 0.3; }
    40%           { transform: scale(1);    opacity: 1; }
  }

  /* Star twinkling */
  .ob-star {
    position: absolute;
    border-radius: 50%;
  }

  /* Cloud drift */
  .ob-cloud {
    position: absolute;
  }
`;

export default OfflineBuffer;
