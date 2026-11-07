/**
 * DoorstepScene — 2D illustrated scene for Lazlo's doorstep moment.
 * Replaces the 3D home interior for scene-l0, where the narrative describes
 * Lazlo answering the door on a chain, not the interior of his flat.
 */

export function DoorstepScene() {
  return (
    <div className="absolute inset-0 flex items-end justify-center overflow-hidden select-none"
      style={{ background: 'linear-gradient(180deg, #0e0d0b 0%, #1a1712 55%, #221e18 100%)' }}
    >
      {/* Ambient outdoor light — cold, overcast afternoon */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(160,175,200,0.07) 0%, transparent 100%)' }}
      />

      {/* Door frame — sits centred, slightly below mid-screen */}
      <div className="relative flex-shrink-0 mb-[8vh]" style={{ width: 'min(340px, 62vw)', height: 'min(480px, 76vh)' }}>

        {/* Frame surround */}
        <div className="absolute inset-0 rounded-none"
          style={{
            border: '10px solid #2a2319',
            boxShadow: '0 0 0 4px #1a1510, 0 24px 80px rgba(0,0,0,0.85), inset 0 0 30px rgba(0,0,0,0.6)',
            background: '#1c1810',
          }}
        />

        {/* Door surface — left panel (main door, slightly ajar) */}
        <div className="absolute inset-[10px]"
          style={{
            background: 'linear-gradient(135deg, #3d3020 0%, #2e2418 60%, #231c12 100%)',
            boxShadow: 'inset -8px 0 24px rgba(0,0,0,0.5)',
          }}
        >
          {/* Door panel detail — top */}
          <div className="absolute top-[12%] left-[10%] right-[10%] h-[22%] rounded-none"
            style={{ border: '2px solid #4a3c28', background: 'rgba(0,0,0,0.15)' }}
          />
          {/* Door panel detail — bottom */}
          <div className="absolute top-[42%] left-[10%] right-[10%] h-[32%] rounded-none"
            style={{ border: '2px solid #4a3c28', background: 'rgba(0,0,0,0.15)' }}
          />
          {/* Door handle */}
          <div className="absolute right-[14%] top-[50%]"
            style={{ width: 10, height: 36, background: '#7a6840', borderRadius: 3 }}
          />

          {/* Chain — horizontal across the gap */}
          <div className="absolute right-0 top-[38%] flex items-center"
            style={{ width: '30%', height: 6 }}
          >
            <div className="w-full h-full"
              style={{
                background: 'repeating-linear-gradient(90deg, #8a7a50 0px, #8a7a50 6px, #6a5c38 6px, #6a5c38 12px)',
                opacity: 0.9,
                boxShadow: '0 1px 4px rgba(0,0,0,0.6)',
              }}
            />
          </div>
        </div>

        {/* Gap — narrow strip where door is open on the chain */}
        <div className="absolute right-[10px] inset-y-[10px]"
          style={{ width: '22%', background: '#0d0b08', boxShadow: 'inset 4px 0 16px rgba(0,0,0,0.8)' }}
        >
          {/* Warm interior light spilling through gap */}
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(90deg, rgba(180,130,60,0.18) 0%, rgba(160,110,40,0.06) 100%)' }}
          />

          {/* Lazlo — SVG primitive style, matching in-game NPC geometry */}
          <svg
            viewBox="0 0 80 240"
            preserveAspectRatio="xMidYMax meet"
            aria-hidden="true"
            style={{
              position: 'absolute',
              bottom: 0,
              left: '50%',
              transform: 'translateX(-52%)',
              width: '140%',
              height: '88%',
            }}
          >
            <rect x="5" y="138" width="70" height="102" rx="20" fill="#6B5C7A"/>
            <ellipse cx="40" cy="138" rx="35" ry="16" fill="#6B5C7A"/>
            <rect x="31" y="110" width="18" height="30" rx="6" fill="#D4A87A"/>
            <circle cx="40" cy="76" r="26" fill="#D4A87A"/>
            <path d="M 14 76 A 26 26 0 0 1 66 76 Q 62 48 40 46 Q 18 48 14 76 Z" fill="#4A2E14"/>
            <ellipse cx="26" cy="92" rx="9" ry="8" fill="#3A2814"/>
            <ellipse cx="40" cy="98" rx="12" ry="8" fill="#3A2814"/>
            <ellipse cx="54" cy="92" rx="9" ry="8" fill="#3A2814"/>
            <ellipse cx="40" cy="84" rx="9" ry="5" fill="#3A2814"/>
            <circle cx="31" cy="70" r="5" fill="#F0F0F0"/>
            <circle cx="31" cy="70" r="3.2" fill="#2A2A2A"/>
            <circle cx="49" cy="70" r="5" fill="#F0F0F0"/>
            <circle cx="49" cy="70" r="3.2" fill="#2A2A2A"/>
            <circle cx="40" cy="76" r="26" fill="rgba(0,0,0,0.22)"/>
          </svg>
        </div>

        {/* Peephole */}
        <div className="absolute"
          style={{
            width: 10, height: 10,
            borderRadius: '50%',
            background: '#0a0806',
            border: '2px solid #5a4830',
            top: '28%',
            right: 'calc(22% + 10px + 8px)',
          }}
        />
      </div>

      {/* Ground shadow */}
      <div className="absolute bottom-0 left-0 right-0 h-[15%] pointer-events-none"
        style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.7) 0%, transparent 100%)' }}
      />
    </div>
  );
}
