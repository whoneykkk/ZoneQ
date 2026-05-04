import { ZQ, ZONE_COLOR, OCC_BG, OCC_TEXT } from '../../utils/colors'

function SeatCell({ zone, seat, isMine, mode = 'home', selected = false, onClick }) {
  if (mode === 'checkin') {
    if (seat.isOccupied) return (
      <div style={{ borderRadius: 5, padding: '9px 2px', background: ZQ.avail, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 11, fontWeight: 800, color: ZQ.availText, fontFamily: "'NanumSquare_ac', sans-serif" }}>{seat.seatNumber}</span>
      </div>
    )
    return (
      <div onClick={onClick} style={{
        borderRadius: 5, padding: '9px 2px', cursor: 'pointer',
        background: selected ? ZONE_COLOR[zone] : OCC_BG[zone],
        border: selected ? `2px solid ${ZONE_COLOR[zone]}` : '2px solid transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.1s',
      }}>
        <span style={{ fontSize: 11, fontWeight: 800, color: selected ? '#fff' : OCC_TEXT[zone], fontFamily: "'NanumSquare_ac', sans-serif" }}>{seat.seatNumber}</span>
      </div>
    )
  }

  if (mode === 'compose') {
    if (isMine) return (
      <div style={{ borderRadius: 5, padding: '9px 2px', background: ZQ.S, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 11, fontWeight: 800, color: '#fff', fontFamily: "'NanumSquare_ac', sans-serif" }}>나</span>
      </div>
    )
    if (!seat.isOccupied) return (
      <div style={{ borderRadius: 5, padding: '9px 2px', background: ZQ.avail, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 11, fontWeight: 800, color: ZQ.availText, fontFamily: "'NanumSquare_ac', sans-serif" }}>{seat.seatNumber}</span>
      </div>
    )
    return (
      <div onClick={onClick} style={{
        borderRadius: 5, padding: '9px 2px', cursor: 'pointer',
        background: selected ? ZQ.S : '#C8E6D4',
        border: selected ? `2px solid ${ZQ.S}` : '2px solid transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.1s',
      }}>
        <span style={{ fontSize: 11, fontWeight: 800, color: selected ? '#fff' : ZQ.S, fontFamily: "'NanumSquare_ac', sans-serif" }}>{seat.seatNumber}</span>
      </div>
    )
  }

  if (isMine) return (
    <div style={{ borderRadius: 5, padding: '6px 2px', background: ZQ.S, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
      <span style={{ fontSize: 10, fontWeight: 800, color: '#fff', fontFamily: "'NanumSquare_ac', sans-serif" }}>{seat.seatNumber}</span>
      <span style={{ fontSize: 8, fontWeight: 700, color: '#fff', fontFamily: "'NanumSquare_ac', sans-serif" }}>나</span>
    </div>
  )
  if (seat.isOccupied) return (
    <div onClick={onClick} style={{ borderRadius: 5, padding: '6px 2px', background: OCC_BG[zone], display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, cursor: onClick ? 'pointer' : 'default' }}>
      <span style={{ fontSize: 10, fontWeight: 800, color: OCC_TEXT[zone], fontFamily: "'NanumSquare_ac', sans-serif" }}>{seat.seatNumber}</span>
      <span style={{ fontSize: 8, fontWeight: 700, color: OCC_TEXT[zone], fontFamily: "'NanumSquare_ac', sans-serif" }}>사용중</span>
    </div>
  )
  return (
    <div style={{ borderRadius: 5, padding: '6px 2px', background: ZQ.avail, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
      <span style={{ fontSize: 10, fontWeight: 800, color: ZQ.availText, fontFamily: "'NanumSquare_ac', sans-serif" }}>{seat.seatNumber}</span>
      <span style={{ fontSize: 8, fontWeight: 700, color: ZQ.availText, fontFamily: "'NanumSquare_ac', sans-serif" }}>사용 가능</span>
    </div>
  )
}

function ZoneSection({ zone, seats, mySeat, mode, selSeat, onSeatClick }) {
  const color = ZONE_COLOR[zone]
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, paddingLeft: 10 }}>
        <span style={{ fontSize: 11, fontWeight: 800, color, fontFamily: "'NanumSquare_ac', sans-serif", letterSpacing: 0.3 }}>{zone} ZONE</span>
        <div style={{ flex: 1, height: 1, background: color }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 5 }}>
        {seats.map((s) => {
          const isMine = mySeat?.zone === zone && mySeat?.seatNumber === s.seatNumber
          const selected = selSeat?.zone === zone && selSeat?.seatNumber === s.seatNumber
          const handleClick = mode === 'checkin'
            ? (!s.isOccupied ? () => onSeatClick?.(zone, s.seatNumber, s.id) : undefined)
            : (s.isOccupied && !isMine ? () => onSeatClick?.(zone, s.seatNumber, s.id) : undefined)
          return (
            <SeatCell key={s.seatNumber} zone={zone} seat={s} isMine={isMine}
              mode={mode} selected={selected} onClick={handleClick} />
          )
        })}
      </div>
    </div>
  )
}

export default function SeatMap({ seats = {}, mySeat, mode = 'home', onSeatClick, selectedSeat }) {
  return (
    <div>
      {['S', 'A', 'B', 'C'].map((z) => (
        <ZoneSection key={z} zone={z} seats={seats[z] || []} mySeat={mySeat}
          mode={mode} selSeat={selectedSeat} onSeatClick={onSeatClick} />
      ))}
    </div>
  )
}
