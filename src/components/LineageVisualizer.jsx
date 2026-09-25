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

  const currentDeity = useMemo(() => {
    return deities?.find(d => d.id === currentDeityId);
  }, [deities, currentDeityId]);

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
      <div className="py-12 text-center bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] shadow-sm">
        <GitFork className="w-10 h-10 mx-auto mb-4 text-[var(--accent-gold)] opacity-60" />
        <p className="text-[var(--text-secondary)] font-serif text-lg">No direct recorded lineage connections or rivalries found in the archive for this entity.</p>
        <p className="text-xs text-[var(--text-muted)] mt-1 font-sans">Relationships and brotherhood affiliations (Bhaibandh / Bair) are continually documented with village elders.</p>
      </div>
    );
  }

  return (
    <div className="py-6 space-y-12 animate-fade-in">
      <div className="text-center max-w-xl mx-auto">
        <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[var(--accent-gold)] block mb-1">
          Pahari Dev-Parampara
        </span>
        <h4 className="text-2xl sm:text-3xl font-serif text-[var(--text-primary)] font-bold mb-2">Sacred Relational Network</h4>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-sans">
          Documenting traditional spiritual lineages, divine brotherhoods, and ancient territorial rivalries across Dev-Bhumi.
        </p>
      </div>

      <div className="relative flex flex-col items-center justify-center min-h-[440px] w-full p-6 overflow-hidden rounded-3xl bg-gradient-to-b from-[var(--bg-secondary)] to-[var(--bg-primary)] border border-[var(--border-color)] shadow-sm">
        
        {/* Connection Lines (SVG) */}
        <div className="absolute inset-0 pointer-events-none hidden md:block">
          <svg className="w-full h-full" viewBox="-200 -200 400 400" xmlns="http://www.w3.org/2000/svg">
            <circle cx="0" cy="0" r="140" fill="none" stroke="rgba(197, 155, 39, 0.15)" strokeWidth="1" strokeDasharray="3,3" />
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
                    stroke={conn.isRival ? "rgba(220, 38, 38, 0.45)" : "rgba(197, 155, 39, 0.45)"}
                    strokeWidth="2"
                    strokeDasharray={conn.isRival ? "4,4" : "0"}
                    className="transition-all duration-300"
                  />
                </g>
              );
            })}
          </svg>
        </div>

        {/* Central Deity Node */}
        <div className="relative z-10 bg-[var(--bg-card)] p-5 rounded-2xl border-2 border-[var(--accent-color)] shadow-luxury text-center max-w-[220px] mb-8 md:mb-0 transition-transform duration-300 hover:scale-105">
          <div className="w-12 h-12 rounded-full bg-[var(--accent-color)]/10 mx-auto flex items-center justify-center mb-2.5 text-[var(--accent-color)] border border-[var(--accent-color)]/25">
            <Star className="w-5 h-5 animate-pulse text-[var(--accent-gold)]" />
          </div>
          <h5 className="font-serif text-base text-[var(--text-primary)] font-bold mb-0.5 line-clamp-2">
            {currentDeity?.name || 'Active Deity'}
          </h5>
          <p className="text-[var(--accent-color)] text-[10px] font-mono uppercase tracking-wider font-bold">
            {currentDeity?.district || 'Himachal'} • Central Node
          </p>
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
                  className="block archival-plate p-4 rounded-2xl border border-[var(--border-color)] hover:border-[var(--accent-gold)] text-center w-[180px] md:w-[200px] transition-all duration-300 hover:scale-105 no-underline group shadow-sm"
                >
                  <div className={`w-8 h-8 rounded-full ${conn.isRival ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/25' : 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/25'} mx-auto flex items-center justify-center mb-2 border`}>
                    {conn.isRival ? <ShieldAlert className="w-4 h-4" /> : <Award className="w-4 h-4" />}
                  </div>
                  
                  {/* Connection badge on the card */}
                  <span className={`inline-block text-[9px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded-full mb-1.5 ${
                    conn.isRival ? 'bg-red-500/10 text-red-700 dark:text-red-300 border border-red-500/25' : 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/25'
                  }`}>
                    {conn.relationType}
                  </span>

                  <h6 className="font-serif text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-color)] transition-colors line-clamp-1">{conn.targetName}</h6>
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
