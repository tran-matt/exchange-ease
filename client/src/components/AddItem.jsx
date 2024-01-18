// AddItem.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddItem.css";

const AddItem = ({ user }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    estimatedValue: "",
    image: "",
    itemType: "",
  });

  const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // if (!user || !user.id) {
      //   console.error('User or user id is undefined.');
      //   return;
      // // }
      // const ownerId = user.id;  
      const formDataToSend = {
        name: formData.name,
        description: formData.description,
        estimated_Value: formData.estimatedValue,
        type: formData.itemType,
        image: formData.image,
      }
      
      console.log(formDataToSend);
   
      const response = await fetch("/api/items", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formDataToSend),
      });
        
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        navigate('/userdashboard');
      } else {
        console.error('Adding item failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error while adding item:', error);
    }
  };

  return (
    <div>
      <h2>Add Item</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="resizable-textarea"
          ></textarea>
        </label>
        <br />
        <label>
          Estimated Value:
          <input
            type="text"
            name="estimatedValue"
            value={formData.estimatedValue}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Item Type:
          <select
            name="itemType"
            value={formData.itemType}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Select an item type</option>
            {["Electronics", "Home and Furniture", "Clothing and Accessories", "Books and Media", "Collectables and Memorabilia", "Toys and Hobbies", "Sports and Outdoor Equipment", "Tools and DIY Equipment", "Health and Fitness", "Vehicles and Parts", "Arts and Crafts", "Musical Instruments", "Services", "Tickets and Events", "Pets and Pet Supplies", "Miscellaneous"].map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Image:
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            required
            placeholder="enter image url"
          />
        </label>
        <br />
        <button type="submit">Add Item</button>
      </form>
    </div>
  );
};

export default AddItem;
