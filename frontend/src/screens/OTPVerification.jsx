// src/screens/OTPVerification.jsx - UPDATED
import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Shield, ChevronLeft } from "lucide-react";
import { sendOtp, verifyOtp } from "../api/api";
import toast from "react-hot-toast";
import "./OTPVerification.css";

export default function OTPVerification() {
  const location = useLocation();
  const navigate = useNavigate();
  const { email, orderId, redirectTo } = location.state || {};

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email) {
      toast.error("Email is required");
      navigate("/");
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [email, navigate]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      toast.error("Please enter a complete 6-digit code");
      return;
    }

    setLoading(true);
    try {
      const response = await verifyOtp(email, otpCode, orderId);
      
      if (response.data.ok) {
        // Save user data to localStorage
        if (response.data.token) {
          localStorage.setItem('calvio_token', response.data.token);
          localStorage.setItem('calvio_user', JSON.stringify(response.data.user));
          localStorage.setItem('calvio_user_email', email);
        }

        toast.success("Email verified successfully!");

        // Navigate based on context
        if (orderId) {
          navigate("/order-success", {
            state: { orderId, email },
          });
        } else if (redirectTo) {
          navigate(redirectTo);
        } else {
          navigate("/profile");
        }
      }
    } catch (err) {
      console.error("OTP verification failed:", err);
      const message = err?.response?.data?.message || "Invalid or expired OTP";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    try {
      await sendOtp(email);
      toast.success("New OTP sent!");
      setTimeLeft(300);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (err) {
      toast.error("Failed to resend OTP. Please try again.");
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="otp-page">
      <div className="otp-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ChevronLeft size={20} /> Back
        </button>

        <div className="otp-header">
          <div className="shield-icon">
            <Shield size={40} />
          </div>
          <h1>Verify Your Email</h1>
          <p>
            We've sent a 6-digit verification code to <strong>{email}</strong>
          </p>
        </div>

        <div className="otp-inputs">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="otp-input"
              autoFocus={index === 0}
            />
          ))}
        </div>

        <div className="timer">
          {timeLeft > 0 ? (
            <p>
              Time remaining: <strong>{formatTime(timeLeft)}</strong>
            </p>
          ) : (
            <p className="expired">Code expired!</p>
          )}
        </div>

        <button
          className="verify-btn"
          onClick={handleVerify}
          disabled={loading || otp.join("").length !== 6}
        >
          {loading ? "Verifying..." : "Verify Email"}
        </button>

        <div className="resend-section">
          <p>Didn't receive the code?</p>
          <button
            className="resend-btn"
            onClick={handleResend}
            disabled={!canResend}
          >
            Resend OTP
          </button>
        </div>

        <div className="info-box">
          <p>
            ✓ Check your spam folder if you don't see the email
            <br />✓ Make sure you entered the correct email address
          </p>
        </div>
      </div>
    </div>
  );
}