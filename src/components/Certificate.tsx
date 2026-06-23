/**
 * Certificate of completion — rendered off-screen and captured to PDF via html2canvas + jsPDF.
 * Styled as a case-file / debrief record to match the app's own visual language
 * (mono-uppercase labels, bordered data cards, "Case closed" framing) rather than
 * a generic award-certificate template. See HANDOVER.md for the brand direction.
 */
import heliLogo from '@/assets/heli-logo.png';

export interface CertificateProps {
  name: string;
  organisation?: string;
  scenarioTitle: string;
  scenarioRole: string;
  completedAt: string;
  score: number;
  grade: string;
  passThreshold: number;
}

export const CERTIFICATE_WIDTH = 1000;
export const CERTIFICATE_HEIGHT = 700;

export default function Certificate({
  name,
  organisation,
  scenarioTitle,
  scenarioRole,
  completedAt,
  score,
  grade,
  passThreshold,
}: CertificateProps) {
  return (
    <div
      style={{
        width: CERTIFICATE_WIDTH,
        height: CERTIFICATE_HEIGHT,
        background: 'hsl(26 14% 19%)',
        color: 'hsl(36 25% 91%)',
        fontFamily: '"Archivo", system-ui, sans-serif',
        boxSizing: 'border-box',
        padding: '52px 60px',
        position: 'relative',
      }}
    >
      {/* header row: case-id style label + logo badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '36px' }}>
        <div>
          <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'hsl(32 85% 58%)', margin: 0 }}>
            Case closed — Certificate of record
          </p>
          <h1 style={{ fontSize: '38px', fontWeight: 700, letterSpacing: '-0.01em', margin: '8px 0 0', lineHeight: 1.15 }}>
            {name}
          </h1>
          {organisation && (
            <p style={{ fontSize: '14px', color: 'hsl(33 22% 70%)', margin: '4px 0 0' }}>{organisation}</p>
          )}
        </div>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: 'hsl(26 14% 24%)',
            border: '1px solid hsl(26 14% 38%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <img src={heliLogo} alt="Heli" width={36} height={36} />
        </div>
      </div>

      <div style={{ height: '1px', background: 'hsl(26 14% 38%)', marginBottom: '32px' }} />

      {/* body copy */}
      <p style={{ fontSize: '15px', lineHeight: 1.7, color: 'hsl(36 25% 88%)', maxWidth: '720px', margin: '0 0 32px' }}>
        This record confirms that the above individual completed the{' '}
        <strong style={{ color: 'hsl(36 25% 91%)' }}>{scenarioTitle}</strong> simulation
        ({scenarioRole}) on <strong style={{ color: 'hsl(36 25% 91%)' }}>{completedAt}</strong>,
        achieving a score of <strong style={{ color: 'hsl(32 85% 58%)' }}>{score}%</strong>.
      </p>

      {/* data grid — same idiom as the results page score block */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '40px' }}>
        {[
          { label: 'Score', value: `${score}%` },
          { label: 'Outcome', value: grade },
          { label: 'Pass mark', value: `${passThreshold}%` },
          { label: 'Status', value: score >= passThreshold ? 'Passed' : 'Not passed' },
        ].map(({ label, value }) => (
          <div
            key={label}
            style={{
              background: 'hsl(26 14% 24%)',
              border: '1px solid hsl(26 14% 38%)',
              borderRadius: '10px',
              padding: '14px 16px',
            }}
          >
            <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'hsl(33 22% 62%)', margin: '0 0 6px' }}>
              {label}
            </p>
            <p style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'hsl(36 25% 91%)' }}>{value}</p>
          </div>
        ))}
      </div>

      {/* footer note */}
      <p
        style={{
          position: 'absolute',
          left: 60,
          right: 60,
          bottom: 96,
          fontSize: '12px',
          lineHeight: 1.6,
          color: 'hsl(33 22% 58%)',
          borderBottom: '1px solid hsl(26 14% 38%)',
          paddingBottom: '20px',
        }}
      >
        This simulation validates applied awareness and professional judgement as a complement
        to formal safeguarding and Prevent training. It does not replace statutory training requirements.
      </p>

      {/* sign-off */}
      <div
        style={{
          position: 'absolute',
          left: 60,
          right: 60,
          bottom: 52,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
        }}
      >
        <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'hsl(33 22% 62%)', margin: 0 }}>
          Heli — Helping Everyone Learn Interactively
        </p>
        <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'hsl(33 22% 62%)', margin: 0 }}>
          Issued {completedAt}
        </p>
      </div>
    </div>
  );
}
