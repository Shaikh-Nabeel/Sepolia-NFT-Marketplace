import { useEffect, useState } from "react";
import { ThreeDot } from "react-loading-indicators";
import { useReadContract } from 'wagmi'
import { ethers } from 'ethers';
import useEthToUsd from "../Helper/EthToUsd";
import NFTModal from "./NFTDetail";

const LoadImage = ({ tokenId, price, owner, isSold, abi, contractAddress }) => {

    const [isLoadingDone, setLoadingDone] = useState(false);
    const pinataApiKey = "dNts5G2asM-zFZp7lr0RDIe0KhogiVbHbn4KuPrgb8OUVWkZ1A0S0r5ktk9rSuq5";
    const [nftObj, setNftObj] = useState({});
    const formatPrice = ethers.formatEther(price).slice(0, 7);
    const usdPrice = (useEthToUsd() * formatPrice).toFixed(2);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data: NFT, error } = useReadContract({
        abi: abi,
        address: contractAddress,
        functionName: 'tokenURI',
        args: [tokenId],
    });

    useEffect(() => {
        if (NFT != null) {
            var infuraURL = NFT.replace("https://ipfs.io", "https://infura-ipfs.io");
            console.log(infuraURL);
            console.log(pinataApiKey);
            infuraURL = "https://pink-dear-beetle-544.mypinata.cloud/ipfs/QmebJrUK2n7y3swdrLJxTTPy3WgryEhgXC1t8TDFBqSvRi?pinataGatewayToken="+pinataApiKey;
            fetch(`${infuraURL}`, {
                method: 'GET',
            })
                .then((response) => {
                    if (!response.ok) {
                        console.log(response);
                        setLoadingDone(true);
                        return;
                    }
                    console.log(response);
                    return response.json();
                })
                .then((data) => {
                    console.log( "responsee:::::: " + data);
                    const image = data.image + "?pinataGatewayToken="+ pinataApiKey;
                    const name = data.name;
                    const description = data.description;
                    setNftObj({ image, name, description });
                    setLoadingDone(true);
                })
                .catch((error) => {
                    console.error("Fetch error:", error);
                });
        }
    }, [NFT]);

    if (!isLoadingDone) {
        return (
            <div className="w-64 h-64 overflow-hidden flex border-2 bg-[#012a4a] border-[#122d41] shadow-sm m-4 rounded-lg items-center justify-center animate-pulse">
                <ThreeDot color="#2A6F97" size="medium" text="" textColor="" /> </div>
        );
    }
    if (error || Object.keys(nftObj).length === 0) return <div className="w-64 h-64 overflow-hidden flex-col border-2 border-[#012A4A] shadow-sm m-4 rounded-lg"> <ThreeDot color="#2A6F97" size="medium" text="" textColor="" /> </div>;

    return (
        <>
            <NFTModal
                nft={nftObj}
                price={price}
                tokenId={tokenId}
                contractAddress={contractAddress}
                owner={owner}
                abi={abi}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
            <div className="w-64 h-fit overflow-hidden flex-col border-2 border-[#012A4A] shadow-md m-4 rounded-lg transform transition duration-300 hover:scale-105 hover:shadow-lg">
                <img src={nftObj.image} alt="NFT Image" className="w-full h-full object-cover" />

                {isSold && (
                    <div className="absolute inset-0 flex justify-center items-center">
                        <span className="text-red-500 text-[24px] font-bold transform rotate-[-45deg] opacity-70 border-2 border-red-500 px-4 py-1">
                            SOLD
                        </span>
                    </div>
                )}
                <p className="text-[15px] font-semibold text-white m-2"> {nftObj.name} </p>
                <p className="text-[10px] font-semibold text-white m-2 truncate whitespace-nowrap overflow-hidden"> {nftObj.description} </p>
                <div className="flex justify-between items-center text-center text-[15px] font-semibold text-white m-2">
                    
                    <div className="relative group" onClick={() => { setIsModalOpen(true) }}>
                        <div className="border-2 border-slate-800 p-2 rounded-xl transition-all duration-300 ease-in-out hover:bg-green-500 cursor-pointer">
                            <span className="block">{formatPrice} ETH</span>
                            <span className="absolute opacity-0 group-hover:opacity-100 inset-0 bg-green-500 text-white flex justify-center items-center rounded-xl transform translate-y-full transition-transform duration-300 ease-in-out group-hover:translate-y-0">
                                Buy
                            </span>
                        </div>
                    </div>

                    <div>
                        {usdPrice} USD
                    </div>
                </div>
            </div>
        </>
    );
}


export default LoadImage;