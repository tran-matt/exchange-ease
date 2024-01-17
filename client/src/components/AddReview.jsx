import React, { useState } from "react";
import { useNavigate, useParams} from "react-router-dom";

const AddReview = () => {

  let {userId} = useParams();
  console.log(userId);

  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(1);
  const navigate = useNavigate();
  

  const handleReviewSubmit = async () => {
    try {
     
  
      // Post request to submit review
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          text: reviewText,
          rating: reviewRating,
          reviewed_user_id: userId,
        }),
      });
  
      if (response.ok) {
        // Redirect to the user dashboard after submission
        navigate("/userdashboard");
      } else {
        console.error("Failed to submit review:", response.status);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  return (
    <div>
      <h2>Add Review</h2>
      <label>
        Review Text:
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
        />
      </label>
      <label>
        Rating:
        <select
          value={reviewRating}
          onChange={(e) => setReviewRating(Number(e.target.value))}
        >
          {[1, 2, 3, 4, 5].map((rating) => (
            <option key={rating} value={rating}>
              {rating}
            </option>
          ))}
        </select>
      </label>
      <button onClick={handleReviewSubmit}>Submit Review</button>
    </div>
  );
};

export default AddReview;
