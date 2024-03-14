import React, { useState, useEffect } from "react";
import { SwapOutlined } from "@ant-design/icons";
import { Modal, Input, InputNumber } from "antd";
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from "wagmi";
import { polygonMumbai } from "@wagmi/chains"; //so we know we are interacting with the correct smart contract in the blockchain
import ABI from "../abi.json"; // to interact with the smart contract

function RequestAndPay({requests, getNameAndBalance}) {
  const [payModal, setPayModal] = useState(false);
  const [requestModal, setRequestModal] = useState(false);
  const [requestAmount, setRequestAmount] = useState(5);
  const [requestAddress, setRequestAddress] = useState("");
  const [requestMessage, setRequestMessage] = useState("");

  console.log(polygonMumbai.id)
  const { config } = usePrepareContractWrite({
    chainId: polygonMumbai.id,
    address: "0x634fb013eCB5dF92d00e617f1f87B10fAa21B9E5",
    abi: ABI,
    functionName: "payRequest",
    args: [0],  // to always pay the first request in our list
    overrides: {
      value: String(Number(requests["1"][0] * 1e18)), //get the payable amount
    },   
  });

  const { write, data } = useContractWrite(config);


  const { config: configRequest } = usePrepareContractWrite({
    chainId: polygonMumbai.id,
    address: "0x634fb013eCB5dF92d00e617f1f87B10fAa21B9E5",
    abi: ABI,
    functionName: "createRequest",
    args: [requestAddress, requestAmount, requestMessage],
  });

  const { write: writeRequest, data: dataRequest }  = useContractWrite(configRequest);

  const { isSuccess: isSuccessPay } = useWaitForTransaction({ 
    hash: data?.hash,
  })

  const { isSuccess: isSuccessRequests } = useWaitForTransaction({
    hash: dataRequest?.hash,
  })

  const showPayModal = () => {
    setPayModal(true);
  };

  const hidePayModal = () => {
    setPayModal(false);
  };

  const showRequestModal = () => {
    setRequestModal(true);
  };
  const hideRequestModal = () => {
    setRequestModal(false);
  };

  //every time the isSuccess state changes we're gonna get our getNameAndBalance function run
  
  useEffect(()=>{
    // if(isSuccessRequests || isSuccessPay){
      getNameAndBalance();
    // }
    console.log(isSuccessRequests + " in")
    console.log(isSuccessPay + " out")
  }, [isSuccessRequests, isSuccessPay])

  return (
    <>
      <Modal
        title="Confirm Payment"
        open={payModal}
        onOk={() => {
          hidePayModal();
          write?.();
        }}
        onCancel={hidePayModal}
        okText="Proceed To Pay"
        cancelText="Cancel"
      >
          {requests && requests["0"].length > 0 && (
            <>
              <h2 className="font-bold text-xl">Sending payment to - {requests["3"][0] === '' ? '...' : requests["3"][0]} </h2>
              <p className="py-2 italic">"{requests["2"][0]}"</p>
              <h3 className=" font-semibold text-lg">Value: {requests["1"][0]} MATIC</h3>
            </>
          )}
      </Modal>
      <Modal
        title="Request A Payment"
        open={requestModal}
        onOk={() => {
          hideRequestModal();
          writeRequest?.();
        }}
        onCancel={hideRequestModal}
        okText="Proceed To Request"
        cancelText="Cancel"
      >
        <p>Amount (Matic)</p>
        <InputNumber value={requestAmount} onChange={(val)=>setRequestAmount(val)}/>
        <p>From (address)</p>
        <Input placeholder="0x..." required={true} value={requestAddress} onChange={(val)=>setRequestAddress(val.target.value)}/>
        <p>Message</p>
        <Input placeholder="Lunch Bill..." value={requestMessage} onChange={(val)=>setRequestMessage(val.target.value)}/>
      </Modal>
      <div className="w-full h-40 flex justify-center items-center gap-10">
        <div
          className="quickOption"
          onClick={() => {
            showPayModal();
          }}
        >
          {/* <DollarOutlined style={{ fontSize: "26px" }} /> */}
          <p className="text-2xl">₹</p>
          Pay
            {requests && requests["0"].length > 0 && (
              <div className="absolute top-[-22px] right-[-8px] bg-red-500 h-6 w-6 rounded-full text-white font-bold flex justify-center items-center">{requests["0"].length}</div>
            )}
        </div>
        <div
          className="quickOption "
          onClick={() => {
            showRequestModal();
          }}
        >
          <SwapOutlined style={{ fontSize: "26px" }} />
          Request
        </div>
      </div>
    </>
  );
}

export default RequestAndPay;
