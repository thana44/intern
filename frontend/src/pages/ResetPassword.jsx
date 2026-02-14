import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Menubar from '../components/Menubar'
import { IoArrowBack } from "react-icons/io5";
import { useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { EditOutlined, FacebookFilled, FlagOutlined, InstagramOutlined, MailFilled, PhoneFilled } from '@ant-design/icons';
import { Button, Input, message } from 'antd';
import axios from 'axios';

function ResetPassword() {

    const [profile, setProfile] = useState(null)
    const currentUser = useSelector((x) => x.user.currentUser)
    const navigate = useNavigate()

    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [err, setErr] = useState('')

    const handleResetPassword = async () => {
        setIsLoading(true)
        try {
            const result = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/auth-api/reset-password`, { oldPassword, newPassword, confirmPassword }, { withCredentials: true })
            console.log(result.data)
            message.success(result.data.message);
            setTimeout(() => {
                return navigate(`/profile/${currentUser?.id}`)
            }, 1500)
        } catch (err) {
            console.log(err)
            const { message } = err.response.data
            setErr(message)
        } finally {
            setIsLoading(false)
        }
    }

    console.log(profile, 'test profile')

    return (
        <div className='bg-gray-200 min-h-screen'>
            <Navbar />
            <div className='bg-transparent flex justify-center min-h-screen'>
                <div className='bg-transparent w-[90%] sm:w-[80%] md:w-[90%] xl:w-[80%] mt-15 flex justify-center'>
                    <div className='bg-transparent w-full sm:w-[90%] md:w-[80%] lg:w-[60%] pb-20'>
                        <div className='flex items-center justify-between'>
                            <div>
                                <h3 className='text-xl font-extrabold'>เปลี่ยนรหัสผ่าน</h3>
                            </div>
                        </div>

                        <div className='bg-white py-5 px-3 rounded-lg shadow-md mt-3'>
                            <div className='mt-3'>
                                <div className='grid gap-2'>
                                    <div>
                                        <span className='text-sm'>รหัสผ่านปัจจุบัน</span>
                                        <Input.Password onChange={(e) => setOldPassword(e.target.value)} size="large" placeholder="ป้อนรหัสผ่าน" />
                                    </div>
                                    <div className=''>
                                        <span className='text-sm'>รหัสผ่านใหม่</span>
                                        <Input.Password onChange={(e) => setNewPassword(e.target.value)} size="large" placeholder="ป้อนรหัสผ่าน" />
                                    </div>
                                    <div>
                                        <span className='text-sm'>ยืนยันรหัสผ่าน</span>
                                        <Input.Password onChange={(e) => setConfirmPassword(e.target.value)} size="large" placeholder="ป้อนรหัสผ่าน" />
                                    </div>
                                    {
                                        err && <div className='flex items-center justify-center'><span className='text-red-400'>{err}</span></div>
                                    }
                                    <div className='mt-2'>
                                        <Button onClick={handleResetPassword} className='w-full' size="large" type="primary" loading={isLoading}>ยืนยันการเปลี่ยนรหัส</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword