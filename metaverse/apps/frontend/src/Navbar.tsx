import React, { useState } from 'react'
import { IoIosAddCircle } from "react-icons/io";
import { RxHamburgerMenu, RxCross2 } from "react-icons/rx";
import logo from './assets/logo.png'

// pending : getting avatar and username and show it to user
const Navbar = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="bg-secondary">
            <div className="p-3 flex justify-between items-center h-16">
                <div className="flex items-center">
                    <img src={logo} width={40} height={40} alt="Logo" className='bg-secondary' />
                    <p className="text-md text-white font-semibold">Townnect</p>
                </div>

                <div className="hidden sm:flex gap-6 items-center">
                    {isLogin ? (
                        <div className="flex gap-6">
                            <div className="text-white flex gap-2 items-center pl-4 pr-4 rounded-lg hover:bg-primary hover:text-secondary">
                                <img
                                    className="rounded-full"
                                    src="https://pbs.twimg.com/profile_images/1354193582660456457/a_PW3K0v_400x400.jpg"
                                    alt="Profile"
                                    width={30}
                                    height={30}
                                />
                                <div className="font-semibold">Profile</div>
                            </div>

                            {/* Create Space */}
                            <div className="flex gap-2 items-center">
                                <IoIosAddCircle className="relative left-10 text-black" />
                                <button className="font-semibold border-none p-2 pr-2 rounded-md pl-10 bg-primary text-[#1c2573]">
                                    Create Space
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex gap-4">
                            <button className="font-semibold border-none pr-6 pl-6 rounded-lg bg-green-400 text-black">
                                Get Started
                            </button>
                            <button className="font-semibold border-none p-2 pr-4 pl-4 rounded-md bg-[#CBDCEB] text-[#1c2573]">
                                Sign In
                            </button>
                        </div>
                    )}
                </div>

                {/* Mobile Menu */}
                <div className="sm:hidden block">
                    <div onClick={() => setIsExpanded(!isExpanded)} className="cursor-pointer">
                        {isExpanded ? <RxCross2 size={30} /> : <RxHamburgerMenu size={30} />}
                    </div>

                    {isExpanded && (
                        <div className="absolute top-20 right-1 bg-white shadow-lg p-4 flex flex-col gap-4 z-10 w-full">
                            {isLogin ? (
                                <>
                                    <div className="flex gap-2 items-center p-2 pl-4 pr-4 rounded-lg hover:bg-[#CBDCEB] transition-all">
                                        <img
                                            className="rounded-full"
                                            src="https://pbs.twimg.com/profile_images/1354193582660456457/a_PW3K0v_400x400.jpg"
                                            alt="Profile"
                                            width={30}
                                            height={30}
                                        />
                                        <div className="font-semibold text-black">Profile</div>
                                    </div>
                                    <button className="font-semibold p-2 pr-2 rounded-md bg-[#CBDCEB] text-secondary transition-all">
                                        Create Space
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button className="font-semibold border-none p-2 pr-6 pl-6 rounded-lg bg-green-400 text-black">
                                        Get Started
                                    </button>
                                    <button className="font-semibold border-none p-2 pr-4 pl-4 rounded-md bg-slate-200 text-[#1c2573]">
                                        Sign In
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
