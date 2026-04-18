import { ZQ } from '../../utils/colors'

export default function BackHeader({ title, onBack, rightEl }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '12px 16px 12px 12px',
      background: ZQ.card, borderBottom: `1px solid ${ZQ.border}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <button onClick={onBack} style={{
          background: 'none', border: 'none', padding: '4px 6px',
          cursor: 'pointer', color: ZQ.textSec, display: 'flex',
        }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12.5 4L7 10l5.5 6" stroke="#1C1B1F" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span style={{ fontWeight: 800, fontSize: 16, color: ZQ.text, fontFamily: "'NanumSquare_ac', sans-serif" }}>
          {title}
        </span>
      </div>
      {rightEl}
    </div>
  )
}
