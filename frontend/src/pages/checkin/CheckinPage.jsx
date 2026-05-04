import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '../../stores/authStore'
import { fetchSeats, assignSeat } from '../../api/seats'
import { fetchProfileMe } from '../../api/profile'
import SeatMap from '../../components/ui/SeatMap'
import { ZQ } from '../../utils/colors'

const MOCK_SEATS = {
  S: Array.from({ length: 14 }, (_, i) => ({ seatNumber: i + 1, isOccupied: [1,3,4,6,7,8,10,11,14].includes(i+1) })),
  A: Array.from({ length: 14 }, (_, i) => ({ seatNumber: i + 1, isOccupied: [1,2,4,5,6,8,9,10,11,12].includes(i+1) })),
  B: Array.from({ length: 14 }, (_, i) => ({ seatNumber: i + 1, isOccupied: [2,3,5,6,7,9,11,12,13].includes(i+1) })),
  C: Array.from({ length: 14 }, (_, i) => ({ seatNumber: i + 1, isOccupied: [1,4,5,6,8,10,11,13,14].includes(i+1) })),
}

function normalizeSeatData(apiData) {
  if (!apiData) return MOCK_SEATS
  const grouped = { S: [], A: [], B: [], C: [] }
  for (const seat of apiData) {
    if (grouped[seat.zone]) grouped[seat.zone].push(seat)
  }
  const allEmpty = Object.values(grouped).every((arr) => arr.length === 0)
  return allEmpty ? MOCK_SEATS : grouped
}

export default function CheckinPage() {
  const navigate = useNavigate()
  const { setUser } = useAuthStore()
  const [selectedSeat, setSelectedSeat] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { data: seatData } = useQuery({
    queryKey: ['seats'],
    queryFn: fetchSeats,
    select: normalizeSeatData,
  })

  const seats = seatData || MOCK_SEATS

  const handleCheckin = async () => {
    if (!selectedSeat || loading) return
    setLoading(true)
    setError('')
    try {
      await assignSeat(selectedSeat.zone, selectedSeat.seatNumber)
      const profile = await fetchProfileMe()
      setUser(profile)
      navigate('/')
    } catch (e) {
      setError(e.response?.data?.message || '체크인에 실패했습니다.')
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <div style={{ padding: '20px 16px 16px', borderBottom: `1px solid ${ZQ.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: '#1a1c1b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 32 32" fill="none">
              <rect x="4" y="4" width="10" height="10" rx="2" fill="white"/>
              <rect x="18" y="4" width="10" height="10" rx="2" fill="white"/>
              <rect x="4" y="18" width="10" height="10" rx="2" fill="white"/>
              <rect x="18" y="18" width="10" height="10" rx="2" fill="white"/>
            </svg>
          </div>
          <span style={{ fontSize: 16, fontWeight: 800, color: ZQ.text2, fontFamily: "'NanumSquare_ac', sans-serif" }}>ZoneQ</span>
        </div>
        <div style={{ fontSize: 20, fontWeight: 800, color: ZQ.text2, fontFamily: "'NanumSquare_ac', sans-serif" }}>좌석을 선택하세요</div>
        <div style={{ fontSize: 13, color: ZQ.textMute, marginTop: 4, fontFamily: "'NanumSquare_ac', sans-serif" }}>이용 가능한 좌석을 선택하여 체크인하세요</div>
      </div>

      <div style={{ display: 'flex', gap: 16, padding: '12px 16px', borderBottom: `1px solid ${ZQ.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{ width: 14, height: 14, borderRadius: 3, background: '#C8E6D4' }} />
          <span style={{ fontSize: 11, color: ZQ.textSec, fontFamily: "'NanumSquare_ac', sans-serif" }}>이용 가능</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{ width: 14, height: 14, borderRadius: 3, background: ZQ.avail }} />
          <span style={{ fontSize: 11, color: ZQ.textSec, fontFamily: "'NanumSquare_ac', sans-serif" }}>이용 중</span>
        </div>
      </div>

      <div style={{ padding: '16px' }}>
        <SeatMap seats={seats} mode="checkin" onSeatClick={(zone, seatNumber) => setSelectedSeat({ zone, seatNumber })} selectedSeat={selectedSeat} />
      </div>

      {selectedSeat && (
        <>
          <div
            onClick={() => !loading && setSelectedSeat(null)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 10 }}
          />
          <div style={{
            position: 'fixed', bottom: 0, left: 0, right: 0,
            background: '#fff', borderRadius: '20px 20px 0 0',
            padding: '20px 20px 40px', zIndex: 11,
          }}>
            <div style={{ width: 40, height: 4, borderRadius: 2, background: ZQ.border, margin: '0 auto 20px' }} />
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              <div style={{ padding: '6px 14px', borderRadius: 20, background: ZQ.Sbg, fontSize: 13, fontWeight: 700, color: ZQ.S, fontFamily: "'NanumSquare_ac', sans-serif" }}>
                {selectedSeat.zone} ZONE · {selectedSeat.seatNumber}번 좌석
              </div>
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: ZQ.text2, fontFamily: "'NanumSquare_ac', sans-serif", marginBottom: 8 }}>
              체크인하시겠습니까?
            </div>
            <div style={{ fontSize: 14, color: ZQ.textMute, fontFamily: "'NanumSquare_ac', sans-serif", marginBottom: 24 }}>
              선택한 좌석으로 이용이 시작됩니다.
            </div>
            {error && (
              <div style={{ fontSize: 12, color: ZQ.C, marginBottom: 12, fontFamily: "'NanumSquare_ac', sans-serif" }}>{error}</div>
            )}
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setSelectedSeat(null)}
                disabled={loading}
                style={{ flex: 1, padding: '14px', borderRadius: 12, background: '#F5F5F3', border: 'none', fontSize: 15, fontWeight: 700, color: ZQ.textSec, cursor: 'pointer', fontFamily: "'NanumSquare_ac', sans-serif" }}
              >
                취소
              </button>
              <button
                onClick={handleCheckin}
                disabled={loading}
                style={{ flex: 1, padding: '14px', borderRadius: 12, background: ZQ.S, border: 'none', fontSize: 15, fontWeight: 800, color: '#fff', cursor: loading ? 'default' : 'pointer', fontFamily: "'NanumSquare_ac', sans-serif" }}
              >
                {loading ? '체크인 중...' : '체크인'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
