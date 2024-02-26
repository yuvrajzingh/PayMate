import React from "react";
import { Card } from "antd";
import { UserOutlined } from "@ant-design/icons";
import matic from "../matic.png";
import { Layout, Button } from "antd";


function AccountDetails({address, name, balance}) {
  
  return (
    <Card title="Account Details" style={{ width: "100%" }}>
      <div className="flex justify-start items-center w-full h-[70px] ml-[25px] gap-8">
        <UserOutlined style={{ color: "#767676", fontSize: "25px" }} />
        <div>
          <div className="font-bold text-2xl text-[#4f4f4f]"> {name} </div>
          <div className="accountDetailBody text-[#767676] text-lg">
            {" "}
            Address: {address.slice(0, 4)}...{address.slice(-4)}
          </div>
        </div>
      </div>
      <div className="flex justify-start items-center w-full h-[70px] ml-[25px] gap-8">
        <img src={matic} alt="maticLogo" width={25} />
        <div>
          <div className="font-bold text-xl text-[#4f4f4f]"> Native Matic Tokens</div>
          <div className="text-[#767676] text-xl">{balance} Matic</div>
        </div>
      </div>
      <div className="balanceOptions flex mt-[20px] justify-center items-center gap-5">
        <div className="extraOption">Set Username</div>
          <Button className="extraOption">Switch Accounts</Button>
      </div>
    </Card>
  );
}

export default AccountDetails;
