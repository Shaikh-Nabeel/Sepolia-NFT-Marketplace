import { useState, useEffect } from 'react';

const CACHE_DURATION = 2 * 60 * 60 * 1000;

function useEthToUsd() {
  const [ethToUsd, setEthToUsd] = useState(null);

  useEffect(() => {
    const fetchEthToUsd = async () => {
      try {
        // Call the Coingecko API to get the current price of ETH in USD
        const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd");
        const data = await response.json();
        const priceInUsd = data.ethereum.usd;

        // Store the price and the current timestamp
        const timestamp = new Date().getTime();
        localStorage.setItem("ethToUsd", JSON.stringify({ priceInUsd, timestamp }));
        setEthToUsd(priceInUsd);
      } catch (error) {
        console.error("Failed to fetch ETH to USD price:", error);
      }
    };

    const cachedData = JSON.parse(localStorage.getItem("ethToUsd"));
    
    // Check if data exists and hasn't expired
    if (cachedData) {
      const currentTime = new Date().getTime();
      const isCacheValid = currentTime - cachedData.timestamp < CACHE_DURATION;

      if (isCacheValid) {
        setEthToUsd(cachedData.priceInUsd);
        return;
      }
    }
    
    // Fetch new data if no valid cache is found
    fetchEthToUsd();
  }, []);

  return ethToUsd;
}

export default useEthToUsd;
