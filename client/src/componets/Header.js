import logo from "../payMateLogo.png";
import { useConnect, useAccount, useDisconnect } from "wagmi";
import { Button } from 'antd'
import { useState } from "react";

const Header = ({isConnected, disconnectAndSetNull, connect}) =>{

  const [isOpen, setIsOpen] = useState(false);


    return (
        <div className="shadow-xl w-full bg-white flex justify-between items-center border-solid border-b-2 border-sky-600 fixed py-3 px-4 z-10">
          <img src={logo} width={200} height={200} alt="logo" className="h-[40px]" />
          
          <div onClick={() => setIsOpen(!isOpen)} className="md:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </div>
          <div className={`fixed top-0 left-0 w-64 h-full bg-white transform transition-transform duration-200 ease-in-out font-normal md:flex text-lg md:relative md:transform-none md:w-auto ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            {isConnected ? (
              <>
                <div className="menuOption text-sky-600 border-solid border-b-2 border-sky-600 ">Summary</div>
                <div className="menuOption">Activity</div>
                <div className="menuOption">{`Send & Request`}</div>
                <div className="menuOption">Wallet</div>
                <div className="menuOption">Help</div>
              </>
            ) : (
              <p className="">Connect your wallet to get started ➡️</p>
            )}
          </div>
            { isConnected ? <Button className="bg-sky-600 text-white hover:text-white hover:bg-white" onClick={()=>{ disconnectAndSetNull()}}>Disconnect Wallet</Button>
             : <Button className="bg-sky-600 text-white hover:text-black hover:bg-white" onClick={()=>{ connect()}}>Connect Wallet</Button>
            }
          
        </div>
    );

}

export default Header;