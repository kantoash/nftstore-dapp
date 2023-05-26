// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./NFT.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NftMarketPlace is ReentrancyGuard {
    using Counters for Counters.Counter;

    Counters.Counter public _marketItemIds; //
    Counters.Counter public _tokensSold;
    Counters.Counter public _tokensCanceled;
    Counters.Counter public _bidIds;
    Counters.Counter public _users;

    address payable private immutable owner;

    // Challenge: make this price dynamic according to the current currency price
    uint256 public immutable listingFee;

    mapping(uint256 => User) users;
    mapping(uint256 => MarketItem) marketItems;
    mapping(uint256 => Bid) bids;

    struct Bid {
        uint256 bidId;
        address payable bidder;
        uint256 marketItemId;
        uint256 bidAmt;
        uint256 timestamp;
        bool revoke;
        bool accept;
    }

    struct MarketItem {
        uint256 marketItemId;
        address nftContractAddress;
        uint256 tokenId;
        address payable creator;
        address payable seller;
        address payable owner;
        uint256 price;
        uint256 createdAt;
        uint256 expiresAt;
        bool isAuction;
        bool sold;
        bool canceled;
    }

    struct User {
        uint256 userId;
        address userAddress;
        string name;
        string userName;
        string description;
        string backImg;
        string profileImg;
        uint256 createdAt;
    }

    constructor(uint _listingFee) {
        owner = payable(msg.sender);
        listingFee = _listingFee;
    }

    function createUser(
        string memory _name,
        string memory _userName,
        string memory _description,
        string memory _backImg,
        string memory _profileImg
    ) public {
        require(bytes(_name).length > 0, "title cannot be empty");
        require(bytes(_userName).length > 0, "userName cannot be empty");
        require(bytes(_description).length > 0, "description cannot be empty");
        require(bytes(_backImg).length > 0, "background cannot be empty");
        require(bytes(_profileImg).length > 0, "profile Image cannot be empty");
        _users.increment();
        uint256 userId = _users.current();
        User memory user;
        user.userId = userId;
        user.userAddress = msg.sender;
        user.name = _name;
        user.userName = _userName;
        user.description = _description;
        user.backImg = _backImg;
        user.profileImg = _profileImg;
        user.createdAt = block.timestamp;
        users[userId] = user;
    }

    function updateUser(
        uint256 userId,
        string memory _name,
        string memory _userName,
        string memory _description,
        string memory _backImg,
        string memory _profileImg
    ) public {
        require(userId > 0, "UserId is not valid");
        require(bytes(_name).length > 0, "title cannot be empty");
        require(bytes(_userName).length > 0, "userName cannot be empty");
        require(bytes(_description).length > 0, "description cannot be empty");
        require(bytes(_backImg).length > 0, "background cannot be empty");
        require(bytes(_profileImg).length > 0, "profile Image cannot be empty");
        users[userId] = User(
            userId,
            msg.sender,
            _name,
            _userName,
            _description,
            _backImg,
            _profileImg,
            block.timestamp
        );
    }

    function createMarketItem(
        address nftContractAddress,
        uint256 tokenId,
        uint256 price
    ) public payable nonReentrant {
        require(price > 0, "Price must be at least 1 wei");
        require(
            msg.value >= listingFee,
            "Price must be equal to listing price"
        );
        _marketItemIds.increment();
        uint256 marketItemId = _marketItemIds.current();

        address creator = NFT(nftContractAddress).getTokenCreatorById(tokenId);

        marketItems[marketItemId] = MarketItem(
            marketItemId,
            nftContractAddress,
            tokenId,
            payable(creator),
            payable(msg.sender),
            payable(address(0)),
            price,
            block.timestamp,
            block.timestamp,
            false,
            false,
            false
        );

        IERC721(nftContractAddress).transferFrom(
            msg.sender,
            address(this),
            tokenId
        );

        payTo(owner, msg.value);
    }

    function createMarketItemAuction(
        address nftContractAddress,
        uint256 tokenId,
        uint256 price,
        uint256 _expiresAt
    ) public payable nonReentrant {
        require(
            _expiresAt > block.timestamp,
            "expireAt cannot be less than the future"
        );
        require(price > 0, "Price must be at least 1 wei");
        require(
            msg.value >= listingFee,
            "Price must be equal to listing price"
        );

        _marketItemIds.increment();
        uint256 marketItemId = _marketItemIds.current();

        address creator = NFT(nftContractAddress).getTokenCreatorById(tokenId);

        marketItems[marketItemId] = MarketItem(
            marketItemId,
            nftContractAddress,
            tokenId,
            payable(creator),
            payable(msg.sender),
            payable(address(0)),
            price,
            block.timestamp,
            _expiresAt,
            true,
            false,
            false
        );

        IERC721(nftContractAddress).transferFrom(
            msg.sender,
            address(this),
            tokenId
        );

        payTo(owner, msg.value);
    }

    /**
     * @dev Cancel a market item
     */
    function cancelMarketItem(
        address nftContractAddress,
        uint256 marketItemId
    ) public {
        MarketItem storage marketItem = marketItems[marketItemId];

        require(marketItem.marketItemId > 0, "Market item has to exist");
        require(!marketItem.sold, "Market Item is sold");
        require(marketItem.seller == msg.sender, "You are not the seller");

        uint256 tokenId = marketItem.tokenId;

        rePayBid(marketItemId);

        IERC721(nftContractAddress).transferFrom(
            address(this),
            msg.sender,
            tokenId
        );

        marketItems[marketItemId].owner = payable(msg.sender);
        marketItems[marketItemId].canceled = true;

        _tokensCanceled.increment();
    }

    function createMarketSale(
        address nftContractAddress,
        uint256 marketItemId
    ) public payable nonReentrant {
        MarketItem storage marketItem = marketItems[marketItemId];
        uint256 tokenId = marketItem.tokenId;

        require(marketItem.marketItemId > 0, "Market item has to exist");
        require(!marketItem.canceled, "Market Item is canceled");
        require(
            msg.value >= marketItem.price,
            "Please submit the asking price"
        );

        rePayBid(marketItemId);

        marketItem.owner = payable(msg.sender);
        marketItem.sold = true;

        payTo(marketItem.seller, msg.value);

        IERC721(nftContractAddress).transferFrom(
            address(this),
            msg.sender,
            tokenId
        );

        _tokensSold.increment();
    }

    function placeBid(uint256 marketItemId) public payable nonReentrant {
        MarketItem memory marketItem = marketItems[marketItemId];
        require(marketItem.isAuction, "this is not Auction Nft");
        require(msg.value > 0 wei, "bid Amount must be at least 1 wei");
        require(
            marketItem.expiresAt > block.timestamp,
            "Nft Auction is closed"
        );
        require(marketItem.marketItemId > 0, "Market item has to exist");
        require(!marketItem.canceled, "Market Item is canceled");

        _bidIds.increment();
        uint256 currentBidId = _bidIds.current();

        Bid memory bid;

        bid.bidId = currentBidId;
        bid.bidder = payable(msg.sender);
        bid.marketItemId = marketItemId;
        bid.bidAmt = msg.value;
        bid.timestamp = block.timestamp;
        bid.revoke = false;
        bid.accept = false;

        bids[currentBidId] = bid;
    }

    function rePayBid(uint256 marketItemId) internal {
        uint256 bidsCount = _bidIds.current();

        for (uint i = 0; i < bidsCount; i++) {
            Bid storage currBid = bids[i + 1];
            if (currBid.marketItemId != marketItemId) continue;
            currBid.revoke = true;
            payTo(currBid.bidder, currBid.bidAmt);
        }
    }

    function revoke(uint256 _bidId) public payable nonReentrant {
        Bid storage tempBid = bids[_bidId];

        require(tempBid.bidId > 0, "bid doesn't exist");
        require(msg.sender == tempBid.bidder, "Only bidder can revoke");
        require(!tempBid.accept, "bid is accepted can not revoke");

        tempBid.revoke = true;

        payTo(tempBid.bidder, tempBid.bidAmt);
    }

    function bidAccept(
        address nftContractAddress,
        uint _bidId
    ) public payable nonReentrant {
        Bid storage tempBid = bids[_bidId];
        uint256 marketItemId = tempBid.marketItemId;
        MarketItem storage marketItem = marketItems[marketItemId];

        require(marketItemId > 0, "item doesn't exist");
        require(marketItem.seller == msg.sender, "Only seller");
        require(!tempBid.revoke, "Not revoke is important");

        tempBid.accept = true;
        marketItem.owner = payable(msg.sender);
        marketItem.sold = true;

        rePayBid(marketItemId);

        payTo(marketItem.seller, tempBid.bidAmt);

        // transfer nft to buyer
        IERC721(nftContractAddress).transferFrom(
            address(this),
            msg.sender,
            marketItem.tokenId
        );

        _tokensSold.increment();
    }

    function BuyAll(
        address nftContractAddress,
        uint256[] memory marketItemIds
    ) public payable nonReentrant {
        for (uint i = 0; i < marketItemIds.length; i++) {
            uint256 marketItemId = marketItemIds[i];
            MarketItem storage marketItem = marketItems[marketItemId];
            uint256 tokenId = marketItem.tokenId;
            require(!marketItem.canceled, "Market Item is canceled");
            require(
                msg.value >= marketItem.price,
                "Price must be equal to listing price"
            );
            uint256 transferAmt = msg.value - marketItem.price;

            rePayBid(marketItemId);

            marketItem.owner = payable(msg.sender);
            marketItem.sold = true;

            payTo(marketItem.seller, transferAmt);

            IERC721(nftContractAddress).transferFrom(
                address(this),
                msg.sender,
                tokenId
            );

            _tokensSold.increment();
        }
    }

    function fetchUserItem(
        address userAddress
    ) public view returns (MarketItem[] memory) {
        uint256 itemsCount = _marketItemIds.current();
        uint256 userItemsCount = 0;
        uint256 currItemIdx = 0;

        for (uint i = 0; i < itemsCount; i++) {
            MarketItem memory item = marketItems[i + 1];
            if (item.owner == userAddress || item.seller == userAddress) {
                userItemsCount += 1;
            }
        }

        MarketItem[] memory userItems = new MarketItem[](userItemsCount);
        for (uint i = 0; i < itemsCount; i++) {
            MarketItem memory item = marketItems[i + 1];
            if (item.owner == userAddress || item.seller == userAddress) {
                userItems[currItemIdx] = item;
                currItemIdx += 1;
            }
        }
        return userItems;
    }

    function fetchAvailableMarketItems()
        public
        view
        returns (MarketItem[] memory)
    {
        uint256 itemsCount = _marketItemIds.current();
        uint256 soldItemsCount = _tokensSold.current();
        uint256 canceledItemsCount = _tokensCanceled.current();
        uint256 availableItemsCount = itemsCount -
            soldItemsCount -
            canceledItemsCount;
        MarketItem[] memory availableMarketItems = new MarketItem[](
            availableItemsCount
        );

        uint256 currentIndex = 0;
        for (uint256 i = 0; i < itemsCount; i++) {
            MarketItem memory item = marketItems[i + 1];
            if (item.owner != address(0)) continue;
            availableMarketItems[currentIndex] = item;
            currentIndex += 1;
        }

        return availableMarketItems;
    }

    function fetchMarketItemBid(
        uint256 marketItemId
    ) public view returns (Bid[] memory) {
        uint256 bidCount = _bidIds.current();
        uint256 itemBidCount = 0;
        uint256 currItemIdx = 0;

        for (uint i = 0; i < bidCount; i++) {
            Bid memory currBid = bids[i + 1];
            if (currBid.marketItemId != marketItemId) continue;
            itemBidCount += 1;
        }

        Bid[] memory itemBids = new Bid[](itemBidCount);
        for (uint i = 0; i < bidCount; i++) {
            Bid memory currBid = bids[i + 1];
            if (currBid.marketItemId != marketItemId) continue;
            itemBids[currItemIdx] = currBid;
            currItemIdx += 1;
        }
        return itemBids;
    }

    function fetchUserById(
        address walletAddress
    ) public view returns (User memory) {
        uint256 userCounts = _users.current();
        User memory user;
        for (uint i = 0; i < userCounts; i++) {
            User memory currUser = users[i + 1];
            if (currUser.userAddress == walletAddress) {
                user = currUser;
            }
        }
        return user;
    }

    // get functions
    function getListingFee() public view returns (uint256) {
        return listingFee;
    }

    function getMarketItemById(
        uint256 marketItemId
    ) public view returns (MarketItem memory) {
        return marketItems[marketItemId];
    }

    function getBidById(uint256 _bidId) public view returns (Bid memory) {
        return bids[_bidId];
    }

    function getUser(uint256 _userId) public view returns (User memory) {
        return users[_userId];
    }

    function payTo(address _owner, uint _amt) internal {
        (bool send, ) = payable(_owner).call{value: _amt}("");
        require(send);
    }
}
