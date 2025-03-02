"use client";
import { useState } from "react";

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Signup successful!");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error signing up", error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="flex bg-white rounded-lg shadow-lg w-full max-w-4xl">
        {/* Left Section */}
        <div className="w-1/2 p-8 bg-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">Website Name</h1>
          <p className="text-sm text-gray-600">Smart Office, Smarter Workdays</p>
          <div className="h-40 bg-gray-300 my-6"></div>
          <h2 className="text-xl font-bold">Seamless Access to Your Dashboard</h2>
          <p className="text-sm text-gray-600 mt-2">
            Effortlessly manage your tasks, notifications, and applications—all in one place.
          </p>
        </div>
        
        {/* Right Section */}
        <div className="w-1/2 p-8 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold text-gray-800">Sign Up</h2>
          <input
            type="text"
            placeholder="Email/Phone"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded mt-4"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded mt-2"
          />
          <button onClick={handleSignup} className="w-full p-2 mt-4 bg-blue-500 text-white rounded">
            Sign Up
          </button>
          
          <div className="flex gap-4 mt-2 text-black">
          <button onClick={handleSignup} className="w-full p-2 mt-4 bg-blue-500 text-white rounded">
            View Application
          </button>          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
