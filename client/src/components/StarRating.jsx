// StarRating.js
import React from 'react';
import PropTypes from 'prop-types';

const StarRating = ({ rating }) => {
  const roundedRating = Math.round(rating);

  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={i < roundedRating ? 'star-filled' : 'star-empty'}>
          ★
        </span>
      );
    }
    return stars;
  };

  return <div className="star-rating">{renderStars()}</div>;
};

StarRating.propTypes = {
  rating: PropTypes.number.isRequired,
};

export default StarRating;
