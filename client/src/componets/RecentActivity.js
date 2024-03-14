import React from "react";
import { Card, Table } from "antd";
import img from "../no-history.png"

const columns = [
  {
    title: "Payment Subjet",
    dataIndex: "subject",
    key: "subject",
  },
  {
    title: "Type",
    dataIndex: "type",
    render: (_, record) => (
      <div
        style={record.type === "-" ? { color: "red" } : { color: "green" }}
      >
        {record.type === "-" ? "Sent" : "Received"}
      </div>
    ),
    key: "type",
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },

  {
    title: "Message",
    dataIndex: "message",
    key: "message",
  },
  {
    title: "Amount",
    key: "amount",
    render: (_, record) => (
      <div
        style={record.type === "-" ? { color: "red" } : { color: "green" }}
      >
        {record.type === "-" ? "-" : "+"}
        {record.amount} Matic
      </div>
    ),
  },
];

function RecentActivity({history}) {

  // console.log(history)

  return (
    <Card title="Recent Activity" style={{ width: "100%", minHeight: "663px" }}>
      {history ?
        <Table
          dataSource={history}
          columns={columns}
          pagination={{ position: ["bottomCenter"], pageSize: 8 }}
        /> 
        :
      <div className="py-28 flex flex-col items-center justify-center">
        <img src={img} width={100} alt=""  />
        <p className="pt-2">WoW, such empty!</p>
        <p className="pt-2">Please Wait...</p>
      </div>
    }
    </Card>
  );
}

export default RecentActivity;
