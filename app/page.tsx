    'use client';

    import Image from "next/image";
    import {useEffect,useState} from "react";
    import { SiSolana } from "react-icons/si";
    import {FaFileImport, FaLockOpen, FaRegCopy, FaWallet} from "react-icons/fa";
    import {generateSolanaAccount, generateWalletMnemonic} from "@/utils/web3";
    import { FiEye } from "react-icons/fi";
    import { FiEyeOff } from "react-icons/fi";
    import { IoMdAdd } from "react-icons/io";
    import { FaLock } from "react-icons/fa";
    import axios from "axios";
    import bs58 from "bs58";
    import {MdPublic} from "react-icons/md";
    import logo from "../assets/indie.png"
    import PhraseForm from "../components/PhraseFrom"
    import { FaCheck } from "react-icons/fa";
    import Head from 'next/head';

    const url = "https://solana-mainnet.g.alchemy.com/v2/XUfXOe9FHGZEkgmK_XVPP";

    export default function Home() {
        const [mnemonic, setMnemonic] = useState<string>();
        const [solana, setSolana] = useState<string[]>([]);
        const [index, setIndex] = useState<number>(0);
        const [balance,setBalance] = useState<number[]>([]);
        const [privateKey, setPrivateKey] = useState<string[]>([]);
        const [showKey, setShowKey] = useState<boolean>();
        const [accountLoading, setAccountLoading] = useState<boolean>(false);
        const [copied, setCopied] = useState(false);
        const [showPhraseForm,setShowPhraseForm] = useState<boolean>(false);

        const handleCopy = async () => {
            try {
                if(mnemonic) await navigator.clipboard.writeText(mnemonic);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        };

        const createWallet = () => {
            setMnemonic(generateWalletMnemonic());
        }

        const importRecoveryPhrase = () => {
            setIndex(0);
            setSolana([]);
            setMnemonic(undefined);
            setShowPhraseForm(true);
        }
        

        const createSolanaAccount = async () => {
            setAccountLoading(true);
            if (mnemonic) {
                const newAddress = await generateSolanaAccount(mnemonic, index);
                if (newAddress) {
                    setSolana(prev => [...prev, newAddress.publicKey.toBase58()]);
                    setPrivateKey(prev => [...prev, bs58.encode(newAddress.secretKey)]);
                    setIndex(prev => prev + 1);

                    try {
                        const response = await axios.post(
                            url,
                            {
                                id: 1,
                                jsonrpc: "2.0",
                                method: "getBalance",
                                params: [newAddress.publicKey],
                            },
                            {
                                headers: {
                                    accept: "application/json",
                                    "content-type": "application/json",
                                },
                            }
                        );
                        setBalance(prev => [...prev, response.data.result["value"]/1000000000]);
                    } catch (error:any) {
                        console.error(error.response?.data || error.message);
                    }
                }
            }
            setAccountLoading(false);
        }

        return (
            <div className="flex flex-col gap-5 min-h-screen items-center justify-start font-sans bg-zinc-800">
                { showPhraseForm && <PhraseForm value={mnemonic} setValue={setMnemonic} setShowForm={setShowPhraseForm}/>

                }
                <div className="md:max-w-[50vw] max-w-[90vw] flex flex-col gap-5 items-center pt-20">
                {
                    logo &&  <Image src={logo} alt="logo" className="w-50"></Image>
                }
                { (!mnemonic) && <button className="bg-zinc-900 text-white text-md justify-center md:min-w-100 min-w-50 p-2 rounded-full flex  gap-2 items-center font-semibold" onClick={createWallet}>
                    {!accountLoading ? (
                        <><FaWallet size={15} className="text-lime-300"/> Create Account</>
                    ) : (
                        <>
                            <div className="flex items-center justify-center">
                                <div className="w-5 h-5 border-3 border-black border-t-lime-300 rounded-full animate-spin"></div>
                            </div>
                        </>
                    )}
                </button>}
                { (!mnemonic) && <button className="bg-zinc-900 text-white text-md justify-center md:min-w-100 min-w-50 p-2 rounded-full flex  gap-2 items-center font-semibold" onClick={importRecoveryPhrase}>
                    {!accountLoading ? (
                        <><FaFileImport size={15} className="text-lime-300"/> Import Recovery Phrase</>
                    ) : (
                        <>
                            <div className="flex items-center justify-center">
                                <div className="w-5 h-5 border-3 border-black border-t-lime-300 rounded-full animate-spin"></div>
                            </div>
                        </>
                    )}
                </button>}
                { mnemonic &&
                <div className="relative bg-zinc-900 w-full shadow-inner shadow-zinc-950  p-4 rounded-xl">
                    <h1 className="text-xl font-semibold">Mnemonic</h1>
                    <p className="text-zinc-400 text-sm flex items-center my-1">{mnemonic}</p>
                    { copied ? (<FaCheck className="absolute top-4 right-4 text-gray-500 hover:text-gray-300 cursor-pointer"></FaCheck>) : (
                    <FaRegCopy onClick={()=> handleCopy()} className="absolute top-4 right-4 text-gray-500 hover:text-gray-300 cursor-pointer"/>)}
                </div>
                }
                {mnemonic && (
                    <>
                        <button className="bg-lime-300 w-full justify-center text-black  rounded-xl p-2 px-10 flex gap-2 items-center" onClick={createSolanaAccount}>
                            {!accountLoading ? (
                                <><IoMdAdd/> Create New <SiSolana/> Solana Wallet</>
                            ) : (
                                <>
                                    <div className="flex items-center justify-center">
                                        <div className="w-5 h-5 border-3 border-black border-t-lime-300 rounded-full animate-spin"></div>
                                    </div>
                                </>
                            )}
                        </button>
                        <button className="bg-zinc-900 text-white text-md justify-center w-full p-2 rounded-xl flex  gap-2 items-center font-semibold" onClick={importRecoveryPhrase}>
                             <><FaFileImport size={15} className="text-lime-300"/> Import Another Wallet</>
                        </button>
                        <div className="w-full">
                            <div className="w-full flex flex-col gap-3">
                                {solana.map((address, idx) => (
                                    <div key={idx} className="bg-zinc-900 p-4 rounded-xl shadow-inner shadow-zinc-950 ">
                                        <div className="flex flex-row gap-2 items-center ">
                                            <SiSolana className="text-purple-500"/>
                                            <p className="text-zinc-400 text-sm">Account <span className="text-white font-semibold">{idx+1}</span></p>
                                            <p className="text-lime-300 font-black text-xs">{balance.at(idx)} SOL</p>
                                        </div>

                                        <div className="flex flex-col items-start justify-between mt-2">
                                            <p className="font-bold text-xs flex gap-2 items-center"><MdPublic/> Public Key</p>
                                            <p className="text-zinc-300 break-all font-mono text-sm">
                                                {address}
                                            </p>
                                        </div>

                                        { showKey  ? (
                                        <div className="flex flex-col items-start justify-between mt-2">
                                            <p className="font-bold text-xs flex gap-2 items-center"><FaLockOpen/> Private Key</p>
                                            <p className="text-red-500 break-all font-mono text-sm">
                                                {privateKey.at(idx)}
                                            </p>
                                        </div>
                                        ) : (
                                            <div className="flex flex-col items-start justify-between mt-2">
                                                <p className="font-bold text-xs flex gap-2 items-center"><FaLock/> Private Key</p>
                                                <p className="text-zinc-500 break-all font-mono text-sm">
                                                    {"X".repeat(privateKey.at(idx)?.length || 32)}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            <div className="fixed bottom-4 p-4 text-black rounded-full right-4 bg-lime-300 border-zinc-900">
                { showKey  ? (<FiEyeOff size={20} onClick={()=>setShowKey(false)}/>):
                (<FiEye size={20} onClick={()=>setShowKey(true)}/>)}
            </div>
                </div>
            </div>
        );
    }
