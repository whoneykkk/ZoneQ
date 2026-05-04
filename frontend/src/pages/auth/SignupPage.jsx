import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchSignup } from "../../api/auth";
import { ZQ } from "../../utils/colors";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "이름을 입력해주세요";
    }

    if (!email.includes("@")) {
      newErrors.email = "올바른 이메일 형식을 입력해주세요";
    }

    if (password.length < 6) {
      newErrors.password = "비밀번호는 6자 이상이어야 합니다";
    }

    if (passwordConfirm !== password) {
      newErrors.passwordConfirm = "비밀번호가 일치하지 않습니다";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateForm() || loading) return;
    setLoading(true);
    try {
      await fetchSignup(name.trim(), email, password);
      setSuccess(true);
      setTimeout(() => {
        navigate("/checkin");
      }, 1500);
    } catch (e) {
      setErrors({
        general: e.response?.data?.message || "회원가입에 실패했습니다.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSignup();
  };

  const isFormValid =
    name.trim().length > 0 &&
    email.includes("@") &&
    password.length >= 6 &&
    passwordConfirm === password &&
    passwordConfirm.length > 0;

  if (success) {
    return (
      <div
        style={{
          height: "100%",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "#fff",
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 16 }}>✨</div>
        <div
          style={{
            fontSize: 24,
            fontWeight: 800,
            color: ZQ.text2,
            marginBottom: 8,
            fontFamily: "'NanumSquare_ac', sans-serif",
          }}
        >
          가입 완료!
        </div>
        <div
          style={{
            fontSize: 14,
            color: ZQ.textSec,
            fontFamily: "'NanumSquare_ac', sans-serif",
          }}
        >
          이제 ZoneQ를 이용할 수 있습니다
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        height: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 32px",
        background: "#fff",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            background: "#1a1c1b",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
          }}
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect x="4" y="4" width="10" height="10" rx="2" fill="white" />
            <rect x="18" y="4" width="10" height="10" rx="2" fill="white" />
            <rect x="4" y="18" width="10" height="10" rx="2" fill="white" />
            <rect x="18" y="18" width="10" height="10" rx="2" fill="white" />
          </svg>
        </div>
        <div
          style={{
            fontSize: 24,
            fontWeight: 800,
            color: ZQ.text2,
            letterSpacing: -0.5,
            fontFamily: "'NanumSquare_ac', sans-serif",
          }}
        >
          ZoneQ
        </div>
        <div
          style={{
            fontSize: 13,
            color: ZQ.textSec,
            marginTop: 4,
            fontFamily: "'NanumSquare_ac', sans-serif",
          }}
        >
          스터디카페 소음 관리 시스템
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div>
          <div
            style={{
              fontSize: 12,
              color: ZQ.textSec,
              marginBottom: 6,
              fontFamily: "'NanumSquare_ac', sans-serif",
            }}
          >
            이름
          </div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="홍길동"
            style={{
              width: "100%",
              padding: "12px 14px",
              border: `1px solid ${errors.name ? ZQ.C : ZQ.border}`,
              borderRadius: 10,
              fontSize: 14,
              outline: "none",
              boxSizing: "border-box",
              color: ZQ.text2,
              fontFamily: "'NanumSquare_ac', sans-serif",
            }}
          />
          {errors.name && (
            <div
              style={{
                fontSize: 11,
                color: ZQ.C,
                marginTop: 4,
                fontFamily: "'NanumSquare_ac', sans-serif",
              }}
            >
              {errors.name}
            </div>
          )}
        </div>

        <div>
          <div
            style={{
              fontSize: 12,
              color: ZQ.textSec,
              marginBottom: 6,
              fontFamily: "'NanumSquare_ac', sans-serif",
            }}
          >
            이메일
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="name@example.com"
            style={{
              width: "100%",
              padding: "12px 14px",
              border: `1px solid ${errors.email ? ZQ.C : ZQ.border}`,
              borderRadius: 10,
              fontSize: 14,
              outline: "none",
              boxSizing: "border-box",
              color: ZQ.text2,
              fontFamily: "'NanumSquare_ac', sans-serif",
            }}
          />
          {errors.email && (
            <div
              style={{
                fontSize: 11,
                color: ZQ.C,
                marginTop: 4,
                fontFamily: "'NanumSquare_ac', sans-serif",
              }}
            >
              {errors.email}
            </div>
          )}
        </div>

        <div>
          <div
            style={{
              fontSize: 12,
              color: ZQ.textSec,
              marginBottom: 6,
              fontFamily: "'NanumSquare_ac', sans-serif",
            }}
          >
            비밀번호
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="••••••••"
            style={{
              width: "100%",
              padding: "12px 14px",
              border: `1px solid ${errors.password ? ZQ.C : ZQ.border}`,
              borderRadius: 10,
              fontSize: 14,
              outline: "none",
              boxSizing: "border-box",
              color: ZQ.text2,
              fontFamily: "'NanumSquare_ac', sans-serif",
            }}
          />
          {errors.password && (
            <div
              style={{
                fontSize: 11,
                color: ZQ.C,
                marginTop: 4,
                fontFamily: "'NanumSquare_ac', sans-serif",
              }}
            >
              {errors.password}
            </div>
          )}
        </div>

        <div>
          <div
            style={{
              fontSize: 12,
              color: ZQ.textSec,
              marginBottom: 6,
              fontFamily: "'NanumSquare_ac', sans-serif",
            }}
          >
            비밀번호 확인
          </div>
          <input
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="••••••••"
            style={{
              width: "100%",
              padding: "12px 14px",
              border: `1px solid ${errors.passwordConfirm ? ZQ.C : ZQ.border}`,
              borderRadius: 10,
              fontSize: 14,
              outline: "none",
              boxSizing: "border-box",
              color: ZQ.text2,
              fontFamily: "'NanumSquare_ac', sans-serif",
            }}
          />
          {errors.passwordConfirm && (
            <div
              style={{
                fontSize: 11,
                color: ZQ.C,
                marginTop: 4,
                fontFamily: "'NanumSquare_ac', sans-serif",
              }}
            >
              {errors.passwordConfirm}
            </div>
          )}
        </div>

        {errors.general && (
          <div
            style={{
              fontSize: 12,
              color: ZQ.C,
              fontFamily: "'NanumSquare_ac', sans-serif",
            }}
          >
            {errors.general}
          </div>
        )}

        <button
          onClick={handleSignup}
          disabled={!isFormValid || loading}
          style={{
            marginTop: 8,
            padding: "14px",
            borderRadius: 12,
            background: isFormValid && !loading ? "#1A1C1B" : "#ccc",
            color: "#fff",
            border: "none",
            fontSize: 15,
            fontWeight: 800,
            cursor: isFormValid && !loading ? "pointer" : "default",
            fontFamily: "'NanumSquare_ac', sans-serif",
          }}
        >
          {loading ? "가입 중..." : "회원가입"}
        </button>
      </div>

      <div
        style={{
          textAlign: "center",
          marginTop: 24,
          fontSize: 13,
          color: ZQ.textSec,
          fontFamily: "'NanumSquare_ac', sans-serif",
        }}
      >
        이미 계정이 있으신가요?{" "}
        <span
          onClick={() => navigate("/auth/login")}
          style={{ color: ZQ.blue, cursor: "pointer", fontWeight: 500 }}
        >
          로그인
        </span>
      </div>
    </div>
  );
}
