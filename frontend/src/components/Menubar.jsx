import React from 'react'
import { FaPlus } from "react-icons/fa6";
import { IoNotificationsOutline } from "react-icons/io5";
import { IoBookmarksOutline } from "react-icons/io5";
import { IoHelp } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";
import { LuSunMedium } from "react-icons/lu";
import { HiOutlineHome } from "react-icons/hi2";
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Menubar() {
    const navigate = useNavigate()
    const currentUser = useSelector((x) => x.user.currentUser)

    return (
        <div className='bg-gray-50 h-screen flex flex-col justify-between pb-20'>
            <div className='bg-gray-50 pl-8 pt-5 pr-2 grid gap-5'>
                <Link to={'/'}>
                    <div className='grid grid-cols-[.2fr_.8fr] rounded-xl p-3 pl-2 hover:bg-[#DADADA] duration-150'>
                        <div className='flex items-center'><HiOutlineHome className='text-2xl font-bold' /></div>
                        <div><span>Home</span></div>
                    </div>
                </Link>
                {
                    !currentUser ?
                        <Link to={'/login'}>
                            <div className='grid grid-cols-[.2fr_.8fr] rounded-xl p-3 pl-2 hover:bg-[#DADADA] duration-150'>
                                <div className='flex items-center'><FaPlus className='bg-green-400 rounded-md p-1 text-2xl' /></div>
                                <div><span>Create</span></div>
                            </div>
                        </Link>
                        :
                        <Link to={'/create'}>
                            <div className='grid grid-cols-[.2fr_.8fr] rounded-xl p-3 pl-2 hover:bg-[#DADADA] duration-150'>
                                <div className='flex items-center'><FaPlus className='bg-green-400 rounded-md p-1 text-2xl' /></div>
                                <div><span>Create</span></div>
                            </div>
                        </Link>
                }
                <div className='grid grid-cols-[.2fr_.8fr] rounded-xl p-3 pl-2 hover:bg-[#DADADA] duration-150'>
                    <div className='flex items-center'><IoNotificationsOutline className='text-2xl font-bold' /></div>
                    <div><span>Notification</span></div>
                </div>
                <div className='grid grid-cols-[.2fr_.8fr] rounded-xl p-3 pl-2 hover:bg-[#DADADA] duration-150'>
                    <div className='flex items-center'><IoBookmarksOutline className='text-xl font-bold' /></div>
                    <div><span>Saved</span></div>
                </div>
                <div className='grid grid-cols-[.2fr_.8fr] rounded-xl p-3 pl-2 hover:bg-[#DADADA] duration-150'>
                    <div className='flex items-center'><IoHelp className='text-2xl font-bold' /></div>
                    <div><span>Help</span></div>
                </div>
                <div className='grid grid-cols-[.2fr_.8fr] rounded-xl p-3 pl-2 hover:bg-[#DADADA] duration-150'>
                    <div className='flex items-center'><IoSettingsOutline className='text-xl font-bold' /></div>
                    <div><span>Setting</span></div>
                </div>
            </div>
            <div className='bg-gray-50 pl-10'>
                <div className='flex items-center gap-5'>
                    <div className='rounded-xl p-2 hover:bg-[#DADADA] duration-150'>
                        <LuSunMedium className='text-2xl font-bold' />
                    </div>
                    <span>Light Mode</span>
                </div>
            </div>
        </div>
    )
}

export default Menubar