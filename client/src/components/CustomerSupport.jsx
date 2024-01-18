import React from "react";
import "./CustomerSupport.css";

const CustomerSupport = () => {
  return (
    <div className="container">
      <h2>Customer Support</h2>
      <div className="card">
        <p>
          If you have any questions or need assistance, please feel free to
          contact our customer support team.
        </p>
        <p>Contact Information:</p>
        <ul>
          <li>Email: support@example.com</li>
          <li>Phone: +1 (123) 456-7890</li>
        </ul>
        <p>
          Our customer support team is available during business hours to assist
          you.
        </p>
      </div>
    </div>
  );
};

export default CustomerSupport;
