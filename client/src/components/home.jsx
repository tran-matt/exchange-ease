import React from "react";
import { useTheme } from "./ThemeContext";
import "./home.css";

const Home = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`container mt-3 ${isDarkMode ? "dark-mode" : ""}`}>

      <div>
        <img
          src="/banner.png"
          alt="Company Banner"
          className="img-fluid"
        />
      </div>

      {/* Feature Section */}
      <div className={`mt-3 feature-section ${isDarkMode ? "dark-mode" : "light-mode"}`}>
        <h2 className={`mb-4 text-center ${isDarkMode ? "text-light" : "text-dark"}`}><strong>Our Features</strong></h2>
        <div className="row justify-content-center">
          {/* Feature 1 */}
          <div className={`col-md-4 mb-4 text-center feature-card ${isDarkMode ? "dark-mode-card" : "light-mode-card"}`}>
            <img
              src="/inventory.png"
              alt="Intuitive Inventory Management"
              className="img-thumbnail feature-image"
            />
            <h3 style={{ fontSize: "1.2rem", color: isDarkMode ? "#fff" : "#000" }}><strong>Intuitive Inventory Management</strong></h3>
            <p style={{ fontSize: "1rem", color: isDarkMode ? "#ddd" : "#333" }}>Easily list, edit, and delete your personal items with our user-friendly inventory management system. Organize and showcase your items hassle-free.</p>
          </div>

          {/* Feature 2 */}
          <div className={`col-md-4 mb-4 text-center feature-card ${isDarkMode ? "dark-mode-card" : "light-mode-card"}`}>
            <img
              src="smart.png"
              alt="Smart Trade Matching Algorithm"
              className="img-thumbnail feature-image"
            />
            <h3 style={{ fontSize: "1.2rem", color: isDarkMode ? "#fff" : "#000" }}><strong>Smart Trade Matching Algorithm</strong></h3>
            <p style={{ fontSize: "1rem", color: isDarkMode ? "#ddd" : "#333" }}>Our advanced trade matching algorithm suggests potential trades based on user preferences, creating seamless connections between users looking to exchange items.</p>
          </div>

          {/* Feature 3 */}
          <div className={`col-md-4 mb-4 text-center feature-card ${isDarkMode ? "dark-mode-card" : "light-mode-card"}`}>
            <img
              src="secure.png"
              alt="Secure Messaging System"
              className="img-thumbnail feature-image"
            />
            <h3 style={{ fontSize: "1.2rem", color: isDarkMode ? "#fff" : "#000" }}><strong>Secure Messaging System</strong></h3>
            <p style={{ fontSize: "1rem", color: isDarkMode ? "#ddd" : "#333" }}>Communicate confidently with other users through our secure messaging system. Discuss trade details, negotiate offers, and finalize transactions without leaving the Exchange Ease platform.</p>
          </div>
        </div>

        <div className="row justify-content-center">
          {/* Feature 4 */}
          <div className={`col-md-6 mb-4 text-center feature-card ${isDarkMode ? "dark-mode-card" : "light-mode-card"}`}>
            <img
              src="notification.png"
              alt="Real-time Trade Notifications"
              className="img-thumbnail feature-image"
            />
            <h3 style={{ fontSize: "1.2rem", color: isDarkMode ? "#fff" : "#000" }}><strong>Real-time Trade Notifications</strong></h3>
            <p style={{ fontSize: "1rem", color: isDarkMode ? "#ddd" : "#333" }}>Stay updated on trade activities with instant notifications. Receive alerts for new trade offers, accepted trades, and messages, ensuring you never miss an opportunity to connect with fellow users.</p>
          </div>

          {/* Feature 5 */}
          <div className={`col-md-6 mb-4 text-center feature-card ${isDarkMode ? "dark-mode-card" : "light-mode-card"}`}>
            <img
              src="offer.png"
              alt="Customizable Trade Offers"
              className="img-thumbnail feature-image"
            />
            <h3 style={{ fontSize: "1.2rem", color: isDarkMode ? "#fff" : "#000" }}><strong>Customizable Trade Offers</strong></h3>
            <p style={{ fontSize: "1rem", color: isDarkMode ? "#ddd" : "#333" }}>Tailor your trade offers to perfection. Include personalized messages, propose multi-item trades, and negotiate terms with a feature-rich trade offer system that puts you in control of your Exchange Ease experience.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
