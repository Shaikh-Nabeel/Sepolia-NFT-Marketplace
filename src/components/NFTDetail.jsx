import React from "react";
import { RxCross1 } from "react-icons/rx";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IoOpenOutline } from "react-icons/io5";
import { useAppKitAccount } from '@reown/appkit/react';
import { useWriteContract, useWaitForTransactionReceipt, BaseError } from 'wagmi';
import { ThreeDot } from "react-loading-indicators";
import { ethers } from "ethers";


const NFTModal = ({ nft, price, tokenId, contractAddress, owner, abi, isOpen, onClose }) => {
    if (!isOpen) return null;
    const { isConnected } = useAppKitAccount();

    const notify = () => toast.success(
        "Copied to clipboard",
        {
            position: "bottom-right",
            autoClose: 1500,
            hideProgressBar: true,
            closeOnClick: true,
        }
    );

    const {
        data: hash,
        error,
        isPending,
        writeContract
    } = useWriteContract()

    const handleCopy = (text) => {
        if (typeof text === 'object' && text !== null) {
            text = JSON.stringify(text);
        }
        if (text)
            navigator.clipboard.writeText(text).then(() => {
                notify();
            });
    };

    const openLinkInNewTab = () => {
        const url = `https://sepolia.etherscan.io/nft/${contractAddress}/${tokenId}`;
        window.open(url, '_blank'); // '_blank' opens the URL in a new tab
    };

    const handleBuy = async () => {
        if (!isConnected) {
            toast.error('Please connect to the wallet to purchase NFTs.', {
                position: 'bottom-right',
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
            });
            return;
        }
        // if(network !== "sepolia"){
        //     toast.error('This marketplace only supports Sepolia testnet.', {
        //         position: 'bottom-right',
        //         autoClose: 3000,
        //         hideProgressBar: true,
        //         closeOnClick: true,
        //     });
        //     return;
        // }
        console.log(contractAddress, tokenId);
        writeContract({
            address: contractAddress,
            abi,
            functionName: 'buyNFT',
            args: [BigInt(tokenId)],
            // overrides: {
            //     value: ethers.formatEther(price), // Pass the required ether value
            //   },
        })
        console.log(error);
        console.log(hash);

    }

    const { isError, isSuccess} = useWaitForTransactionReceipt({
        hash,
    })

    if (isPending == true) {
        console.log(hash);
        toast.loading('Processing transaction..', {
            position: 'bottom-right',
            autoClose: 3000,
        });
    }
    if (isError) {
        toast.error('Failed to purchase NFT. Please try again.', {
            position: 'bottom-right',
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
        });
    } else if (isSuccess) {
        toast.success('NFT purchased successfully!', {
            position: 'bottom-right',
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
        });
        onClose();
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-600 bg-opacity-50 backdrop-blur-sm z-50">
            <div className="bg-slate-800 w-[90%] md:w-1/2 rounded-xl shadow-lg flex-row p-5 relative">

                <RxCross1 className="absolute top-4 right-4 text-white hover:text-gray-100 cursor-pointer" onClick={onClose} />
                <div className="flex w-full">
                    {/* Left Side - NFT Image */}
                    <div className="w-72 mr-4">
                        <img
                            src={nft.image}
                            alt="NFT"
                            className="w-full h-full rounded-lg object-cover"
                        />
                    </div>
                    {/* Right Side - NFT Details */}
                    <div className="flex-1 text-left">
                        <h2 className="text-3xl font-semibold text-white mb-2">{nft.name}</h2>
                        <p className="text-white mb-5">{nft.description}</p>
                        {/* <p className="text-white font-semibold mb-4">
                            <span className="mr-2"> Owner: </span> <span title="Copy" onClick={() => { handleCopy(owner) }} className="hover:bg-slate-800 cursor-pointer text-[12px] text-white font-normal border rounded-lg pl-2 pr-2 pt-1 pb-1 bg-slate-700">{owner.substring(0, 5)}...{owner.substring(owner.length - 5, owner.length)}</span>
                        </p>
                        <p className="text-white font-semibold mb-4">
                            <span className="mr-2"> Contract Address: </span> <span title="Copy" onClick={() => { handleCopy(contractAddress) }} className="hover:bg-slate-800 cursor-pointer text-[12px] text-white font-normal border rounded-lg pl-2 pr-2 pt-1 pb-1 bg-slate-700">{contractAddress.substring(0, 5)}...{contractAddress.substring(contractAddress.length - 5, contractAddress.length)}</span>
                        </p>

                        <p className="text-white font-semibold">
                            <span className="mr-2"> Token Id: </span> <span title="Copy" onClick={() => { handleCopy(tokenId) }} className="hover:bg-slate-800 cursor-pointer text-[12px] text-white font-normal border rounded-lg pl-2 pr-2 pt-1 pb-1 bg-slate-700"> {String(tokenId)} </span>
                        </p> */}
                        <div className="text-white font-semibold space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="mr-2"> Owner: </span>
                                <span
                                    title="Copy"
                                    onClick={() => handleCopy(owner)}
                                    className="hover:bg-slate-800 cursor-pointer text-[12px] text-blue-500 font-normal border rounded-lg px-2 py-1 bg-slate-700"
                                >
                                    {owner.substring(0, 5)}...{owner.substring(owner.length - 5)}
                                </span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="mr-2"> Contract Address: </span>
                                <span
                                    title="Copy"
                                    onClick={() => handleCopy(contractAddress)}
                                    className="hover:bg-slate-800 cursor-pointer text-[12px] text-blue-500 font-normal border rounded-lg px-2 py-1 bg-slate-700"
                                >
                                    {contractAddress.substring(0, 5)}...{contractAddress.substring(contractAddress.length - 5)}
                                </span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="mr-2"> Token Id: </span>
                                <span
                                    title="Copy"
                                    onClick={() => handleCopy(tokenId)}
                                    className="hover:bg-slate-800 cursor-pointer text-[12px] text-blue-500 font-normal border rounded-lg px-2 py-1 bg-slate-700"
                                >
                                    {String(tokenId)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="mr-2"> Chain </span>
                                <span className="font-normal">
                                    Sepolia
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="mr-2"> Token Standard </span>
                                <span className="font-normal">
                                    ERC-721
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <button
                                    className="mt-4 px-6 py-3 bg-slate-900 text-white font-semibold rounded-md hover:bg-slate-950 transition"
                                    onClick={() => handleCopy(nft)}
                                >
                                    Copy Metadata
                                </button>

                                <button
                                    className="flex items-center justify-center mt-4 px-6 py-3 bg-slate-900 text-white font-semibold rounded-md hover:bg-slate-950 transition"
                                    onClick={openLinkInNewTab}
                                >
                                    Explorer <IoOpenOutline className="ml-1" />
                                </button>

                                {(!isPending && !hash) && <button
                                    className="mt-4 px-6 py-3 bg-green-700 text-white font-semibold rounded-md hover:bg-green-800 transition"
                                    onClick={() => handleBuy()}
                                >
                                    Buy
                                </button>}
                                {(hash && !isPending) && <button
                                    className="mt-4 px-6 py-3 bg-red-700 text-white font-semibold rounded-md hover:bg-green-800 transition"
                                >
                                    SOLD
                                </button>}
                                {(isPending) &&
                                    <div className="mt-4 px-6 py-3 bg-slate-800 text-white font-semibold rounded-md transition">
                                        <ThreeDot color="#2A6F97" size="small" />
                                    </div>
                                }
                            </div>
                        </div>
                        <ToastContainer />


                    </div>
                </div>
            </div>
        </div >
    ); Z
};

export default NFTModal;
