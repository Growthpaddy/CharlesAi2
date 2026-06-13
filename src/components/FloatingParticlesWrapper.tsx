import React from "react";

export default function FloatingParticlesWrapper() {
  return (
    <div id="neural-drifting-backdrop" className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      
      {/* 1. Subtle, clean technical blueprint grid layer */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{
          backgroundImage: `radial-gradient(#0056D2 1px, transparent 1px), linear-gradient(to right, rgba(0,86,210,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,86,210,0.05) 1px, transparent 1px)`,
          backgroundSize: "24px 24px, 120px 120px, 120px 120px",
          backgroundPosition: "center center"
        }}
      />

      {/* 2. Slow drifting animated SVG Blobs of Soft Accent Color */}
      <div className="absolute top-[5%] left-[10%] w-[500px] h-[500px] bg-gradient-to-tr from-[#0056D2]/4 to-transparent rounded-full filter blur-[120px] animate-pulse pointer-events-none" style={{ animationDuration: '12s' }} />
      <div className="absolute top-[40%] right-[5%] w-[450px] h-[450px] bg-gradient-to-br from-amber-500/2 to-transparent rounded-full filter blur-[100px] animate-pulse pointer-events-none" style={{ animationDuration: '18s' }} />
      <div className="absolute bottom-[20%] left-[8%] w-[600px] h-[600px] bg-gradient-to-tr from-[#5d67f5]/3 to-transparent rounded-full filter blur-[140px] animate-pulse pointer-events-none" style={{ animationDuration: '15s' }} />

      {/* 3. Drift Nodes & Drifting SVG Lines (Mock Neural Mesh Connections) */}
      <svg className="absolute inset-0 w-full h-full opacity-60" xmlns="http://www.w3.org/2000/svg">
        
        {/* Connection Group 1 */}
        <g className="animate-pulse" style={{ animationDuration: "8s" }}>
          <line x1="12%" y1="15%" x2="18%" y2="22%" stroke="rgba(0,86,210,0.08)" strokeWidth="1.5" strokeDasharray="4 4" />
          <line x1="18%" y1="22%" x2="25%" y2="18%" stroke="rgba(0,86,210,0.08)" strokeWidth="1.5" />
          <circle cx="12%" cy="15%" r="3" fill="rgba(0,86,210,0.25)" />
          <circle cx="18%" cy="22%" r="4" fill="rgba(0,86,210,0.35)" />
          <circle cx="25%" cy="18%" r="3" fill="rgba(0,86,210,0.25)" />
        </g>

        {/* Connection Group 2 */}
        <g className="animate-pulse" style={{ animationDuration: "11s", animationDelay: "2s" }}>
          <line x1="85%" y1="35%" x2="92%" y2="42%" stroke="rgba(245,158,11,0.06)" strokeWidth="1.5" />
          <line x1="92%" y1="42%" x2="88%" y2="52%" stroke="rgba(245,158,11,0.06)" strokeWidth="1.5" strokeDasharray="3 3" />
          <circle cx="85%" cy="35%" r="3.5" fill="rgba(245,158,11,0.2)" />
          <circle cx="92%" cy="42%" r="5" fill="rgba(245,158,11,0.3)" />
          <circle cx="88%" cy="52%" r="3" fill="rgba(245,158,11,0.2)" />
        </g>

        {/* Connection Group 3 */}
        <g className="animate-pulse" style={{ animationDuration: "14s", animationDelay: "1s" }}>
          <line x1="5%" y1="65%" x2="12%" y2="72%" stroke="rgba(122,93,245,0.07)" strokeWidth="1.5" />
          <line x1="12%" y1="72%" x2="8%" y2="82%" stroke="rgba(122,93,245,0.07)" strokeWidth="1.5" strokeDasharray="5 5" />
          <circle cx="5%" cy="65%" r="4" fill="rgba(122,93,245,0.2)" />
          <circle cx="12%" cy="72%" r="5.5" fill="rgba(122,93,245,0.3)" />
          <circle cx="8%" cy="82%" r="3.5" fill="rgba(122,93,245,0.15)" />
        </g>

        {/* Connection Group 4 */}
        <g className="animate-pulse" style={{ animationDuration: "10s", animationDelay: "3s" }}>
          <line x1="82%" y1="78%" x2="89%" y2="84%" stroke="rgba(0,86,210,0.06)" strokeWidth="1.2" />
          <line x1="89%" y1="84%" x2="94%" y2="76%" stroke="rgba(0,86,210,0.06)" strokeWidth="1.2" />
          <circle cx="82%" cy="78%" r="3" fill="rgba(0,86,210,0.15)" />
          <circle cx="89%" cy="84%" r="4" fill="rgba(0,86,210,0.25)" />
          <circle cx="94%" cy="76%" r="3" fill="rgba(0,86,210,0.15)" />
        </g>
      </svg>

      {/* Floating particles running upwards */}
      <div className="absolute inset-0 opacity-40">
        <span className="absolute block w-1 h-1 rounded-full bg-blue-400/40 animate-bounce top-[25%] left-[8%]" style={{ animationDuration: "9s" }} />
        <span className="absolute block w-1.5 h-1.5 rounded-full bg-amber-500/30 animate-bounce top-[50%] right-[12%]" style={{ animationDuration: "13s" }} />
        <span className="absolute block w-1.5 h-1.5 rounded-full bg-purple-400/40 animate-bounce top-[75%] left-[15%]" style={{ animationDuration: "11s" }} />
        <span className="absolute block w-2 h-2 rounded-full bg-blue-300/30 animate-bounce top-[85%] right-[22%]" style={{ animationDuration: "15s" }} />
      </div>

    </div>
  );
}
