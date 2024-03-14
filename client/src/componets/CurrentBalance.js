import React from "react";
import { Button, Card } from "antd";

function CurrentBalance({rupees}) {
  return (
    <Card title="Current Balance" style={{ width: "100%" }}>
      <div className="h-18 text-7xl font-thin flex justify-evenly items-end text-bottom">
        <div style={{ lineHeight: "70px" }}>₹ {rupees}</div>
        <div style={{ fontSize: "20px" }}>Available</div>
      </div>
      <div className="mt-[20px] flex justify-center items-center gap-10">
        <button className="extraOption">Swap Tokens</button>
        <button className="extraOption">Bridge Tokens</button>
      </div>
    </Card>
  );
}

export default CurrentBalance;
