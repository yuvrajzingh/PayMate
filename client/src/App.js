import "./App.css";
import logo from "./payMateLogo.png";
import { Layout, Button } from "antd"; //designing library
import CurrentBalance from "./componets/CurrentBalance";
import RequestAndPay from "./componets/RequestAndPay";
import AccountDetails from "./componets/AccountDetails";
import RecentActivity from "./componets/RecentActivity";
import { useConnect, useAccount, useDisconnect } from "wagmi"; //used to connect our MetaMask wallet to our app
import { MetaMaskConnector } from "wagmi/connectors/metaMask"
import axios from "axios";
import { useEffect, useState } from "react";

const { Header, Content } = Layout;

function App() { 

  const [name, setName] = useState("...");
  const [balance, setBalance] = useState("...");
  const [dollars, setDollars] = useState("...");
  const [history, setHistory] = useState(null);
  const [requests, setRequests] = useState({"1": [0], "0": [] });


  const { address, isConnected } = useAccount(); //useAccount hook gives us a boolean of whether we are connected or not and an address
  const { disconnect } = useDisconnect(); //hook to disconnect our account from the site
  const { connect } = useConnect({ //this hook is used to pop up metaMask and connect it to our site.
    connector: new MetaMaskConnector(),
  });


  
  async function getNameAndBalance() {
    let res;
    try {
      res = await axios.get(`https://paymate-server.vercel.app/getNameAndBalance`, {
        params: { userAddress: address },
      });
    } catch (error) {
      console.error(error);
      return;
    }
  
    const response = res.data;
    console.log(response);
  
  
    if (response && response.name && response.name[1]) { // just checking if the user has a name then setting the name to the name
      setName(response.name[0]);
    }
    

    setBalance(response.balance);
    setDollars(response.dollars);
    setHistory(response.history);
    setRequests(response.requests);
  }

  useEffect(()=>{
    if(!isConnected) return;
    getNameAndBalance();
  },[isConnected]);

  function disconnectAndSetNull(){ //to set all the state variables (balance, history, ..etc) to null after user has disconnected from the site 
    disconnect();
    setName("...");
    setBalance("...");
    setBalance("...");
    setDollars("...");
    setHistory(null);
    setRequests({"1": [0], "0": [] });   
  }

  
  return (
    <div className="App">
      <Layout>
        <Header className="header">
          <div className="headerLeft">
            <img src={logo} width={200} height={200} alt="logo" className="logo" />
            {isConnected ? (
                <>
                <div
                  className="menuOption"
                  style={{ borderBottom: "1.5px solid black" }}
                >
                  Summary
                </div>
                <div className="menuOption">Activity</div>
                <div className="menuOption">{`Send & Request`}</div>
                <div className="menuOption">Wallet</div>
                <div className="menuOption">Help</div>
              </>
            ) : (
              <p>Connect your wallet to get started</p>
            )
              
            }                               
          </div>
            { isConnected ? <Button className="connectBtn" onClick={()=>{ disconnectAndSetNull()}}>Disconnect Wallet</Button>
             : <Button className="connectBtn" onClick={()=>{ connect()}}>Connect Wallet</Button>
            }
          
        </Header>
        <Content className="content">
          {isConnected && (
            <>
              <div className="firstColumn">
                <CurrentBalance dollars={dollars} />
                <RequestAndPay requests={requests} getNameAndBalance={getNameAndBalance}/> 
                {/* passing getNameAndBalance so that when a user makes a payment we get a new call to the backend and get latest transactions and remove the requests we've already paid */}
                <AccountDetails 
                  address={address}
                  name={name} 
                  balance={balance} />
              </div>  
              <div className="secondColumn">
                <RecentActivity history={history}/>
              </div>
            </>
          )}
        </Content>
      </Layout>
    </div>
  );
}

export default App;
