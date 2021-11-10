// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract ProofOfTake {
    struct Take {
        bytes text;
        uint256 timestamp;
        address takeAddr;
    }

    address[] internal addresses;
    mapping(address => uint256) takeIdx;
    mapping(address => mapping(uint256 => Take)) takes;

    event CreateTake(
        address indexed sender,
        string take,
        uint256 indexed timestamp
    );

    function create(string calldata _take) public {
        bytes memory b_take = bytes(_take);
        uint256 currentIdx = takeIdx[msg.sender];
        takes[msg.sender][currentIdx] = Take({
            text: b_take,
            timestamp: block.timestamp,
            takeAddr: msg.sender
        });

        if (takeIdx[msg.sender] == 0) {
            addresses.push(msg.sender);
        }

        takeIdx[msg.sender] += 1;

        emit CreateTake(msg.sender, _take, block.timestamp);
    }

    function getTake(uint256 _idx)
        public
        view
        returns (string memory, uint256, address)
    {
        return (
            string(takes[msg.sender][_idx].text),
            takes[msg.sender][_idx].timestamp,
            takes[msg.sender][_idx].takeAddr
        );
    }

    function getLastTakeIndex() public view returns (uint256) {
        return takeIdx[msg.sender] - 1;
    }

    function getLastTakeIndexByAddr(address _addr) public view returns (uint256) {
        return takeIdx[_addr] - 1;
    }

    function getTakeByAddr(address _addr, uint256 _idx)
        public
        view
        returns (string memory, uint256, address)
    {
        return (
            string(takes[_addr][_idx].text),
            takes[_addr][_idx].timestamp,
            takes[_addr][_idx].takeAddr
        );
    }
}
