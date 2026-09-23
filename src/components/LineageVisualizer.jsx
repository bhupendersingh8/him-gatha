import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useDeities } from '../hooks/useDeities';
import lineagesData from '../data/lineages.json';
import { GitFork, ShieldAlert, Award, Star } from 'lucide-react';

export default function LineageVisualizer({ currentDeityId }) {
  const { deities } = useDeities();
  const [isMobile, setIsMobile] = React.useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const relatedConnections = useMemo(() => {
    if (!deities || !currentDeityId) return [];

    // Find all relationships involving currentDeityId
    return lineagesData
      .filter(rel => rel.deityId1 === currentDeityId || rel.deityId2 === currentDeityId)
      .map(rel => {
        const isFirst = rel.deityId1 === currentDeityId;
        const targetId = isFirst ? rel.deityId2 : rel.deityId1;
        const targetDeity = deities.find(d => d.id === targetId);

        return {
          targetId,
          targetName: targetDeity ? targetDeity.name : 'Unknown Deity',
          targetDistrict: targetDeity ? targetDeity.district : '',
          relationType: rel.relationType,
          isRival: rel.relationType.toLowerCase().includes('rival')
        };
      });
  }, [deities, currentDeityId]);

  if (relatedConnections.length === 0) {
    return (
      <div className="py-12 text-center glass rounded-xl border border-[var(--border-color)]">
        <GitFork className="w-10 h-10 mx-auto mb-4 text-[var(--text-muted)] opacity-50" />
        <p className="text-[var(--text-secondary)] font-serif text-lg">No direct recorded lineage connections or rivalries found in the archive for this entity.</p>
        <p className="text-xs text-[var(--text-muted)] mt-1 font-sans">Relationships are continually being updated by traditional Kardars.</p>
      </div>
    );
  }

  return (
    <div className="py-6 space-y-12 animate-fade-in">
      <div className="text-center max-w-xl mx-auto">
        <h4 className="text-2xl font-serif text-[var(--text-primary)] mb-2">Sacred Relational Network</h4>
        <p className="text-sm text-[var(--text-secondary)] font-sans">
          Visualizing traditional relationships, family lineages, and scriptural alliances of this deity.
        </p>
      </div>

      <div className="relative flex flex-col items-center justify-center min-h-[400px] w-full p-4 overflow-hidden rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
        
        {/* Connection Lines (SVG) */}
        <div className="absolute inset-0 pointer-events-none hidden md:block">
          <svg className="w-full h-full" viewBox="-200 -200 400 400" xmlns="http://www.w3.org/2000/svg">
            {relatedConnections.map((conn, idx) => {
              // Calculate angles for radial placing
              const angle = (idx * (2 * Math.PI)) / relatedConnections.length;
              const radius = 140; // distance from center
              
              // End coordinates (relative to center)
              const endX = Math.cos(angle) * radius;
              const endY = Math.sin(angle) * radius;

              return (
                <g key={idx}>
                  <line 
                    x1="0" 
                    y1="0" 
                    x2={endX} 
                    y2={endY}
                    stroke={conn.isRival ? "rgba(239, 68, 68, 0.4)" : "rgba(197, 155, 39, 0.4)"}
                    strokeWidth="2"
                    strokeDasharray={conn.isRival ? "5,5" : "0"}
                    className="transition-all duration-300"
                  />
                </g>
              );
            })}
          </svg>
        </div>

        {/* Central Deity Node */}
        <div className="relative z-10 bg-[var(--bg-card)] p-6 rounded-2xl border-2 border-[var(--accent-color)] shadow-lg text-center max-w-[200px] mb-8 md:mb-0 transition-transform duration-300 hover:scale-105">
          <div className="w-12 h-12 rounded-full bg-[var(--accent-color)]/10 mx-auto flex items-center justify-center mb-3 text-[var(--accent-color)] border border-[var(--accent-color)]/20">
            <Star className="w-6 h-6 animate-pulse" />
          </div>
          <h5 className="font-serif text-base text-[var(--text-primary)] font-bold mb-1">Active Deity</h5>
          <p className="text-[var(--text-muted)] text-xs font-sans">Central Node</p>
        </div>

        {/* Related Deity Nodes */}
        <div className="flex flex-wrap md:absolute justify-center gap-6 md:gap-0 w-full h-full pointer-events-none">
          {relatedConnections.map((conn, idx) => {
            const angle = (idx * (2 * Math.PI)) / relatedConnections.length;
            const radius = 140; // distance from center

            const nodeStyle = {
              transform: `translate(${Math.cos(angle) * radius}px, ${Math.sin(angle) * radius}px)`
            };

            return (
              <div 
                key={conn.targetId} 
                className="pointer-events-auto transition-all duration-300 md:absolute md:top-[calc(50%-60px)] md:left-[calc(50%-100px)]"
                style={!isMobile ? nodeStyle : {}}
              >
                <Link 
                  to={`/deity/${conn.targetId}`}
                  className="block glass-card p-4 rounded-xl border border-[var(--border-color)] hover:border-[var(--accent-color)] text-center w-[180px] md:w-[200px] transition-all hover:scale-105 no-underline group"
                >
                  <div className={`w-8 h-8 rounded-full ${conn.isRival ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'} mx-auto flex items-center justify-center mb-2 border`}>
                    {conn.isRival ? <ShieldAlert className="w-4 h-4" /> : <Award className="w-4 h-4" />}
                  </div>
                  
                  {/* Connection badge on the card */}
                  <span className={`inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full mb-2 ${
                    conn.isRival ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                  }`}>
                    {conn.relationType}
                  </span>

                  <h6 className="font-serif text-sm text-[var(--text-primary)] group-hover:text-[var(--accent-color)] transition-colors line-clamp-1">{conn.targetName}</h6>
                  <p className="text-[var(--text-muted)] text-[10px] font-sans mt-0.5">{conn.targetDistrict}</p>
                </Link>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
