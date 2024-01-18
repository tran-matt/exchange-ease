import React from "react";
import { FaTwitter, FaInstagram, FaFacebook } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer-container">
      {/* Left side of the footer */}
      <div className="footer-left">
        <Link to="/faq" className="footer-link">
          <h4>FAQ</h4>
        </Link>
        <Link to="/contactus" className="footer-link">
          <h4>Contact Us</h4>
        </Link>
        <Link to="/customersupport" className="footer-link">
          <h4>Customer Support</h4>
        </Link>
      </div>

      {/* Right side of the footer */}
      <div className="footer-right">
        <h4>Stay Connected</h4>
        <div className="social-icons">
          <FaTwitter className="social-icon" />
          <FaInstagram className="social-icon" />
          <FaFacebook className="social-icon" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;