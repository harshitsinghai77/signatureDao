//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract OneMillionSignatureDao is Ownable, ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    uint256 public availableSize;
    uint256 public maxSize;
    uint256 public bossNFTId;
    struct Signature {
        uint256 size;
        string data; // ipfs hash
        address owner;
    }
    mapping(address => uint256) public addressToSignature;
    mapping(address => bool) public eligibleMembers;
    Signature[] public signatures;
    uint256 public pricePerUnit;
    uint256 public xPricePerUnit;
    uint16[] public customSignatureUnits;

    event NewNFTMinted(address sender, uint256 tokenId);
    event NFTModified(uint256 itemId, string ipfsUri);

    constructor(
        uint256 unitPrice,
        uint256 xUnitPrice,
        uint256 initialMaxSize,
        uint16[] memory customUnits
    ) ERC721("1 Million Signatures", "SIG") {
        require(customUnits.length == 3, "Custom price array requires length 3");
        for (uint256 i = 0; i < customUnits.length; i++) {
            customSignatureUnits.push(customUnits[i]);
        }
        
        maxSize = initialMaxSize;
        availableSize = maxSize;
        pricePerUnit = unitPrice;
        xPricePerUnit = xUnitPrice;
        signatures.push(Signature(1000, "1 Million NFT DAO", msg.sender));
    }

    // Only for emergency
    function addElegibleMembers(address[] memory eligibleAddresses)
        public
        onlyOwner
    {
        for (uint256 i = 0; i < eligibleAddresses.length; i++) {
            eligibleMembers[eligibleAddresses[i]] = true;
        }
    }

    // Only for emergency
    function removeElegibleMembers(address[] memory eligibleAddresses)
        public
        onlyOwner
    {
        for (uint256 i = 0; i < eligibleAddresses.length; i++) {
            eligibleMembers[eligibleAddresses[i]] = false;
        }
    }

    function changePrice(uint256 newXPricePerUnit, uint256 newPricePerUnit) public onlyOwner {
        xPricePerUnit = newXPricePerUnit;
        pricePerUnit = newPricePerUnit;
    }

    function changeCustomUnits(uint16[] memory newCustomUnits) public onlyOwner {
        require(newCustomUnits.length == 3, "Custom price array requires length 3");
        for (uint256 i = 0; i < newCustomUnits.length; i++) {
            customSignatureUnits[i] = newCustomUnits[i];
        }
    }

    function getSignatures() public view returns (Signature[] memory) {
        return signatures;
    }

    function getCustomSignatureUnits() public view returns(uint16[] memory){
        return customSignatureUnits;
    }

    function getSignature(address addr) public view returns (Signature memory) {
        require(addressToSignature[addr] != 0, "No signature found");
        return signatures[addressToSignature[addr]];
    }

    function checkElegibleMember(address addr) public view returns (bool) {
        return eligibleMembers[addr];
    }

    function _mintBossNFT(string memory ipfsUri) public onlyOwner {
        bossNFTId = makeAnEpicNFT(ipfsUri);
    }

    function _modifyBossNFT(string memory ipfsUri) public onlyOwner {
        modifyAnEpicNFT(bossNFTId, ipfsUri);
    }

    function modifyAnEpicNFT(uint256 itemId, string memory ipfsUri) internal {
        _setTokenURI(itemId, ipfsUri);
        emit NFTModified(itemId, ipfsUri);
    }

    function mintSignature(
        uint256 size,
        string memory sigText,
        string memory ipfsUri
    ) public payable {
        require(size > 0, "Size cannot be zero");
        require(
            size >= bytes(sigText).length,
            "Size must be >= signature length"
        );
        require(addressToSignature[msg.sender] == 0, "Already Minted");
        require(availableSize - size >= 0, "No more NFTs available");

        if (checkElegibleMember(msg.sender)) {
            require(
                size * pricePerUnit <= msg.value,
                "Incorrect amount for elegible member"
            );
        } else {
            require(
                size * xPricePerUnit <= msg.value,
                "Incorrect amount for non-elegible member"
            );
        }

        Signature memory signature = Signature(size, ipfsUri, msg.sender);
        signatures.push(signature);
        addressToSignature[msg.sender] = signatures.length - 1;
        availableSize -= size;
        makeAnEpicNFT(ipfsUri);
    }

    function makeAnEpicNFT(string memory ipfsUri) internal returns (uint256) {
        // Get the current tokenId, this starts at 0.
        uint256 newItemId = _tokenIds.current();

        // Actually mint the NFT to the sender using msg.sender.
        _safeMint(msg.sender, newItemId);
        // Set the NFTs data
        _setTokenURI(newItemId, ipfsUri);

        // Increment the counter for when the next NFT is minted.
        _tokenIds.increment();
        emit NewNFTMinted(msg.sender, newItemId);
        return newItemId;
    }

    function withdraw(address payable _to, uint256 amount)
        public
        payable
        onlyOwner
    {
        require(amount > 0, "Amount must be greater than 0");
        require(address(this).balance >= amount, "Not enough balance");
        _to.transfer(amount);
    }
}
