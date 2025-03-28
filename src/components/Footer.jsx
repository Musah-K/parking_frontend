import { IoMailUnreadOutline } from "react-icons/io5";
import { FaPhoneAlt, FaWhatsapp } from "react-icons/fa";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
        {/* Footer Links */}
        <p className="text-sm">&copy; {new Date().getFullYear()} St. Peter Clavers Parking. All rights reserved.</p>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 mt-4 md:mt-0">
          <a href="#" className="hover:text-gray-400">Privacy Policy</a>
          <a href="#" className="hover:text-gray-400">Terms of Service</a>
          <a href="mailto:support@example.com" className="hover:text-gray-400 flex items-center gap-1">
            <IoMailUnreadOutline />
            <span>Contact Us</span>
          </a>
        </div>
      </div>

      {/* Developer Contact Info */}
      <div className="container mx-auto px-4 mt-6 text-center">
        <h3 className="text-lg font-semibold mb-2">Developer Contact</h3>
        <p className="flex items-center justify-center gap-2">
          <IoMailUnreadOutline className="text-blue-400" />
          <a href="mailto:moscode@gmail.com" className="text-blue-400 hover:underline">moscode@gmail.com</a>
        </p>
        <p className="flex items-center justify-center gap-2 mt-2">
          <FaWhatsapp className="text-green-400" />
          <a href="https://wa.me/254795360391" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">
            WhatsApp
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
