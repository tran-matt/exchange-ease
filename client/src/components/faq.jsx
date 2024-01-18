import React from 'react';
import "./FAQ.css";

const FAQ = () => {
  return (
    <div className="faq-section">
      <h1><strong>Frequently Asked Questions (FAQ)</strong></h1>

      <section>
        <h2>General Questions</h2>
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">1. What is Exchange Ease?</h5>
            <p className="card-text">
              Exchange Ease is a platform that allows users to list their personal items and trade them with other users on the site. It provides features for inventory management, trade offers, and secure communication between users.
            </p>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <h5 className="card-title">2. How does the trading process work?</h5>
            <p className="card-text">
              Users can list their items, create trade offers, and connect with other users for potential exchanges. The platform facilitates secure messaging for negotiation, and once both parties agree, they can proceed with the trade.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>Account and Security</h2>
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">1. Is my personal information secure?</h5>
            <p className="card-text">
              Yes, Exchange Ease takes user privacy seriously. All personal information is encrypted and stored securely. We follow industry-standard security practices to protect your data.
            </p>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <h5 className="card-title">2. How can I reset my password?</h5>
            <p className="card-text">
              If you forget your password, you can use the "Forgot Password" option on the login page. Follow the instructions sent to your registered email to reset your password.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
