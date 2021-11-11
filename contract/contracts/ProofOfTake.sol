// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract ProofOfTake {
    // Seed for random number generation
    uint256 private seed;

    constructor() payable {
        seed = (block.timestamp + block.difficulty) % 100;
    }

    // Take object
    struct Take {
        bytes text;
        uint256 timestamp;
        address takeAddr;
    }

    // Array of address that submit a take
    address[] internal addresses;

    uint256 totalTakes;

    // Map each address to the number of takes it's submitted
    mapping(address => uint256) takeIdx;

    // Map each address to an index of it's takes
    mapping(address => mapping(uint256 => Take)) takes;

    // Map each address to the last time they submitted a take
    mapping(address => uint256) public lastTake;

    event CreateTake(
        address indexed sender,
        string take,
        uint256 indexed timestamp
    );

    event WinPrize(
        address indexed winner,
        uint256 indexed timestamp,
        uint256 amount
    );

    // Create a take
    function create(string calldata _take) public {
        // Ensure 15 minutes have passed since they last submitted a Take
        require(
            lastTake[msg.sender] + 30 seconds < block.timestamp,
            "Please wait!"
        );

        // Max take length of 280
        require(
            bytes(_take).length <= 280
        );

        // Update current timestamp
        lastTake[msg.sender] = block.timestamp;

        // Convert take to bytes
        bytes memory b_take = bytes(_take);

        // Get the current index
        uint256 currentIdx = takeIdx[msg.sender];

        // Add the take
        takes[msg.sender][currentIdx] = Take({
            text: b_take,
            timestamp: block.timestamp,
            takeAddr: msg.sender
        });

        // If first take submitted, add address
        if (takeIdx[msg.sender] == 0) {
            addresses.push(msg.sender);
        }

        // Update count of takes
        totalTakes += 1;
        takeIdx[msg.sender] += 1;

        emit CreateTake(msg.sender, _take, block.timestamp);

        /*
            PRIZE COMPONENT
        */
        // Generate random number for next user that sends a wave as a seed
        seed = (block.difficulty + block.timestamp + seed) % 100;

        if (seed <= 50) {
            uint256 prizeAmount = 0.00001 ether;
            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw more than this contract has"
            );

            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw eth from contract");

            emit WinPrize(msg.sender, block.timestamp, prizeAmount);
        }
    }

    // Get a User's single take using index
    function getTake(uint256 _idx)
        public
        view
        returns (
            string memory,
            uint256,
            address
        )
    {
        return (
            string(takes[msg.sender][_idx].text),
            takes[msg.sender][_idx].timestamp,
            takes[msg.sender][_idx].takeAddr
        );
    }

    // Get a User's last take (as an index number, to pass to getTake)
    function getLastTakeIndex() public view returns (uint256) {
        if (takeIdx[msg.sender] >= 0) {
            return takeIdx[msg.sender] - 1;
        }
        return 0;
    }

    // Get last take (as an index) by address
    function getLastTakeIndexByAddr(address _addr)
        public
        view
        returns (uint256)
    {
        return takeIdx[_addr] - 1;
    }

    // Get a take by address and index
    function getTakeByAddr(address _addr, uint256 _idx)
        public
        view
        returns (
            string memory,
            uint256,
            address
        )
    {
        return (
            string(takes[_addr][_idx].text),
            takes[_addr][_idx].timestamp,
            takes[_addr][_idx].takeAddr
        );
    }

    function getTotalTakes() public view returns (uint256) {
        return totalTakes;
    }
}
