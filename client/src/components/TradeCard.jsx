import {useEffect, useState} from 'react'

const TradeCard = ({trade, handleDeleteTrade, type='trades'}) => {
    const [tradeInfo, setTradeInfo ] = useState(null)
    useEffect(()=>{
            fetch(`/api/trade/${trade.id}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Trade Info:', data);
                   setTradeInfo(data)
                })
                .catch(error => {
                    console.error('Fetch error:', error.message);
                    // Handle errors here
                });
        
    },[])


  return tradeInfo && (
    <>
        <li key={trade.id}>
          Trade ID: {trade.id}, Status: {trade.status}, 
          {tradeInfo && (tradeInfo.selected_items.map(item=>{
            return <p> Offered Item {item.name} - {item.description}</p>
          }))}
          Desired Item: {tradeInfo.trade_item.name} - {tradeInfo.trade_item.description}
          {type==='trades' && <button onClick={() => handleDeleteTrade(trade.id)}>Delete</button>}
        </li>
     </> 
  )
}

export default TradeCard
