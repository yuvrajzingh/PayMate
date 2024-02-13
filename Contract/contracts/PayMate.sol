// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract PayMate{

    //Define the Owner of the smart Contract
    address public owner;

    constructor(){  //constructor is run on each deployment of the application, so essentially only ONCE.
        owner = msg.sender;
    }
// -------------------------------------------------------------------------------
    //Create Struct and Mapping for request, transaction & name
    struct request{
        address requestor; //whoever the requestor of the payment is
        uint256 amount; //the amount they are requesting
        string message; //message of what the request is for
        string name; //name of the user. This would be received by the address
    } 


    struct sendReceive{  // sending and receiving payment   
        string action; // whether you are receiving or sending payment
        uint256 amount; //the amount that was received or sent out
        string message; // the message that went along with that transaction
        address otherPartyAddress; //address of the other party involved in the transaction
        string otherPartyName; // the name if there is one added to that wallet address
    }
    

    struct userName{
        string name; // string with the name of the user
        bool hasName; // a bool of whether the user has set a name or not
    }


    //these are private mapping which are only readable by our smart contract
    mapping(address => userName) names;  // now if we call names[0x..(any wallet address)] it would give a userName struct. By default the string would be empty and the bool would be false
    mapping(address => request[]) requests;
    mapping(address => sendReceive[]) history;

    
// -------------------------------------------------------------------------------
    //Add a name to wallet address

    function addName(string memory _name) public {
        userName storage newUserName = names[msg.sender]; // we're creating a userName struct using  Storage, which means we're gonna save this to the smart contract, and we're giving it a temporary name "newUserName", and where we're storing this struct is in the names mapping for the mesaage sender
        newUserName.name = _name; // setting the that was declared as an argument to the newUserName struct
        newUserName.hasName = true;
    }


// -----------------------------------------------------------------------------------
    //Create a Request
    function createRequest(address user, uint256 _amount, string memory _message) public {
        
        request memory newRequest; // calling the request struct as newRequest 
        newRequest.requestor = msg.sender; // we set ourselve's (the function caller) as requestor, which allows the person that receives the request to send the amount in the correct address.
        newRequest.amount = _amount; // the amount that needs to be sent
        newRequest.message = _message; // message related to the payment

        if(names[msg.sender].hasName){ // to figure out if the wallet address who's sending the create request has a name
            newRequest.name = names[msg.sender].name;  
        }

        requests[user].push(newRequest); // get the request for the user we are sending the request to and push this newRequest struct to the array of requests 

    }


// ------------------------------------------------------------------------------------------
    //Pay a Request
    function payRequest (uint256 _request) public payable { // since we had a requests mapping we need to know which request in the array (index of the request) do we have to pay


        require(_request < requests[msg.sender].length, "No, Such Request"); // the require statement checks the statement and if it passes it continues with the rest of the function, but if it doesn't the fucntion is reverted with the following message. We are checking if the request is actually in the request array for the message sender.

        request[] storage myRequests = requests[msg.sender]; // creating a request array as myRequests to get the requests from the requests mapping.

        request storage payableRequest = myRequests[_request]; //then for the specific request we want, we use the request struct as payableReq., then we look into myRequest array and call the index that we are trying to pay. 

        uint256 toPay = payableRequest.amount * 1000000000000000000; // to get the actual payable amount we get the payableReq.amount and multiply it with the decimal (1 and 18 0's) which turns the weight amount into actual native currency Matic

        require(msg.value == (toPay), "Pay Correct Amount"); // another 'require' function denoting the currency you're sending with that transaction has to be the same as the toPay var  

        payable(payableRequest.requestor).transfer(msg.value); // it takes the requestor from our payable request struct  

        addHistory(msg.sender, payableRequest.requestor, payableRequest.amount, payableRequest.message );

        myRequests[_request] = myRequests[myRequests.length-1]; // get the above request we paid
        myRequests.pop(); // delete the above request


    }

    function addHistory(address sender , address receiver, uint256 _amount, string memory _message) private{
        sendReceive memory newSend;
        newSend.action = "-"; // since the user is loosing funds we've set the action to negative string
        newSend.amount  = _amount; //noting the amount transfered
        newSend.message = _message; //noting the message related to the transaction
        newSend.otherPartyAddress = receiver; //noting the receiver's address 

        if(names[receiver].hasName){ // if the receiver has a name we take that name and set it as other party name otherwise we leave that as an empty string
            newSend.otherPartyName = names[receiver].name;
        }

        history[sender].push(newSend); //we get the history mapping, get the sender address, and push the newSend struct into that mapping 

        sendReceive memory newReceive;
        newReceive.action = "+"; //since the user is gaining funds we've set the action to negative string 
        newReceive.amount = _amount; //noting the amount transfered
        newReceive.message = _message; //noting the message related to the transaction
        newReceive.otherPartyAddress = sender; //noting the sender's address

        if(names[sender].hasName){ // if the sender has a name we take that name and set it as other party name otherwise we leave that as an empty string 
            newReceive.otherPartyName = names[sender].name;
        }

        history[receiver].push(newReceive); // pushing it to the receiver's history mapping
 
    }



// ---------------------------------------------------------------------------------------------
    //Get all requests sent to a User

    function getMyRequests(address _user) public view returns(
        address[] memory, // function returns an array of addresses.
        uint256[] memory, // function returns an array of integers to be the amount.
        string[] memory, // function returns an array of string for the messages.
        string[] memory // function returns an array of string for the names.
    ){

        //we'll create a few tempp arrays to return.
        address[] memory addrs = new address[](requests[_user].length); //creating a new array and defining the length by getting from our requests mapping for the user that we've passesd in the argument, the length of our requests array which defines the length of the new array just created.
        uint256[] memory amnt = new uint256[](requests[_user].length);
        string[] memory msge = new string[](requests[_user].length);
        string[] memory nme = new string[](requests[_user].length);

        for(uint i=0; i<requests[_user].length; i++){ // looping through all the requests in the array.
            request storage myRequests = requests[_user][i]; // we get a single request 'myRequest' 
            // then we get the requestor, amount, msg, and name and push them into that index in the new arrays that we cerated.
            addrs[i] = myRequests.requestor;
            amnt[i] = myRequests.amount;
            msge[i] = myRequests.message;
            nme[i] = myRequests.name;
        }

        return (addrs, amnt, msge, nme);

    }

// --------------------------------------------------------------------------------------------
    //Get all historic transaction user has been a part of


    function getMyHistory(address _user) public view returns(sendReceive[] memory){ //just get an array of sendReceive structs for a specific user and return them
        return history[_user];
    }

    function getMyName(address _user) public view returns(userName memory){ // to get the name of the specific user
        return names[_user]; //now as the names mapping has only the userName struct and not an array of userName structs, we pass the userName struct as the return statement.
    }

}
