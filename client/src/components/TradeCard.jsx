// TradeCard.js
import React, { useEffect, useState } from 'react';

const TradeCard = ({ trade, handleDeleteTrade, type = 'trades' }) => {
  const [tradeInfo, setTradeInfo] = useState(null);

  useEffect(() => {
    const fetchTradeInfo = async () => {
      try {
        const response = await fetch(`/api/trade/${trade.id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Trade Info:', data);
        setTradeInfo(data);
      } catch (error) {
        console.error('Fetch error:', error.message);
        // Handle errors here
      }
    };

    fetchTradeInfo();
  }, [trade.id]);

  if (!tradeInfo || !tradeInfo.trade_item) {
    // Trade information or trade_item is still being fetched or is null
    return null;
  }

  const { selected_items, trade_item } = tradeInfo;

  return (
    <>
      <p><strong>Trade ID:</strong> {trade.id}</p>
      <p><strong>Status:</strong> {trade.status}</p>
      {selected_items && selected_items.length > 0 && (
        <div>
          {selected_items.map((item) => (
            <div key={item.id}>
              <p><strong>Offered Item:</strong> {item.name}</p>
              <p><strong>Item Description:</strong>{item.description}</p>
            </div>
          ))}
        </div>
      )}
      <p><strong>Desired Item:</strong> {trade_item.name}</p>
      <p><strong>Item Description:</strong> {trade_item.description}</p>
      {type === 'trades' && <button onClick={() => handleDeleteTrade(trade.id)}>Delete</button>}
    </>
  );
};

export default TradeCard;
