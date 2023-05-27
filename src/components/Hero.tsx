import "react-responsive-carousel/lib/styles/carousel.min.css"; 
import { Carousel } from "react-responsive-carousel";
import useMintNftModal from "../hooks/MintNftModal";
import { useNavigate } from "react-router";

const Hero = () => {  
  const MintModal  = useMintNftModal();  
  const navigate = useNavigate();

  return (
    <div
      className=" flex flex-col lg:flex-row w-4/5 justify-center space-y-10 
    items-center mx-auto py-10"
    >
      <div className="lg:w-4/6 w-full">
        <div>
          <h1 className="text-white text-5xl font-bold">
            Buy and Sell <br /> Digital Arts, <br />
            <span className="text-gradient">NFTs</span> Collections
          </h1>
          <p className="text-gray-300 font-semibold  mt-3">
            Mint and collect the hottest NFTs around.
          </p>
        </div>

        <div className="flex flex-row mt-5 cursor-pointer space-x-3">
          <button className="ClickBtn" onClick={MintModal.onOpen}>Mint NFT</button>
          <button className="ClickBtn" onClick={() => navigate(`/sellNft`)} >Sell Nft</button>
        </div>
      </div>
      <Carousel
        autoPlay
        infiniteLoop
        showStatus={false}
        showIndicators={false}
        showThumbs={false}
        interval={3000}
        className="rounded-2xl max-w-4xl mx-auto overflow-hidden"
      >
         <img className="object-contain h-full w-full rounded-2xl" src={"/slider/2.png"} />
        <img className="object-contain h-full w-full rounded-2xl" src={"/slider/3.jpeg"} />
        <img className="object-contain h-full w-full rounded-2xl" src={"/slider/4.jpg"} />
        <img className="object-contain h-full w-full rounded-2xl" src={"/slider/5.png"} />
      </Carousel>
    </div>
  );
};

export default Hero;
