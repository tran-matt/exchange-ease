import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditItem = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState({
    name: "",
    description: "",
    estimatedValue: 0,
    type: "",
    image: "",
  });

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const response = await fetch(`/api/items/${itemId}`);
        if (response.ok) {
          const itemData = await response.json();
          setItem(itemData);
        } else {
          console.error("Failed to fetch item details:", response.status);
        }
      } catch (error) {
        console.error("Error fetching item details:", error);
      }
    };

    fetchItemDetails();
  }, [itemId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setItem((prevItem) => ({ ...prevItem, [name]: value }));
  };

  const handleEditItem = async () => {
    try {
      const response = await fetch(`/api/items/${itemId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: item.name,
          description: item.description,
          estimated_value: item.estimatedValue,
          type: item.type,
          image: item.image,
        }),
      });

      if (response.ok) {
        console.log("Item updated successfully");
        // Redirect to user dashboard
        navigate("/userdashboard");
      } else {
        console.error("Failed to edit item:", response.status);
      }
    } catch (error) {
      console.error("Error editing item:", error);
    }
  };

  return (
    <div>
      <h2>Edit Item</h2>
      <label>
        Name:
        <input type="text" name="name" value={item.name} onChange={handleInputChange} />
      </label>
      <br />
      <label>
        Description:
        <textarea name="description" value={item.description} onChange={handleInputChange} />
      </label>
      <br />
      <label>
        Estimated Value:
        <input type="text" name="estimatedValue" value={item.estimatedValue} onChange={handleInputChange} />
      </label>
      <br />
      <label>
        Type:
        <select name="type" value={item.type} onChange={handleInputChange}>
          <option value="" disabled>Select an item type</option>
          {[
            "Electronics",
            "Home and Furniture",
            "Clothing and Accessories",
            "Books and Media",
            "Collectables and Memorabilia",
            "Toys and Hobbies",
            "Sports and Outdoor Equipment",
            "Tools and DIY Equipment",
            "Health and Fitness",
            "Vehicles and Parts",
            "Arts and Crafts",
            "Musical Instruments",
            "Services",
            "Tickets and Events",
            "Pets and Pet Supplies",
            "Miscellaneous",
          ].map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>
      <br />
      <label>
        Image:
        <input type="text" name="image" value={item.image} onChange={handleInputChange} />
      </label>
      <br />
      <button onClick={handleEditItem}>Save Changes</button>
    </div>
  );
};

export default EditItem;
