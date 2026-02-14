import axios from 'axios';
import React from 'react'
import { FiLogOut } from "react-icons/fi";
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { clearCurrentUser } from '../redux/reduxSlice/userSlice';
import { PieChartOutlined, PlusOutlined, QuestionOutlined, UserOutlined } from '@ant-design/icons';

function ProfileMenu({ username, profileImg, email, myId }) {

    const dispatch = useDispatch()
    const currentUser = useSelector((x) => x.user.currentUser)
    const navigate = useNavigate()

    const handleLogOut = async () => {
        try {
            await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth-api/log-out`, { withCredentials: true })
                .then((res) => {
                    console.log(res)
                    dispatch(clearCurrentUser(null))
                    return navigate('/login')
                })
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className='bg-white absolute w-[220px] right-0 top-8 rounded-xl border border-gray-500 p-2 z-10'>
            <div className='border border-gray-300 border-x-0 border-t-0 items-center bg-white pb-2 mb-2'>
                <div className='bg-white flex gap-2 items-center'>
                    <img className='w-8 h-8 rounded-full object-cover' src={profileImg} />
                    <div className='bg-white flex flex-col min-w-0 flex-1'>
                        <h3 className='font-bold text-sm truncate line-clamp-1'>{username}</h3>
                        <h3 className='text-sm text-gray-500 truncate bg-white line-clamp-1'>{email}</h3>
                    </div>
                </div>
            </div>
            <Link to={`/profile/${myId}`}>
                <div className='flex duration-150 hover:bg-gray-200 items-center gap-3 p-2 rounded-xl hover:cursor-pointer'>
                    <UserOutlined className='text-md' />
                    <span className='text-sm'>ตั้งค่าโปรไฟล์</span>
                </div>
            </Link>
            {
                currentUser && currentUser?.role !== 'ADMIN' &&
                <Link to={'/create'}>
                    <div className='flex duration-150 hover:bg-gray-200 items-center gap-3 p-2 rounded-xl hover:cursor-pointer'>
                        <PlusOutlined className='text-md' />
                        <span className='text-sm'>เพิ่มสถานที่ฝึกสหกิจ</span>
                    </div>
                </Link>
            }
            <Link to={'/show-question'}>
                <div className='flex duration-150 hover:bg-gray-200 items-center gap-3 p-2 rounded-xl hover:cursor-pointer'>
                    <QuestionOutlined className='text-md' />
                    <span className='text-sm'>คำถาม</span>
                </div>
            </Link>
            <div className='border border-gray-300 border-x-0 border-b-0 items-center bg-white pt-2 mt-2'>
                {
                    currentUser && currentUser?.role === 'ADMIN' &&
                    <Link to={'/admin'}>
                        <div className='flex duration-150 hover:bg-gray-200 items-center gap-3 p-2 rounded-xl hover:cursor-pointer'>
                            <PieChartOutlined className='text-md' />
                            <span className='text-sm'>แดชบอร์ด</span>
                        </div>
                    </Link>
                }
                <div onClick={handleLogOut} className='flex duration-150 hover:bg-gray-200 items-center gap-3 p-2 rounded-xl hover:cursor-pointer'>
                    <FiLogOut className='text-md' />
                    <span className='text-sm'>ออกจากระบบ</span>
                </div>
            </div>
        </div>
    )
}

export default ProfileMenu