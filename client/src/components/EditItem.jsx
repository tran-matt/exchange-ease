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
        body: JSON.stringify(item),
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
        <input type="number" name="estimatedValue" value={item.estimatedValue} onChange={handleInputChange} />
      </label>
      <br />
      <label>
        Type:
        <input type="text" name="type" value={item.type} onChange={handleInputChange} />
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
