
export type Nft = {
    tokenId: number;
    owner: string;
    attributeList: string[];
    name: string;
    description: string;
    image: string;
} | null

export type Item = {
    id: number;
    name: string;
    description: string;
    image: string;
    tokenId: number;
    creator: string;
    seller: string;
    owner: string;
    price: string;
    attributesList: string[];
    isAuction: boolean;
    createdAt: number;
    expiresAt: number;
} | null

export type Bid = {
    id: number,
    bidder: string,
    bidAmt: string,
    timestamp: number,
    marketItemId: number,
    revoke: boolean,
    accept: boolean
} | null;

export type UserType = {
    name: string,
    userName: string,
    description: string,
    profileImg: string,
    backImg: string,
    createdAt: number,
    userId: number,
    isUserCreate: boolean,
    userAddress: string
} | null
