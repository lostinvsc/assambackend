"use client";

import React, { useState } from "react";
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md w-full">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        
        {/* Website Name */}
        <h1 className="text-2xl font-bold text-teal-700">Website Name</h1>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 text-gray-600">
          <NavItem label="Home" />
          <NavItem label="About" />
          <NavItem label="Notifications" />
          <NavItem label="Contact us" />
          <NavItem label="FAQ" />
        </nav>

        {/* Profile Section */}
        <div className="hidden md:flex items-center space-x-2">
          <span className="font-semibold">Profile</span>
          <FaUserCircle className="w-8 h-8 text-gray-600" />
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-teal-700">
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? "opacity-100 visible h-auto" : "opacity-0 invisible h-0"
        } absolute left-0 w-full bg-white shadow-md`}
      >
        <ul className="flex flex-col space-y-4 p-4 text-gray-600">
          <NavItem label="Home" />
          <NavItem label="About" />
          <NavItem label="Notifications" />
          <NavItem label="Contact us" />
          <NavItem label="FAQ" />
          <div className="flex items-center space-x-2 mt-4">
            <span className="font-semibold">Profile</span>
            <FaUserCircle className="w-8 h-8 text-gray-600" />
          </div>
        </ul>
      </div>
    </header>
  );
};

// Reusable Nav Item Component
const NavItem = ({ label }: { label: string }) => (
  <li className="hover:text-teal-600 cursor-pointer">{label}</li>
);

export default Header;
