// searchpage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './searchpage.css';
import checkSession from "./checkSession";

const SearchPage = () => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const userData = checkSession();
  const navigate = useNavigate();

  useEffect(() => {
    checkSession()
      .then(data => {
        if (data) {
          setIsLoggedIn(true);
        }
      });
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [itemType, setItemType] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null); 

  useEffect(() => {
    const fetchItems = async () => {
      fetch('/api/items')
        .then(response => response.json())
        .then(itemsData => {
          let filteredResults = itemsData;

          // Filter by search term
          if (searchTerm) {
            filteredResults = filteredResults.filter(item =>
              item.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
          }

          // Filter by item type
          if (itemType) {
            filteredResults = filteredResults.filter(item => item.type === itemType);
          }

          setFilteredItems(filteredResults);
        });
    };

    fetchItems();
  }, [searchTerm, itemType]);

  const handleTradeClick = (itemId) => {
    // Set the selected item in the state
    setSelectedItem(itemId);
    // Navigate users to the TradePage with the selected item ID
    navigate(`/trade/${itemId}`);
  };

  return (
    <div className="search-page">
      <h1>Search Page</h1>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for items"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={itemType} onChange={(e) => setItemType(e.target.value)}>
          <option value="">All Types</option>
          <option value="Electronics">Electronics</option>
          <option value="Home and Furniture">Home and Furniture</option>
          <option value="Clothing and Accessories">Clothing and Accessories</option>
          <option value="Books and Media">Books and Media</option>
          <option value="Collectables and Memorabilia">Collectables and Memorabilia</option>
          <option value="Toys and Hobbies">Toys and Hobbies</option>
          <option value="Sports and Outdoor Equipement">Sports and Outdoor Equipement</option>
          <option value="Tools and DIY Equipement">Tools and DIY Equipement</option>
          <option value="Health and Fitness">Health and Fitness</option>
          <option value="Vehicles and Parts">Vehicles and Parts</option>
          <option value="Arts and Crafts">Arts and Crafts</option>
          <option value="Musical Instruments">Musical Instruments</option>
          <option value="Services">Services</option>
          <option value="Tickets and Events">Tickets and Events</option>
          <option value="Pets and Pet Supplies">Pets and Pet Supplies</option>
          <option value="Miscellaneous">Miscellaneous</option>
        </select>
      </div>

      {/* Display Search Results */}
      <div className="search-results">
        <h2>Search Results</h2>
        <div className="result-grid">
          {filteredItems.map((item) => (
            <div key={item.id} className="result-box">
              <strong>{item.name}</strong> - {item.description}
              <button onClick={() => handleTradeClick(item.id)}>Trade</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
