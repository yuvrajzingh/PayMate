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
  const [rupees, setRupees] = useState("...");
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
      res = await axios.get(`https://paymate-server-tu1z.onrender.com/getNameAndBalance`, {
        params: { userAddress: address },
      });
    } catch (error) {
      console.error(error);
      return;
    }
  
    const response = res.data;
    console.log(response.requests);

    if (response && response.name && response.name[1]) { // just checking if the user has a name then setting the name to the name
      setName(response.name[0]);
    }   

    setBalance(response.balance);
    setRupees(response.rupees);
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
    setRupees("...");
    setHistory(null);
    setRequests({"1": [0], "0": [] });   
  }

  
  return (
    <div className="">
        <Header className="shadow-xl bg-white flex justify-between items-center border-solid border-b-2 border-sky-600 ">
          <img src={logo} width={200} height={200} alt="logo" className="h-[40px]" />
          <div className="flex justify-between items-center font-medium italic text-lg">
            
            {isConnected ? (
                <>
                <div className="menuOption text-sky-600 border-2 border-b-sky-600 ">Summary</div>
                <div className="menuOption">Activity</div>
                <div className="menuOption">{`Send & Request`}</div>
                <div className="menuOption">Wallet</div>
                <div className="menuOption">Help</div>
              </>
            ) : (
              <p className="">Connect your wallet to get started ➡️</p>
            )
              
            }                               
          </div>
            { isConnected ? <Button className="bg-sky-600 text-white hover:text-white hover:bg-white" onClick={()=>{ disconnectAndSetNull()}}>Disconnect Wallet</Button>
             : <Button className="bg-sky-600 text-white hover:text-black hover:bg-white" onClick={()=>{ connect()}}>Connect Wallet</Button>
            }
          
        </Header>
        <Content className="flex justify-center min-h-[100vh] bg-gradient-radial bg-cover bg-no-repeat bg-center">
          {isConnected && (
            <div className="mt-20 flex justify-center gap-20">
              <div className="firstColumn w-[500px] min-h-[200px]">
                <CurrentBalance rupees={rupees} />
                <RequestAndPay requests={requests} getNameAndBalance={getNameAndBalance}/> 
                {/* passing getNameAndBalance so that when a user makes a payment we get a new call to the backend and get latest transactions and remove the requests we've already paid */}
                <AccountDetails 
                  address={address}
                  name={name} 
                  balance={balance} />
              </div>  
              <div className="secondColumn w-[800px] min-h-[200px]">
                <RecentActivity history={history}/>
              </div>
            </div>
          )}
        </Content>
    </div>
  );
}

export default App;
