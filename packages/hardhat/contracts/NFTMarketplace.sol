// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol"; // Добавлено
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFTMarketplace is ERC721URIStorage { // Изменили наследование
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    struct NFTItem {
        uint256 id;
        address creator;
        string tokenURI;
        uint256 price;
        bool forSale;
    }
    
    mapping(uint256 => NFTItem) public nftItems;
    
    constructor() ERC721("NFTMarketplace", "NFTM") {}
    
    function mintNFT(string memory tokenURI, uint256 price) public payable {
        _tokenIds.increment();
        uint256 newId = _tokenIds.current();
        
        _safeMint(msg.sender, newId);
        _setTokenURI(newId, tokenURI); // Теперь работает
        
        nftItems[newId] = NFTItem(
            newId,
            msg.sender,
            tokenURI,
            price,
            true
        );
    }
    function buyNFT(uint256 tokenId) public payable {
        require(nftItems[tokenId].forSale, "NFT not for sale");
        require(msg.value >= nftItems[tokenId].price, "Insufficient funds");
        
        address seller = ownerOf(tokenId);
        _transfer(seller, msg.sender, tokenId);
        
        payable(seller).transfer(msg.value);
        nftItems[tokenId].forSale = false;
    }
    
    function listNFT(uint256 tokenId, uint256 price) public {
        require(ownerOf(tokenId) == msg.sender, "Not owner");
        nftItems[tokenId].price = price;
        nftItems[tokenId].forSale = true;
    }
}