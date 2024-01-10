import React from "react";
import { useTheme } from "./ThemeContext";

const Home = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className="container mt-3">

      <div>
        <img
          src="/banner.png"
          alt="Company Banner"
          className="img-fluid"
        />
      </div>

      {/* Feature Section */}
      <div className={`mt-3 ${isDarkMode ? "bg-dark text-light" : "bg-light text-dark p-3 rounded"}`}>
        <h2 className="mb-4">New Features</h2>
        <div className="row">
          {/* Feature 1 */}
          <div className="col-md-6 mb-4">
            <img
              src="/path/to/feature1-image.jpg"
              alt="Intuitive Inventory Management"
              className="img-thumbnail"
            />
            <p><strong>Intuitive Inventory Management:</strong> Easily list, edit, and delete your personal items with our user-friendly inventory management system. Organize and showcase your items hassle-free.</p>
          </div>

          {/* Feature 2 */}
          <div className="col-md-6 mb-4">
            <img
              src="/path/to/feature2-image.jpg"
              alt="Smart Trade Matching Algorithm"
              className="img-thumbnail"
            />
            <p><strong>Smart Trade Matching Algorithm:</strong> Our advanced trade matching algorithm suggests potential trades based on user preferences, creating seamless connections between users looking to exchange items.</p>
          </div>

          {/* Feature 3 */}
          <div className="col-md-4 mb-4">
            <img
              src="/path/to/feature3-image.jpg"
              alt="Secure Messaging System"
              className="img-thumbnail"
            />
            <p><strong>Secure Messaging System:</strong> Communicate confidently with other users through our secure messaging system. Discuss trade details, negotiate offers, and finalize transactions without leaving the Exchange Ease platform.</p>
          </div>

          {/* Feature 4 */}
          <div className="col-md-4 mb-4">
            <img
              src="/path/to/feature4-image.jpg"
              alt="Real-time Trade Notifications"
              className="img-thumbnail"
            />
            <p><strong>Real-time Trade Notifications:</strong> Stay updated on trade activities with instant notifications. Receive alerts for new trade offers, accepted trades, and messages, ensuring you never miss an opportunity to connect with fellow users.</p>
          </div>

          {/* Feature 5 */}
          <div className="col-md-4 mb-4">
            <img
              src="/path/to/feature5-image.jpg"
              alt="Customizable Trade Offers"
              className="img-thumbnail"
            />
            <p><strong>Customizable Trade Offers:</strong> Tailor your trade offers to perfection. Include personalized messages, propose multi-item trades, and negotiate terms with a feature-rich trade offer system that puts you in control of your Exchange Ease experience.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
