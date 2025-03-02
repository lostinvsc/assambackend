"use client";

import { useState } from "react";
import axios from "axios";

const Signup = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const requestOtp = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/request-otp", { phone });
      setMessage(response.data.message);
      setStep(2);
    } catch (error: any) {
      setMessage(error.response?.data?.error || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/verify-otp", { phone, otp, username, password });
      setMessage(response.data.message);
      setStep(3);
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Invalid OTP!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {step === 1 ? "Request OTP" : step === 2 ? "Verify OTP" : "Signup Complete"}
        </h2>
        
        {message && <p className="text-center text-sm text-red-500">{message}</p>}

        {step === 1 && (
          <>
            <input
              type="text"
              placeholder="Enter Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2 border rounded-md mb-2"
            />
            <button
              onClick={requestOtp}
              disabled={loading}
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
            >
              {loading ? "Sending OTP..." : "Request OTP"}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-2 border rounded-md mb-2"
            />
            <input
              type="text"
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border rounded-md mb-2"
            />
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded-md mb-2"
            />
            <button
              onClick={verifyOtp}
              disabled={loading}
              className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
            >
              {loading ? "Verifying OTP..." : "Verify & Signup"}
            </button>
          </>
        )}

        {step === 3 && (
          <p className="text-center text-green-500 font-bold">Signup Successful! 🎉</p>
        )}
      </div>
    </div>
  );
};

export default Signup;
