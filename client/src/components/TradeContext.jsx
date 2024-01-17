// TradeContext.jsx
import { createContext, useContext, useState } from 'react';

const TradeContext = createContext();

export const TradeProvider = ({ children }) => {
  const [selectedItem, setSelectedItem] = useState(null);

  const setTradeData = (data) => {
    setSelectedItem(data);
  };

  return (
    <TradeContext.Provider value={{ selectedItem, setTradeData }}>
      {children}
    </TradeContext.Provider>
  );
};

export const useTrade = () => {
  return useContext(TradeContext);
};
