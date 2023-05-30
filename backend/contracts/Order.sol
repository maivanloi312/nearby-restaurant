pragma solidity ^0.8.0;

contract Order{

    Customer[] public customers;

    struct Customer{
        string id;
        address addressCus;
    }

    event sendData(address _addressCus, string _id);

    function CreateOrder(string memory _id) public {
        Customer memory cus=Customer(_id, msg.sender);
        customers.push(cus);
        emit sendData(msg.sender,_id);
    }
}