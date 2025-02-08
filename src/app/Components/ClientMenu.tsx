"use client";  // This makes the component interactive

import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

const ClientMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="relative md:hidden">
      {/* Mobile Menu Toggle Button */}
      <button
        className="text-teal-700 focus:outline-none"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Mobile Menu */}
      <div
        className={`absolute top-full left-0 w-full bg-white shadow-md transition-all duration-300 ease-in-out ${
          isMenuOpen ? "opacity-100 visible h-auto" : "opacity-0 invisible h-0"
        }`}
      >
        <ul className="flex flex-row space-y-4 p-4 text-gray-600">
          <li className="hover:text-teal-600 cursor-pointer">Home</li>
          <li className="hover:text-teal-600 cursor-pointer">About</li>
          <li className="hover:text-teal-600 cursor-pointer">Notifications</li>
          <li className="hover:text-teal-600 cursor-pointer">Contact us</li>
          <li className="hover:text-teal-600 cursor-pointer">FAQ</li>
        </ul>
      </div>
    </div>
  );
};

export default ClientMenu;
