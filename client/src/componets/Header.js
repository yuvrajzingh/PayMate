import React from 'react'


const Header = () => {
  return (
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
    )
}

export default Header


