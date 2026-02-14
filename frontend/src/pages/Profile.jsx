import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Menubar from '../components/Menubar'
import { IoArrowBack } from "react-icons/io5";
import { useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { EditOutlined, FacebookFilled, FlagOutlined, InstagramOutlined, MailFilled, PhoneFilled } from '@ant-design/icons';
import { Button, message, Modal } from 'antd';
import axios from 'axios';
import TextArea from 'antd/es/input/TextArea';

function Profile() {

    const { profileId } = useParams()
    const [profile, setProfile] = useState(null)
    const currentUser = useSelector((x) => x.user.currentUser)
    const [modalOpen, setModalOpen] = useState(false)
    const [detail, setDetail] = useState('')
    const navigate = useNavigate()

    const getProfile = async () => {
        try {
            await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user-api/get-profile/${profileId}`)
                .then((res) => {
                    setProfile(res.data.profile[0])
                })
        } catch (err) {
            console.log(err)
            return navigate('/')
        }
    }

    useEffect(() => {
        getProfile()
    }, [])

    console.log(profile, 'test profile')

    const [isLoading, setIsLoading] = useState(false)

    const handleReportUser = async () => {
        setIsLoading(true)
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user-api/report-user/${profileId}`, { detail }, { withCredentials: true })
                .then((res) => {
                    console.log(res.data)
                    setDetail('')
                    setModalOpen(false)
                })
        } catch (err) {
            console.log(err)
            message.error(err.response.data.message)
        } finally {
            setIsLoading(false)
        }
    }

    const openModal = () => {
        setDetail('')
        setModalOpen(true)
    }

    return (
        <div className='bg-gray-200 min-h-screen'>
            <Navbar />
            <div className='bg-transparent flex justify-center min-h-screen'>
                <div className='bg-transparent w-[90%] sm:w-[80%] md:w-[90%] xl:w-[80%] mt-15 flex justify-center'>
                    <div className='bg-transparent w-full sm:w-[90%] md:w-[80%] lg:w-[60%] pb-20'>
                        <div className='flex items-center justify-between'>
                            <div>
                                {
                                    currentUser?.id === profileId ?
                                        <h3 className='text-xl font-extrabold'>โปรไฟล์ของฉัน</h3>
                                        :
                                        <h3 className='text-xl font-extrabold'>{`โปรไฟล์ของ ${profile?.username}`}</h3>
                                }
                            </div>
                            {
                                currentUser?.id === profileId &&
                                <Link to={`/edit-profile/${currentUser?.id}`}>
                                    <div className='flex items-center gap-2 duration-200 hover:opacity-60 hover:cursor-pointer'>
                                        <EditOutlined style={{ color: 'gray' }} className='text-xl' />
                                        <span className='text-sm text-gray-500'>แก้ไขข้อมูล</span>
                                    </div>
                                </Link>
                            }
                        </div>
                        <div className='bg-white py-5 px-3 rounded-lg shadow-md mt-3'>
                            <div className='flex gap-3'>
                                <img className='w-20 h-20 object-cover rounded-full' src={profile?.profileImg} />
                                <div className='bg-transparent w-full'>
                                    <div className='flex items-center justify-between'>
                                        <div className='flex items-center gap-1'>
                                            <h3 className='font-bold text-sm'>ชื่อผู้ใช้ :</h3>
                                            <span className='text-sm'>@{profile?.username}</span>
                                        </div>
                                        {
                                            currentUser && currentUser?.id !== profileId &&
                                            <div onClick={openModal} className='duration-200 hover:opacity-60 hover:cursor-pointer'>
                                                <FlagOutlined />
                                            </div>
                                        }
                                        {
                                            !currentUser &&
                                            <div onClick={() => navigate('/login')} className='duration-200 hover:opacity-60 hover:cursor-pointer'>
                                                <FlagOutlined />
                                            </div>
                                        }
                                        <Modal
                                            title="รายงานบัญชีนี้"
                                            centered
                                            open={modalOpen}
                                            closable={{ 'aria-label': 'Custom Close Button' }}
                                            footer={null}
                                            onCancel={() => setModalOpen(false)}
                                        >
                                            <div>
                                                <div className='my-5'>
                                                    <TextArea
                                                        value={detail}
                                                        showCount
                                                        maxLength={100}
                                                        onChange={(e) => setDetail(e.target.value)}
                                                        placeholder="ระบุสาเหตุ"
                                                        style={{ height: 120, resize: 'none' }}
                                                    />
                                                </div>
                                                <div className='flex justify-center'>
                                                    <Button loading={isLoading} color="danger" variant="solid" danger size='large' onClick={handleReportUser}>
                                                        รายงาน
                                                    </Button>
                                                </div>
                                            </div>
                                        </Modal>
                                    </div>
                                    <div className='flex items-center gap-1'>
                                        <h3 className='font-bold text-sm'>ชื่อ :</h3>
                                        <span className='text-sm'>{profile?.firstName ? profile?.firstName : 'ไม่มี'}</span>
                                    </div>
                                    <div className='flex items-center gap-1'>
                                        <h3 className='font-bold text-sm'>นามสกุล :</h3>
                                        <span className='text-sm'>{profile?.lastName ? profile?.lastName : 'ไม่มี'}</span>
                                    </div>
                                </div>
                            </div>
                            <div className='border border-gray-300 border-x-0 border-b-0 mt-5'>
                                <p className='text-sm'>{profile?.aboutMe ? profile?.aboutMe : 'ไม่มี'}</p>
                            </div>
                        </div>
                        <div className='bg-white py-5 px-3 rounded-lg shadow-md mt-3'>
                            <div>
                                <h3 className='text-md font-bold'>ข้อมูลติดต่อ</h3>
                            </div>
                            <div className='mt-3'>
                                <div className='grid gap-2'>
                                    <div className='flex items-center gap-2'>
                                        <PhoneFilled style={{ color: 'gray' }} />
                                        <h3 className='text-sm text-gray-500'>{profile?.phoneNumber ? profile?.phoneNumber : 'ไม่มี'}</h3>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <MailFilled style={{ color: 'gray' }} />
                                        <h3 className='text-sm text-gray-500'>{profile?.email}</h3>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <FacebookFilled style={{ color: '#065cd4' }} />
                                        <h3 className='text-sm text-gray-500'>{profile?.facebook ? profile?.facebook : 'ไม่มี'}</h3>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <InstagramOutlined style={{ color: 'purple' }} />
                                        <h3 className='text-sm text-gray-500'>{profile?.instagram ? profile?.instagram : 'ไม่มี'}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {
                            currentUser?.id === profileId && !currentUser?.googleId &&
                            <div className='bg-white py-5 px-3 rounded-lg shadow-md mt-3'>
                                <div className='flex items-center justify-between'>
                                    <div>
                                        <h3 className='text-md font-bold'>รหัสผ่าน</h3>
                                    </div>
                                    <div>
                                        <Button onClick={() => navigate('/reset-password')} style={{ width: 150 }} size="large" type="primary" loading={''}>เปลี่ยนรหัสผ่าน</Button>
                                    </div>
                                </div>
                            </div>
                        }
                        {
                            currentUser?.verifyAccount === 0 && currentUser?.id === profileId &&
                            <div className='bg-white py-5 px-3 rounded-lg shadow-md mt-3'>
                                <div className='flex items-center justify-between'>
                                    <div>
                                        <h3 className='text-md font-bold'>การยืนยันตัวตน</h3>
                                    </div>
                                    <div>
                                        <Button onClick={() => navigate('/verify-account-request')} color="danger" variant="solid" style={{ width: 150 }} size="large" loading={''}>ยืนยันตัวตน</Button>
                                    </div>
                                </div>
                            </div>
                        }
                        {
                            currentUser?.verifyAccount === 1 && currentUser?.id === profileId &&
                            <div className='bg-white py-5 px-3 rounded-lg shadow-md mt-3'>
                                <div className='flex items-center justify-between'>
                                    <div>
                                        <h3 className='text-md font-bold'>การยืนยันตัวตน</h3>
                                    </div>
                                    <div>
                                        <Button color="cyan" variant="solid" style={{ width: 150 }} size="large">ยืนยันตัวตนแล้ว</Button>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile