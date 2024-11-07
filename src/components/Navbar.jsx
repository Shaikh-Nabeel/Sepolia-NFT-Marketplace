import React from "react";
import { AppKitProvider } from './WalletSetup';
import ethereum_logo from "../assets/ethereum_logo.svg";

const Navbar = () => {
    return (
        <>
            <div className="flex sticky top-0 justify-between text-center items-center text-white p-5 bg-[#012a4a] z-50" >
                <div className="flex">
                    <svg className="w-10 h-10" xmlns="http://www.w3.org/2000/svg"
                        aria-label="Ethereum" role="img"
                        viewBox="0 0 512 512"><rect
                            width="512" height="512"
                            rx="15%"
                            fill="#012a4a" /><path
                            fill="#3C3C3B" d="m256 362v107l131-185z" /><path
                            fill="#343434" d="m256 41l131 218-131 78-132-78" /><path
                            fill="#8C8C8C" d="m256 41v158l-132 60m0 25l132 78v107" /><path
                            fill="#141414" d="m256 199v138l131-78" /><path
                            fill="#393939" d="m124 259l132-60v138" /></svg>
                    <div className="text-sm md:text-3xl font-bold w-[120px] md:w-fit">Sepolia NFT Marketplace</div>
                </div>
                    <w3m-button />
            </div>
        </>
    );
}

export default Navbar;