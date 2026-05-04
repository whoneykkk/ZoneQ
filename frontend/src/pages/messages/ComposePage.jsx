import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ZQ, ZONE_COLOR } from "../../utils/colors";
import BackHeader from "../../components/layout/BackHeader";
import SeatMap from "../../components/ui/SeatMap";
import { fetchSeats } from "../../api/seats";
import { createMessage } from "../../api/messages";
import { useAuthStore } from "../../stores/authStore";

const TABS = ["S", "A", "B", "C"];

function normalizeSeatData(apiData) {
  if (!apiData) return {};
  const grouped = { S: [], A: [], B: [], C: [] };
  for (const seat of apiData) {
    if (grouped[seat.zone])
      grouped[seat.zone].push({
        ...seat,
        isOccupied: seat.status === "OCCUPIED",
      });
  }
  return grouped;
}

export default function ComposePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuthStore();

  const initialZone = searchParams.get("zone") || null;
  const initialSeatNumber = searchParams.get("seatNumber")
    ? Number(searchParams.get("seatNumber"))
    : null;

  const [tab, setTab] = useState(initialZone || "S");
  const [selSeat, setSelSeat] = useState(
    initialZone && initialSeatNumber
      ? { zone: initialZone, seatNumber: initialSeatNumber, seatId: null }
      : null,
  );
  const [body, setBody] = useState("");
  const [anon, setAnon] = useState(true);
  const [sent, setSent] = useState(false);

  const { data: seatData } = useQuery({
    queryKey: ["seats"],
    queryFn: fetchSeats,
    select: normalizeSeatData,
  });

  // URL params로 진입 시 seatId 복원
  useEffect(() => {
    if (seatData && selSeat && !selSeat.seatId) {
      const found = seatData[selSeat.zone]?.find(
        (s) => s.seatNumber === selSeat.seatNumber,
      );
      if (found)
        setSelSeat((prev) => (prev ? { ...prev, seatId: found.id } : null));
    }
  }, [seatData]);

  const mySeat = user?.seat
    ? { zone: user.seat.zone, seatNumber: user.seat.seatNumber }
    : null;

  const ready = body.trim().length > 0 && selSeat?.seatId != null;

  const mutation = useMutation({
    mutationFn: () =>
      createMessage({
        receiverSeatId: selSeat.seatId,
        body,
        isAnonymous: anon,
      }),
    onSuccess: () => setSent(true),
  });

  const handleTabChange = (t) => {
    setTab(t);
    if (selSeat?.zone !== t) setSelSeat(null);
  };

  const handleSeatClick = (zone, seatNumber, seatId) => {
    if (selSeat?.zone === zone && selSeat?.seatNumber === seatNumber)
      setSelSeat(null);
    else setSelSeat({ zone, seatNumber, seatId });
  };

  if (sent)
    return (
      <div style={{ background: ZQ.bg, minHeight: "100vh" }}>
        <BackHeader title="쪽지 보내기" onBack={() => navigate("/")} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: 400,
            gap: 12,
          }}
        >
          <div style={{ fontSize: 44 }}>✅</div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: ZQ.text,
              fontFamily: "'NanumSquare_ac', sans-serif",
            }}
          >
            쪽지를 보냈습니다
          </div>
          <button
            onClick={() => navigate("/")}
            style={{
              marginTop: 8,
              padding: "10px 24px",
              background: ZQ.S,
              color: "#fff",
              border: "none",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "'NanumSquare_ac', sans-serif",
            }}
          >
            홈으로
          </button>
        </div>
      </div>
    );

  const filteredSeats = seatData ? { [tab]: seatData[tab] || [] } : {};

  return (
    <div style={{ background: ZQ.bg, minHeight: "100vh" }}>
      <BackHeader
        title="쪽지 보내기"
        onBack={() => navigate(-1)}
        rightEl={
          <button
            onClick={() => ready && !mutation.isPending && mutation.mutate()}
            style={{
              background: "none",
              border: "none",
              fontSize: 14,
              fontWeight: 600,
              color: ready ? ZQ.blue : ZQ.textMute,
              cursor: ready ? "pointer" : "default",
              fontFamily: "'NanumSquare_ac', sans-serif",
            }}
          >
            {mutation.isPending ? "전송 중..." : "보내기"}
          </button>
        }
      />

      <div style={{ background: "#fff", marginTop: 12, padding: "14px 16px" }}>
        <div
          style={{
            fontSize: 12,
            color: ZQ.textSec,
            marginBottom: 10,
            fontFamily: "'NanumSquare_ac', sans-serif",
          }}
        >
          받는 대상
        </div>
        <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
          {TABS.map((t) => {
            const active = tab === t;
            return (
              <button
                key={t}
                onClick={() => handleTabChange(t)}
                style={{
                  flex: 1,
                  padding: "7px 0",
                  borderRadius: 8,
                  background: active ? ZONE_COLOR[t] : "#fff",
                  border: `1px solid ${active ? ZONE_COLOR[t] : ZQ.border}`,
                  color: active ? "#fff" : ZONE_COLOR[t],
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "'NanumSquare_ac', sans-serif",
                }}
              >
                {t}
              </button>
            );
          })}
        </div>

        <div style={{ marginTop: 12 }}>
          <SeatMap
            seats={filteredSeats}
            mySeat={mySeat}
            mode="compose"
            selectedSeat={selSeat}
            onSeatClick={handleSeatClick}
          />
        </div>
        {selSeat && (
          <div
            style={{
              marginTop: 8,
              padding: "7px 12px",
              background: ZQ.Sbg,
              borderRadius: 8,
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: ZQ.S,
                fontFamily: "'NanumSquare_ac', sans-serif",
              }}
            >
              {selSeat.zone}-{selSeat.seatNumber}번 좌석 선택됨
            </span>
          </div>
        )}
      </div>

      <div style={{ background: "#fff", marginTop: 10, padding: "14px 16px" }}>
        <div
          style={{
            fontSize: 12,
            color: ZQ.textSec,
            marginBottom: 8,
            fontFamily: "'NanumSquare_ac', sans-serif",
          }}
        >
          내용
        </div>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="내용을 입력하세요"
          rows={4}
          style={{
            width: "100%",
            padding: "10px 12px",
            border: `1px solid ${ZQ.border}`,
            borderRadius: 10,
            fontSize: 13,
            outline: "none",
            resize: "none",
            fontFamily: "'NanumSquare_ac', sans-serif",
            boxSizing: "border-box",
            color: ZQ.text2,
          }}
        />
      </div>

      <div
        style={{
          background: "#fff",
          marginTop: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: ZQ.text2,
              fontFamily: "'NanumSquare_ac', sans-serif",
            }}
          >
            익명으로 보내기
          </div>
          <div
            style={{
              fontSize: 11,
              color: ZQ.textMute,
              marginTop: 2,
              fontFamily: "'NanumSquare_ac', sans-serif",
            }}
          >
            상대방에게 내 좌석 정보가 표시되지 않습니다
          </div>
        </div>
        <div
          onClick={() => setAnon(!anon)}
          style={{
            width: 40,
            height: 22,
            borderRadius: 11,
            background: anon ? ZQ.blue : ZQ.textMute,
            position: "relative",
            cursor: "pointer",
            transition: "background 0.2s",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: "50%",
              background: "#fff",
              position: "absolute",
              top: 2,
              left: anon ? 20 : 2,
              transition: "left 0.2s",
              boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
