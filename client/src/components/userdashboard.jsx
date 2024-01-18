import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import checkSession from "./checkSession";
import "./userdashboard.css"; 
import TradeCard from "./TradeCard";
import StarRating from "./StarRating";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

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
       <div className="welcome-container">
        <h2 className="welcome-message">Welcome, {user.first_name}!</h2>
      </div>

      <div className="container text-center">
        <div className="row">
          <div className="col-md-6">
            {/* Left column containing Create New Listing Button */}
            <div className="left-section text-center">
            <p style={{ fontSize: '1.5em', fontWeight: 'bold' }}>Create New Listing</p>
              <button onClick={handleAddItem}>
              <FontAwesomeIcon icon={faPlus} size="2x" />
              </button>
            </div>
    </div>
    <div className="col-md-6">
      {/* Right column containing User Rating */}
      <div className="right-section text-center">
        <h3>User Rating</h3>
        {reviews.length > 0 ? (
          <ul className="list-unstyled">
            {reviews.map((review) => (
              <li key={review.id}>
                Reviewer ID: {review.reviewer_id}, Rating: <StarRating rating={review.rating} /> Feedback: {review.text}
              </li>
            ))}
          </ul>
        ) : (
          <div className="d-flex flex-column align-items-center">
            <p>Trade your item to get a review!</p>
          </div>
        )}
      </div>
    </div>
  </div>
</div>
  
      <div>
        <h3>Posted Items</h3>
        {items.length > 0 ? (
          <div className="row">
            {items.map((item) => (
              <div className="col-md-4 mb-3 card-container" key={item.id}>
                <div className="card">
                  <img src={item.image} className="card-img-top" alt={item.name} />
                  <div className="card-body">
                    <h5 className="card-title">{item.name}</h5>
                    <p className="card-text">{item.description}</p>
                    <p className="card-text">
                      <strong>Estimated Value:</strong> {item.estimated_value} <br />
                      <strong>Item Type:</strong> {item.type}
                    </p>
                    <button className="btn btn-primary" onClick={() => handleEditItem(item.id)}>
                      Edit
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDeleteItem(item.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Add your first item today!</p>
        )}
      </div>
  
      <div>
  <h3>Trade in Progress</h3>
  {trades.length > 0 ? (
    <div className="row">
      {trades.map((trade) => (
        <div className="col-md-4 mb-3 card-container" key={trade.id}>
          <div className="card">
            <div className="card-body">
              <TradeCard trade={trade} handleDeleteTrade={handleDeleteTrade} />
            </div>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <p>No ongoing trades.</p>
  )}
</div>

  
      <div>
  <h3>New Offers</h3>
  {tradeOffers.length > 0 ? (
    <div className="row">
      {tradeOffers.map((offer) => (
        <div className="col-md-4 mb-3 card-container" key={offer.id}>
          <div className="card">
            <div className="card-body">
              {offer.status === 'Complete' ? (
                <>
                  <span><strong>Offer accepted</strong></span>
                  <TradeCard trade={offer} type={'offer'} />
                </>
              ) : offer.status === 'Incomplete' ? (
                <>
                  <span><strong>Offer rejected</strong></span>
                  <TradeCard trade={offer} type={'offer'} />
                </>
              ) : (
                <>
                  <TradeCard trade={offer} type={'offer'} />
                  <button className="accept-offer-button" onClick={() => handleAcceptOffer(offer)}>Accept Offer</button>
                  <button className="reject-offer-button" onClick={() => handleRejectOffer(offer.id)}>Reject Offer</button>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
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
