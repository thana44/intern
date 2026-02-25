import React, { useState } from 'react'
import { IoBookmarkOutline, IoBookmarksOutline, IoNotificationsOutline, IoSearch } from "react-icons/io5";
import { LuUserRound } from "react-icons/lu";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { clearCurrentUser, setCurrentUser } from '../redux/reduxSlice/userSlice';
import ProfileMenu from './ProfileMenu';
import { openNotificationMenu, openProfileMenu, setNotiCount, setSaveCount } from '../redux/reduxSlice/menuSlice';
import { AutoComplete, Badge, Drawer, Input } from 'antd';
import { DownOutlined, EnvironmentOutlined, SearchOutlined } from '@ant-design/icons';
import Search from './Search';
import NotificationCard from './NotificationCard';

function Navbar() {

    const location = useLocation()
    const dispatch = useDispatch()
    const currentUser = useSelector((x) => x.user.currentUser)
    const profileMenu = useSelector((x) => x.menu.profileMenu)
    const saveCount = useSelector((x) => x.menu.saveCount)
    const notiCount = useSelector((x) => x.menu.notiCount)
    const notificationMenu = useSelector((x) => x.menu.notificationMenu)
    const navigate = useNavigate()

    const handleCurrentUser = async () => {
        try {
            await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth-api/get-current-user`, { withCredentials: true })
                .then((res) => {
                    // console.log(res.data)
                    dispatch(setCurrentUser(res.data))
                })
        } catch (err) {
            dispatch(clearCurrentUser(null))
            console.log(err)
        }
    }

    useEffect(() => {
        handleCurrentUser()
    }, [location.pathname])

    // console.log(profileMenu, 'this is profile menu')
    // console.log(notificationMenu, 'this is notification menu')

    const [open, setOpen] = useState(false)
    const [size, setSize] = useState(120)

    const onOpenProfile = () => {
        dispatch(openProfileMenu(!profileMenu))
        dispatch(openNotificationMenu(false))
    }

    const onOpenNoti = () => {
        dispatch(openNotificationMenu(!notificationMenu))
        dispatch(openProfileMenu(false))
    }

    useEffect(() => {
        dispatch(openProfileMenu(false))
        dispatch(openNotificationMenu(false))
    }, [location.pathname])

    const getSaveCount = async () => {
        try {
            const result = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/noti-api/get-save-count`, { withCredentials: true })
            dispatch(setSaveCount(result.data.result[0].saveCount))
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getSaveCount()
    }, [])

    const getNotiCount = async () => {
        try {
            const result = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/noti-api/get-noti-count`, { withCredentials: true })
            dispatch(setNotiCount(result.data.result[0].notiCount))
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getNotiCount()
    }, [location.pathname])

    // console.log(notiCount, 'notiCount')

    return (
        <div className='bg-white h-20 flex items-center justify-between px-5 md:justify-around md:px-0 shadow-md'>
            <div className='hover:cursor-pointer'>
                <Link to={'/'}>
                    <h1 className='font-bold text-2xl'>INTERN</h1>
                </Link>
            </div>
            <div className='hidden md:block'>
                <Search />
            </div>
            <div className='flex items-center gap-2'>
                <div className='block md:hidden hover:cursor-pointer'>
                    <SearchOutlined onClick={() => setOpen(true)} style={{ fontSize: '18px' }} />
                </div>
                {
                    currentUser && currentUser?.id ?
                        <div className='flex items-center justify-center' onClick={() => navigate('/save')}>
                            <Badge dot={saveCount > 0 ? true : false}>
                                <IoBookmarkOutline className='text-[20px] font-bold hover:cursor-pointer' />
                            </Badge>
                        </div>
                        :
                        <div className='flex items-center justify-center' onClick={() => navigate('/login')}>
                            <IoBookmarkOutline className='text-[20px] font-bold hover:cursor-pointer' />
                        </div>
                }
                <div onClick={onOpenNoti} className='relative'>
                    <div className='flex items-center justify-center'>
                        <Badge dot={notiCount > 0 ? true : false}>
                            <IoNotificationsOutline className='text-xl font-bold hover:cursor-pointer' />
                        </Badge>
                    </div>
                    {
                        notificationMenu && currentUser &&
                        <div onClick={(e) => e.stopPropagation()}>
                            <NotificationCard />
                        </div>
                    }
                </div>
                {
                    currentUser ?
                        <div onClick={onOpenProfile} className='bg-white relative hover:cursor-pointer'>
                            <div>
                                <img className='w-6 h-6 rounded-full object-cover' src={currentUser?.profileImg} />
                            </div>
                            {
                                profileMenu &&
                                <div>
                                    <ProfileMenu myId={currentUser?.id} profileImg={currentUser?.profileImg} username={currentUser?.username} email={currentUser?.email} />
                                </div>
                            }
                        </div>
                        :
                        <Link to={'/login'}>
                            <div className='bg-white relative'>
                                <LuUserRound className='text-xl hover:cursor-pointer' />
                            </div>
                        </Link>
                }
            </div>
            <Drawer
                title="ค้นหาสถานที่ฝึก"
                placement="top"
                height={size}
                onClose={() => setOpen(false)}
                open={open}
                resizable={{
                    onResize: newSize => setSize(newSize),
                }}
                maskStyle={{
                    backdropFilter: 'none',
                }}
                bodyStyle={{
                    overflowY: 'hidden',
                    padding: 15,
                }}
            >
                <div className='sm:flex sm:justify-center'>
                    <Search />
                </div>
            </Drawer>
        </div>
    )
}

export default Navbar