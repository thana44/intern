import { FacebookFilled, InstagramOutlined, MailFilled, PhoneFilled } from '@ant-design/icons'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

function DetailProfile({ profileId, detailKey }) {

    const [profile, setProfile] = useState(null)

    const getProfile = async () => {
        try {
            await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user-api/get-profile/${profileId}`)
                .then((res) => {
                    setProfile(res.data.profile[0])
                })
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getProfile()
    }, [detailKey])

    return (
        <div>
            <div className='bg-white py-5 px-3 rounded-lg shadow-md mt-3'>
                <div className='flex gap-3'>
                    <img className='w-20 h-20 object-cover rounded-full' src={profile?.profileImg} />
                    <div className='bg-transparent w-full'>
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-1'>
                                <h3 className='font-bold text-sm'>ชื่อผู้ใช้ :</h3>
                                <span className='text-sm'>@{profile?.username}</span>
                            </div>

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
        </div>
    )
}

export default DetailProfile