// tradepage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import checkSession from "./checkSession";
import './TradePage.css';

const TradePage = () => {
  const { itemId } = useParams();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [userItems, setUserItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    checkSession().then(data => {
      if (data) {
        setIsLoggedIn(true);
        setUser(data);
        fetchItemDetails(itemId).then(itemDetails => setSelectedItem(itemDetails));
        fetchUserItems(data.id).then(items => setUserItems(items));
      }
    });
  }, [itemId]);

  const fetchUserItems = async (userId) => {
    try {
      const response = await fetch(`/api/items/user`);
      if (response.ok) {
        const itemsData = await response.json();
        return itemsData;
      } else {
        console.error("Failed to fetch user items:", response.status);
        return [];
      }
    } catch (error) {
      console.error("Error fetching user items:", error);
      return [];
    }
  };

  const handleToggleItemSelection = (itemId) => {
    const isSelected = selectedItems.includes(itemId);
    setSelectedItems((prevSelectedItems) =>
      isSelected
        ? prevSelectedItems.filter((selectedItem) => selectedItem !== itemId)
        : [...prevSelectedItems, itemId]
    );
  };

  const handleConfirmOffer = async () => {
    try {
      const response = await fetch("/api/trades", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          initiator_id: user.id,
          receiver_id: selectedItem.owner_id,
          item_id: selectedItem.id,
          selected_items: selectedItems,
          status: 'pending',
        }),
      });
  
      console.log('Response status:', response.status);
  
      if (response.ok) {
        // Handle successful trade offer initiation

        navigate('/userdashboard');
        console.log('Trade offer initiated successfully!');
      } else {
        console.error('Failed to initiate trade offer:', response.status);
      }
    } catch (error) {
      console.error('Error initiating trade offer:', error);
    }
  };
  


  return (
    <div className="trade-page-container">
      {isLoggedIn && selectedItem && (
        <div className="selected-item-box">
          <h2><strong>Selected Item for Trade</strong></h2>
          <p><strong>Item Name:</strong> {selectedItem.name}</p>
          <p><strong>Description:</strong> {selectedItem.description}</p>
          <img src={selectedItem.image} alt={selectedItem.name} />
        </div>
      )}

      {isLoggedIn && (
        <div className="user-items-box">
          <h2><strong>Your Items for Trade</strong></h2>
          <ul>
            {userItems.map((item) => (
              <li key={item.id}>
                <p><strong>Item Name: </strong>{item.name}</p>
                <p><strong>Description: </strong>{item.description}</p>
                <img src={item.image} alt={item.name} />
                <button onClick={() => handleToggleItemSelection(item.id)}>
                  {selectedItems.includes(item.id) ? 'Deselect' : 'Select'}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Confirm trade offer section */}
      <div className="confirm-offer-section">
        <p><strong>Confirm trade offer?</strong></p>
        <button onClick={handleConfirmOffer}>Confirm offer</button>
      </div>
    </div>
  );
};

const fetchItemDetails = async (itemId) => {
  const response = await fetch(`/api/items/${itemId}`);
  const itemDetails = await response.json();
  return itemDetails;
};

export default TradePage;
