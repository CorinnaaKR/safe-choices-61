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

          {/* Lazlo — visible in the gap, shadowed, guarded */}
          <div className="absolute inset-x-0 bottom-0 flex justify-center items-end overflow-hidden"
            style={{ height: '88%' }}
          >
            {/* Body silhouette */}
            <div className="relative flex flex-col items-center"
              style={{ width: '110%' }}
            >
              {/* Head */}
              <div style={{
                width: '55%',
                aspectRatio: '1',
                background: 'radial-gradient(ellipse at 40% 35%, #5a4535 0%, #3d2e1f 60%, #2a1f12 100%)',
                borderRadius: '50%',
                boxShadow: '2px 0 8px rgba(0,0,0,0.7)',
                position: 'relative',
                flexShrink: 0,
              }}>
                {/* Beard — darker chin area */}
                <div style={{
                  position: 'absolute',
                  bottom: '8%',
                  left: '15%',
                  right: '15%',
                  height: '45%',
                  background: 'rgba(20,12,5,0.55)',
                  borderRadius: '0 0 50% 50%',
                }} />
                {/* Eyes — alert, guarded */}
                <div style={{
                  position: 'absolute',
                  top: '38%',
                  left: '20%',
                  right: '20%',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}>
                  <div style={{ width: '22%', height: 3, background: '#c8a060', borderRadius: 2, opacity: 0.8 }} />
                  <div style={{ width: '22%', height: 3, background: '#c8a060', borderRadius: 2, opacity: 0.8 }} />
                </div>
              </div>
              {/* Shoulders / body */}
              <div style={{
                width: '130%',
                height: '160%',
                background: 'linear-gradient(180deg, #2e2216 0%, #1c1509 100%)',
                borderRadius: '40% 40% 0 0',
                marginTop: -4,
                flexShrink: 0,
              }} />
            </div>
          </div>
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
