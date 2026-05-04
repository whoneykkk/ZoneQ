import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { extendTime } from "../../api/seats";
import BackHeader from "../../components/layout/BackHeader";
import { ZQ } from "../../utils/colors";

// Time plans: hours, price
const TIME_PLANS = [
  { hours: 2, price: 4000 },
  { hours: 4, price: 6000 },
  { hours: 8, price: 10000 },
  { hours: 12, price: 12000 },
];

function formatCountdown(assignedAt) {
  const MAX_MS = 5 * 60 * 60 * 1000;
  const remaining = Math.max(
    0,
    MAX_MS - (Date.now() - new Date(assignedAt).getTime()),
  );
  const h = Math.floor(remaining / 3_600_000);
  const m = Math.floor((remaining % 3_600_000) / 60_000);
  const s = Math.floor((remaining % 60_000) / 1_000);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function ExtendTimePage() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  const [countdown, setCountdown] = useState("--:--:--");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.seatAssignedAt) {
      setCountdown("--:--:--");
      return;
    }
    setCountdown(formatCountdown(user.seatAssignedAt));
    const timer = setInterval(
      () => setCountdown(formatCountdown(user.seatAssignedAt)),
      1_000,
    );
    return () => clearInterval(timer);
  }, [user?.seatAssignedAt]);

  const handlePaymentClick = () => {
    if (!selectedPlan) return;
    setShowConfirm(true);
  };

  const handleConfirmPayment = async () => {
    if (!selectedPlan || loading) return;
    setLoading(true);
    setError("");
    try {
      await extendTime(selectedPlan.hours);
      setShowConfirm(false);
      setDone(true);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (e) {
      setError(e.response?.data?.message || "시간 연장에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "#fff",
          padding: "0 16px",
        }}
      >
        <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
        <div
          style={{
            fontSize: 24,
            fontWeight: 800,
            color: ZQ.text2,
            marginBottom: 8,
            fontFamily: "'NanumSquare_ac', sans-serif",
            textAlign: "center",
          }}
        >
          연장 완료!
        </div>
        <div
          style={{
            fontSize: 14,
            color: ZQ.textSec,
            fontFamily: "'NanumSquare_ac', sans-serif",
            textAlign: "center",
          }}
        >
          시간이 추가되었습니다
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      <BackHeader title="시간 연장" onBack={() => navigate(-1)} />

      <div style={{ padding: "0 16px", paddingBottom: 120 }}>
        {/* 현재 시간 */}
        <div style={{ marginBottom: 32 }}>
          <div
            style={{
              fontSize: 12,
              color: ZQ.textMute,
              fontFamily: "'NanumSquare_ac', sans-serif",
              letterSpacing: 0.5,
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            현재 이용 시간
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 800,
              color: ZQ.text2,
              fontFamily: "'NanumSquare_ac', sans-serif",
            }}
          >
            {countdown}
          </div>
        </div>

        {/* 시간 선택 */}
        <div style={{ marginBottom: 32 }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: ZQ.text2,
              marginBottom: 12,
              fontFamily: "'NanumSquare_ac', sans-serif",
            }}
          >
            시간 선택
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {TIME_PLANS.map((plan) => {
              const isSelected = selectedPlan?.hours === plan.hours;
              const pricePerHour = Math.round(plan.price / plan.hours);

              return (
                <button
                  key={plan.hours}
                  onClick={() => setSelectedPlan(plan)}
                  style={{
                    padding: 16,
                    borderRadius: 12,
                    border: isSelected
                      ? `2px solid ${ZQ.S}`
                      : `1px solid ${ZQ.border}`,
                    background: isSelected ? ZQ.Sbg : "#fff",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ textAlign: "left", flex: 1 }}>
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: ZQ.text2,
                        marginBottom: 4,
                        fontFamily: "'NanumSquare_ac', sans-serif",
                      }}
                    >
                      {plan.hours}시간
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: ZQ.textMute,
                        fontFamily: "'NanumSquare_ac', sans-serif",
                      }}
                    >
                      {pricePerHour.toLocaleString()}원/시간
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 800,
                      color: isSelected ? ZQ.S : ZQ.text2,
                      fontFamily: "'NanumSquare_ac', sans-serif",
                    }}
                  >
                    {plan.price.toLocaleString()}원
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "12px 16px 20px",
          background: "#fff",
          borderTop: `1px solid ${ZQ.border}`,
        }}
      >
        <button
          onClick={handlePaymentClick}
          disabled={!selectedPlan}
          style={{
            width: "100%",
            padding: 16,
            borderRadius: 12,
            border: "none",
            background: selectedPlan ? "#1A1C1B" : "#ccc",
            color: "#fff",
            fontSize: 15,
            fontWeight: 800,
            cursor: selectedPlan ? "pointer" : "default",
            fontFamily: "'NanumSquare_ac', sans-serif",
          }}
        >
          {selectedPlan
            ? `${selectedPlan.hours}시간 · ${selectedPlan.price.toLocaleString()}원 결제하기`
            : "선택해주세요"}
        </button>
      </div>

      {/* Payment Confirmation Modal */}
      {showConfirm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "flex-end",
            zIndex: 1000,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowConfirm(false);
            }
          }}
        >
          <div
            style={{
              width: "100%",
              background: "#fff",
              borderRadius: "16px 16px 0 0",
              padding: "20px 16px 24px",
              maxHeight: "90vh",
              overflowY: "auto",
              animation: "slideUp 0.3s ease",
            }}
          >
            {/* Header with Price */}
            <div
              style={{
                background: ZQ.S,
                borderRadius: 12,
                padding: 20,
                marginBottom: 24,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  color: "rgba(255, 255, 255, 0.7)",
                  marginBottom: 8,
                  fontFamily: "'NanumSquare_ac', sans-serif",
                }}
              >
                결제 금액
              </div>
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 800,
                  color: "#fff",
                  fontFamily: "'NanumSquare_ac', sans-serif",
                }}
              >
                {selectedPlan?.price.toLocaleString()}원
              </div>
            </div>

            {/* Details */}
            <div style={{ marginBottom: 24 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingBottom: 12,
                  borderBottom: `1px solid ${ZQ.border}`,
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    fontSize: 14,
                    color: ZQ.textSec,
                    fontFamily: "'NanumSquare_ac', sans-serif",
                  }}
                >
                  이용권 종류
                </div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: ZQ.text2,
                    fontFamily: "'NanumSquare_ac', sans-serif",
                  }}
                >
                  {selectedPlan?.hours}시간 연장
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingBottom: 12,
                  borderBottom: `1px solid ${ZQ.border}`,
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    fontSize: 14,
                    color: ZQ.textSec,
                    fontFamily: "'NanumSquare_ac', sans-serif",
                  }}
                >
                  이용 금액
                </div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: ZQ.text2,
                    fontFamily: "'NanumSquare_ac', sans-serif",
                  }}
                >
                  {selectedPlan?.price.toLocaleString()}원
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingBottom: 12,
                }}
              >
                <div
                  style={{
                    fontSize: 14,
                    color: ZQ.textSec,
                    fontFamily: "'NanumSquare_ac', sans-serif",
                  }}
                >
                  결제 수단
                </div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: ZQ.text2,
                    fontFamily: "'NanumSquare_ac', sans-serif",
                  }}
                >
                  간편결제
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setShowConfirm(false)}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: 14,
                  borderRadius: 10,
                  border: `1px solid ${ZQ.border}`,
                  background: "#fff",
                  color: ZQ.text2,
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: loading ? "default" : "pointer",
                  fontFamily: "'NanumSquare_ac', sans-serif",
                  opacity: loading ? 0.5 : 1,
                }}
              >
                취소
              </button>
              <button
                onClick={handleConfirmPayment}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: 14,
                  borderRadius: 10,
                  border: "none",
                  background: "#1A1C1B",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: loading ? "default" : "pointer",
                  fontFamily: "'NanumSquare_ac', sans-serif",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "처리 중..." : "결제하기"}
              </button>
            </div>
            {error && (
              <div
                style={{
                  marginTop: 12,
                  padding: 12,
                  borderRadius: 8,
                  background: "#FFE9E9",
                  fontSize: 12,
                  color: ZQ.C,
                  fontFamily: "'NanumSquare_ac', sans-serif",
                }}
              >
                {error}
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
