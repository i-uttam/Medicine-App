import React from 'react';

export function Splash() {
  return (
    <div style={{
      width: 390, height: 844, overflow: 'hidden', position: 'relative',
      fontFamily: "'Poppins', sans-serif",
      background: 'linear-gradient(160deg, #064e2e 0%, #0a7a45 35%, #0F9D58 65%, #34A853 100%)',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@400;500;600;700;800&display=swap');

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes spin-rev {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 40px 10px rgba(255,255,255,0.18), 0 0 80px 20px rgba(52,168,83,0.25); }
          50%       { box-shadow: 0 0 60px 20px rgba(255,255,255,0.28), 0 0 120px 40px rgba(52,168,83,0.35); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        @keyframes dot-bounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40%            { transform: scale(1);   opacity: 1; }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .spin-slow  { animation: spin-slow 12s linear infinite; }
        .spin-rev   { animation: spin-rev 8s linear infinite; }
        .pulse-glow { animation: pulse-glow 2.5s ease-in-out infinite; }
        .float      { animation: float 3.5s ease-in-out infinite; }
        .fade-up-1  { animation: fade-up 0.7s ease-out 0.2s both; }
        .fade-up-2  { animation: fade-up 0.7s ease-out 0.45s both; }
        .fade-up-3  { animation: fade-up 0.7s ease-out 0.65s both; }
        .fade-up-4  { animation: fade-up 0.7s ease-out 0.85s both; }
        .dot1 { animation: dot-bounce 1.4s ease-in-out 0s infinite; }
        .dot2 { animation: dot-bounce 1.4s ease-in-out 0.2s infinite; }
        .dot3 { animation: dot-bounce 1.4s ease-in-out 0.4s infinite; }
      `}</style>

      {/* ── Background orbs ── */}
      <div style={{
        position: 'absolute', top: -100, right: -100,
        width: 340, height: 340, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.10) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: -80, left: -80,
        width: 280, height: 280, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* ── Decorative floating pills (background layer) ── */}
      {[
        { top: 72,  left: 22,  w: 14, h: 36, rot: -20, op: 0.18 },
        { top: 120, right: 28, w: 10, h: 26, rot: 35,  op: 0.14 },
        { top: 200, left: 44, w: 12, h: 30, rot: 55,   op: 0.12 },
        { bottom: 260, right: 30, w: 14, h: 36, rot: -40, op: 0.16 },
        { bottom: 180, left: 18, w: 10, h: 24, rot: 20,  op: 0.12 },
        { top: 340, right: 14, w: 8,  h: 20, rot: -10,  op: 0.10 },
      ].map((p, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: p.top, bottom: p.bottom, left: p.left, right: p.right,
          width: p.w, height: p.h,
          borderRadius: 999,
          border: `2px solid rgba(255,255,255,${p.op * 2})`,
          background: `rgba(255,255,255,${p.op})`,
          transform: `rotate(${p.rot}deg)`,
        }} />
      ))}

      {/* ── Dot grid texture ── */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.07 }}>
        <defs>
          <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill="white" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>

      {/* ── Top strip: trust badges ── */}
      <div style={{
        position: 'absolute', top: 52, left: 0, right: 0,
        display: 'flex', justifyContent: 'center', gap: 12,
      }}>
        {['ISO Certified', 'CDSCO Licensed', 'GST Compliant'].map(t => (
          <div key={t} style={{
            background: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.25)',
            borderRadius: 20,
            padding: '3px 10px',
            fontSize: 9,
            fontWeight: 600,
            color: 'rgba(255,255,255,0.9)',
            letterSpacing: '0.04em',
            backdropFilter: 'blur(8px)',
          }}>{t}</div>
        ))}
      </div>

      {/* ── Centre logo zone ── */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>

        {/* Spinning rings + logo */}
        <div className="float fade-up-1" style={{ position: 'relative', width: 160, height: 160, marginBottom: 36 }}>

          {/* Outer dashed ring */}
          <div className="spin-slow" style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            border: '1.5px dashed rgba(255,255,255,0.25)',
          }} />

          {/* Middle dotted ring */}
          <div className="spin-rev" style={{
            position: 'absolute', inset: 14, borderRadius: '50%',
            border: '1.5px dotted rgba(255,255,255,0.35)',
          }} />

          {/* Glow ring */}
          <div style={{
            position: 'absolute', inset: 26, borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.3)',
          }} />

          {/* Logo circle */}
          <div className="pulse-glow" style={{
            position: 'absolute', inset: 34,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.95)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column',
          }}>
            {/* Custom cross icon */}
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
              {/* Plus cross */}
              <rect x="18" y="6" width="8" height="32" rx="4" fill="#0F9D58" />
              <rect x="6" y="18" width="32" height="8" rx="4" fill="#0F9D58" />
              {/* Dot accent */}
              <circle cx="22" cy="22" r="4" fill="white" />
              <circle cx="22" cy="22" r="2" fill="#34A853" />
            </svg>
          </div>

          {/* Orbiting pill dot */}
          <div style={{
            position: 'absolute', top: 8, left: '50%',
            transform: 'translateX(-50%)',
            width: 10, height: 10, borderRadius: '50%',
            background: 'rgba(255,255,255,0.7)',
          }} />
          <div style={{
            position: 'absolute', bottom: 8, left: '50%',
            transform: 'translateX(-50%)',
            width: 7, height: 7, borderRadius: '50%',
            background: 'rgba(255,255,255,0.5)',
          }} />
        </div>

        {/* App name */}
        <div className="fade-up-2" style={{ textAlign: 'center', marginBottom: 10 }}>
          <div style={{
            fontSize: 32, fontWeight: 800, color: '#fff',
            letterSpacing: '-0.5px', lineHeight: 1.1,
            textShadow: '0 2px 20px rgba(0,0,0,0.2)',
          }}>
            Medi<span style={{ color: 'rgba(255,255,255,0.75)' }}>Wholesale</span>
          </div>
        </div>

        {/* Tagline */}
        <div className="fade-up-3" style={{
          fontSize: 13, fontWeight: 500,
          color: 'rgba(255,255,255,0.82)',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          marginBottom: 32,
        }}>
          Your Trusted Wholesale Pharmacy
        </div>

        {/* Feature pills row */}
        <div className="fade-up-4" style={{ display: 'flex', gap: 8, marginBottom: 48 }}>
          {[
            { emoji: '💊', label: 'Medicines' },
            { emoji: '🏥', label: 'B2B Platform' },
            { emoji: '📦', label: 'Bulk Orders' },
          ].map(({ label }) => (
            <div key={label} style={{
              background: 'rgba(255,255,255,0.14)',
              border: '1px solid rgba(255,255,255,0.28)',
              borderRadius: 20,
              padding: '5px 13px',
              fontSize: 11,
              fontWeight: 600,
              color: '#fff',
              backdropFilter: 'blur(10px)',
            }}>{label}</div>
          ))}
        </div>
      </div>

      {/* ── Bottom section ── */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '32px 32px 48px',
        background: 'linear-gradient(to top, rgba(6,30,18,0.55) 0%, transparent 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18,
      }}>
        {/* Loading bar */}
        <div style={{ width: '100%', height: 3, background: 'rgba(255,255,255,0.15)', borderRadius: 99, overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: '65%', borderRadius: 99,
            background: 'linear-gradient(90deg, rgba(255,255,255,0.3), rgba(255,255,255,0.9), rgba(255,255,255,0.3))',
            backgroundSize: '800px 100%',
            animation: 'shimmer 1.6s infinite linear',
          }} />
        </div>

        {/* Dot loader */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {['dot1','dot2','dot3'].map(cls => (
            <div key={cls} className={cls} style={{
              width: 8, height: 8, borderRadius: '50%',
              background: 'rgba(255,255,255,0.85)',
            }} />
          ))}
        </div>

        {/* Version */}
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em' }}>
          v2.4.1 · Powered by MediWholesale™
        </div>
      </div>
    </div>
  );
}
