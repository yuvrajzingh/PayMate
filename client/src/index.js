import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { configureChains, mainnet, WagmiConfig, createClient } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { polygonMumbai } from '@wagmi/chains';  //web3 lib that allows us to connect our wallet

const { provider, webSocketProvider } = configureChains(
  [mainnet, polygonMumbai],
  [publicProvider()]
);

const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
});


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>  
    {/* strictmode is a tool in React that helps highlight potential issues in your application during development. */}
    <WagmiConfig client={client}>
        <App />
    </WagmiConfig>
  </React.StrictMode>
);
