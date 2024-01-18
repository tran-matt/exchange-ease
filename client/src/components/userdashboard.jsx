import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import checkSession from "./checkSession";
import "./userdashboard.css"; 
import TradeCard from "./TradeCard";
import StarRating from "./StarRating";

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [trades, setTrades] = useState([]);
  const [tradeOffers, setTradeOffers] = useState([]);
  const [acceptedOfferIds, setAcceptedOfferIds] = useState([]);
  const [rejectedOfferIds, setRejectedOfferIds] = useState([]);

 
  useEffect(() => {
    checkSession()
      .then((data) => setUser(data))
      .catch((error) => {
        console.error("Error checking session:", error);
        // Handle the error or redirect to login if needed
      });
  }, []); 

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        try {
          const [itemsResponse, reviewsResponse, tradesResponse, tradeOffersResponse] = await Promise.all([
            fetch(`/api/items/user`),
            fetch(`/api/reviews/user`),
            fetch(`/api/trades/user`),
            fetch(`/api/trades/user/offers/${user.id}`),
          ]);
  
          if (itemsResponse.ok) {
            const itemsData = await itemsResponse.json();
            setItems(itemsData);
          } else {
            console.error("Failed to fetch user items:", itemsResponse.status);
          }
  
          // Handle reviews response
          if (reviewsResponse.ok) {
            const reviewsData = await reviewsResponse.json();
            setReviews(reviewsData);
          } else {
            console.error("Failed to fetch user reviews:", reviewsResponse.status);
          }
  
          // Handle trades response
          if (tradesResponse.ok) {
            const tradesData = await tradesResponse.json();
            setTrades(tradesData);
          } else {
            console.error("Failed to fetch user trades:", tradesResponse.status);
          }
  
          // Handle trade offers response
          if (tradeOffersResponse.ok) {
            const tradeOffersData = await tradeOffersResponse.json();
            setTradeOffers(tradeOffersData);
          } else {
            console.error("Failed to fetch user trade offers:", tradeOffersResponse.status);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
  
      // Call the fetchUserData function
      fetchUserData();
    }
  }, [user]);

  const navigate = useNavigate();

  const handleAddItem = () => {
    // Redirect to the page where the user can add a new item
    navigate("/additem");
  };

  const handleEditItem = (itemId) => {
    // Redirect to the page where the user can edit the selected item
    navigate(`/edititem/${itemId}`);
  };

  const handleDeleteItem = async (itemId) => {
    try {
      // Send a request to delete the selected item
      const response = await fetch(`api/items/${itemId}`, {
        method: "DELETE",
        credentials: "include", // Include credentials for session
      });
  
      if (response.ok) {
        // Remove the deleted item from the state
        setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
      } else {
        console.error("Failed to delete item:", response.status);
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleDeleteTrade = async (tradeId) => {
    try {
      const response = await fetch(`/api/trades/${tradeId}`, {
        method: 'DELETE',
        credentials: 'include', // Include credentials for session
      });
  
      if (response.ok) {
        // Remove the deleted trade from the state
        setTrades((prevTrades) => prevTrades.filter((trade) => trade.id !== tradeId));
      } else {
        console.error('Failed to delete trade:', response.status);
      }
    } catch (error) {
      console.error('Error deleting trade:', error);
    }
  };

  const handleAcceptOffer = async (offer) => {
    console.log(offer.id)
    const offerId = offer.id
    try {
      const response = await fetch(`/api/trades/accept/${offerId}`, {
        method: 'PATCH',
        credentials: 'include',
      });
  
      if (response.ok) {
        // Update the status of the accepted trade offer
        setAcceptedOfferIds((prevAcceptedOfferIds) => [...prevAcceptedOfferIds, offerId]);
  
        // Redirect to the addreview page with trade details
        navigate(`/addreview/${offer.initiator_id}`);
      } else {
        console.error('Failed to accept offer:', response.status);
      }
    } catch (error) {
      console.error('Error accepting offer:', error);
    }
  };
  
  const handleRejectOffer = async (offerId) => {
    try {
      const response = await fetch(`/api/trades/reject/${offerId}`, {
        method: 'PATCH',
        credentials: 'include',
      });
  
      if (response.ok) {
        // Update the status of the rejected trade offer
        setRejectedOfferIds((prevRejectedOfferIds) => [...prevRejectedOfferIds, offerId]);
      } else {
        console.error('Failed to reject offer:', response.status);
      }
    } catch (error) {
      console.error('Error rejecting offer:', error);
    }
  };

  return user ? (
    <div>
      <h2>Welcome, {user.first_name}!</h2>
  
      <div className="dashboard-header">
        <div className="left-section">
          <button onClick={handleAddItem}>Create New Listing</button>
        </div>
        <div className="right-section">
          <h3>User Rating</h3>
          {reviews.length > 0 ? (
            <ul>
              {reviews.map((review) => (
                <li key={review.id}>
                  Rating: <StarRating rating={review.rating} /> Feedback: {review.text}
                </li>
              ))}
            </ul>
          ) : (
            <p>Trade your item to get a review!</p>
          )}
        </div>
      </div>
  
      <div>
        <h3>Posted Items</h3>
        {items.length > 0 ? (
          <ul>
            {items.map((item) => (
              <li key={item.id}>
                <strong>Name:</strong> {item.name} <br />
                <strong>Description:</strong> {item.description} <br />
                <strong>Estimated Value:</strong> {item.estimated_value} <br />
                <strong>Item Type:</strong> {item.type} <br />
                <strong>Image:</strong> <img src={item.image} alt={item.name} /> <br />
                <button onClick={() => handleEditItem(item.id)}>Edit</button>
                <button onClick={() => handleDeleteItem(item.id)}>Delete</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Add your first item today!</p>
        )}
      </div>
  
      <div>
        <h3>Trade in Progress</h3>
        {trades.length > 0 ? (
          <ul>
            {trades.map((trade) => (
              <TradeCard key={trade.id} trade={trade} handleDeleteTrade={handleDeleteTrade} />
            ))}
          </ul>
        ) : (
          <p>No ongoing trades.</p>
        )}
      </div>
  
      <div>
  <h3>New Offers</h3>
  {tradeOffers.length > 0 ? (
    <ul>
      {tradeOffers.map((offer) => (
        <div key={offer.id}>
          {offer.status === 'Complete' ? (
            <>
              <span>Offer accepted</span>
              <TradeCard key={offer.id} trade={offer} type={'offer'} />
            </>
          ) : offer.status === 'Incomplete' ? (
            <>
              <span>Offer rejected</span>
              <TradeCard key={offer.id} trade={offer} type={'offer'} />
            </>
          ) : (
            <>
              <TradeCard key={offer.id} trade={offer} type={'offer'} />
              <button className="accept-offer-button" onClick={() => handleAcceptOffer(offer)}>Accept Offer</button>
              <button className="reject-offer-button" onClick={() => handleRejectOffer(offer.id)}>Reject Offer</button>
            </>
          )}
        </div>
      ))}
    </ul>
  ) : (
    <p>No trade offers received.</p>
  )}
</div>
    </div>
  ) : (
    navigate("/login")
  );
  
};

export default UserDashboard;
