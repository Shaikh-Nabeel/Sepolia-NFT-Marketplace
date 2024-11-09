import React, { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IoOpenOutline } from "react-icons/io5";
import { useAppKitAccount } from '@reown/appkit/react';
import { useWriteContract, useWaitForTransactionReceipt, useConfig, useConnect, useAccount } from 'wagmi';
import { ThreeDot } from "react-loading-indicators";
import { ethers } from "ethers";
import { sepolia } from "viem/chains";


const NFTModal = ({ nft, price, tokenId, contractAddress, owner, abi, isOpen, onClose }) => {
    if (!isOpen) return null;
    const { isConnected } = useAppKitAccount();
    const [hash, setHash] = useState(null);
    const [isPending, setIsPending] = useState(null);

    const notify = () => toast.success(
        "Copied to clipboard",
        {
            position: "bottom-right",
            autoClose: 1500,
            hideProgressBar: true,
            closeOnClick: true,
        }
    );

    const { writeContractAsync, isError } = useWriteContract()

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
        console.log(contractAddress, tokenId);
        setIsPending(true);
        try {
            const data = await writeContractAsync({
                chainId: sepolia.id,
                address: contractAddress,
                abi: abi,
                functionName: 'buyNFT',
                args: [BigInt(tokenId)],
                value: price,
            })
            console.log("helllooooo  " + data);
            toast.success('NFT bought successfully. Click to view', {
                position: 'bottom-right',
                autoClose: 10000,
                hideProgressBar: false,
                onClick: function () {
                    window.open("https://sepolia.etherscan.io/tx/" + data, '_blank');
                }
            });
            setHash(data);
            setIsPending(null);
        } catch (error) {
            console.error(error);
            setIsPending(null);
        }
    }

    // const { isError, isSuccess, isLoading: isConfirming } = useWaitForTransactionReceipt({
    //     hash: hash,  // Use txHash from state
    // });

    // // Toast notifications based on transaction status
    // if (isConfirming) {
    //     toast.loading('Processing transaction..', {
    //         position: 'bottom-right',
    //         autoClose: 3000,
    //     });
    // }

    // if(isPending !== null && isPending == false){
    //     console.log('Transaction ', error);
    // }

    // if (isError) {
    //     toast.error('Failed to purchase NFT. Please try again.', {
    //         position: 'bottom-right',
    //         autoClose: 3000,
    //         hideProgressBar: true,
    //         closeOnClick: true,
    //     });
    // } else if (isSuccess) {
    //     toast.success('NFT purchased successfully!', {
    //         position: 'bottom-right',
    //         autoClose: 3000,
    //         hideProgressBar: true,
    //         closeOnClick: true,
    //     });
    //     onClose(); // Close modal or perform any additional actions after success
    // }


    return (


        <div className="fixed inset-0 flex items-center justify-center bg-slate-600 bg-opacity-50 backdrop-blur-sm z-50">
            <div className="bg-slate-800 w-[90%] max-w-lg md:max-w-2xl rounded-xl shadow-lg p-5 relative mx-2">

                <RxCross1 className="absolute top-4 right-4 text-white hover:text-gray-100 cursor-pointer" onClick={onClose} />
                <div className="flex flex-col md:flex-row w-full">

                    {/* NFT Image */}
                    <div className="w-full md:w-72 mb-4 md:mb-0 md:mr-4">
                        <img
                            src={nft.image}
                            alt="NFT"
                            className="w-full h-auto md:h-full rounded-lg object-cover"
                        />
                    </div>

                    {/* NFT Details */}
                    <div className="flex-1 text-left">
                        <h2 className="text-2xl md:text-3xl font-semibold text-white mb-2">{nft.name}</h2>
                        <p className="text-white text-sm md:text-base mb-5">{nft.description}</p>

                        {/* NFT Metadata */}
                        <div className="text-white font-semibold space-y-3 text-sm md:text-base">

                            {/* Owner */}
                            <div className="flex flex-row justify-between items-center">
                                <span className="mr-2">Owner:</span>
                                <span
                                    title="Copy"
                                    onClick={() => handleCopy(owner)}
                                    className="hover:bg-slate-800 cursor-pointer text-blue-500 font-normal border rounded-lg px-2 py-1 bg-slate-700 md:mt-0"
                                >
                                    {owner.substring(0, 5)}...{owner.substring(owner.length - 5)}
                                </span>
                            </div>

                            {/* Contract Address */}
                            <div className="flex flex-row justify-between items-center">
                                <span className="mr-2">Contract Address:</span>
                                <span
                                    title="Copy"
                                    onClick={() => handleCopy(contractAddress)}
                                    className="hover:bg-slate-800 cursor-pointer text-blue-500 font-normal border rounded-lg px-2 py-1 bg-slate-700 md:mt-0"
                                >
                                    {contractAddress.substring(0, 5)}...{contractAddress.substring(contractAddress.length - 5)}
                                </span>
                            </div>

                            {/* Token ID */}
                            <div className="flex flex-row justify-between items-center">
                                <span className="mr-2">Token Id:</span>
                                <span
                                    title="Copy"
                                    onClick={() => handleCopy(tokenId)}
                                    className="hover:bg-slate-800 cursor-pointer text-blue-500 font-normal border rounded-lg px-2 py-1 bg-slate-700 md:mt-0"
                                >
                                    {String(tokenId)}
                                </span>
                            </div>

                            {/* Chain and Token Standard */}
                            <div className="flex justify-between items-center md:mt-2">
                                <span className="mr-2">Chain:</span>
                                <span className="font-normal">Sepolia</span>
                            </div>
                            <div className="flex justify-between items-center md:mt-2">
                                <span className="mr-2">Token Standard:</span>
                                <span className="font-normal">ERC-721</span>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col md:flex-row justify-start items-stretch mt-4 space-y-2 md:space-y-0 md:space-x-2">
                                {/* <button
                                    className="w-full md:w-auto px-6 py-3 bg-slate-900 text-white font-semibold rounded-md hover:bg-slate-950 transition"
                                    onClick={() => handleCopy(nft)}
                                >
                                    Copy Metadata
                                </button>
                                <button
                                    className="w-full md:w-auto flex items-center justify-center px-6 py-3 bg-slate-900 text-white font-semibold rounded-md hover:bg-slate-950 transition"
                                    onClick={openLinkInNewTab}
                                >
                                    Explorer <IoOpenOutline className="ml-1" />
                                </button> */}
                                <div className="flex w-full md:w-auto space-x-2">
                                    <button
                                        className="flex-1 px-6 py-3 bg-slate-900 text-white font-semibold rounded-md hover:bg-slate-950 transition"
                                        onClick={() => handleCopy(nft)}
                                    >
                                        Copy Metadata
                                    </button>
                                    <button
                                        className="flex-1 flex items-center justify-center px-6 py-3 bg-slate-900 text-white font-semibold rounded-md hover:bg-slate-950 transition"
                                        onClick={openLinkInNewTab}
                                    >
                                        Explorer <IoOpenOutline className="ml-1" />
                                    </button>
                                </div>
                                {(!isPending && !hash && !nft.isSold) && (
                                    <button
                                        className="w-full md:w-auto px-6 py-3 bg-green-700 text-white font-semibold rounded-md hover:bg-green-800 transition"
                                        onClick={() => handleBuy()}
                                    >
                                        Buy
                                    </button>
                                )}
                                {((hash && !isPending) || nft.isSold) && (
                                    <button
                                        className="w-full md:w-auto px-6 py-3 bg-red-700 text-white font-semibold rounded-md transition"
                                    >
                                        SOLD
                                    </button>
                                )}
                                {(isPending) && (
                                    <div className="w-full md:w-auto px-6 py-3 bg-slate-800 text-white font-semibold rounded-md transition">
                                        <ThreeDot color="#2A6F97" size="small" />
                                    </div>
                                )}
                            </div>
                        </div>
                        <ToastContainer />
                    </div>
                </div>
            </div>
        </div>

    );
};

export default NFTModal;
