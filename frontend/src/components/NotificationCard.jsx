import { CheckCircleOutlined, CloseCircleOutlined, CloseOutlined, InfoCircleOutlined, IssuesCloseOutlined } from '@ant-design/icons'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setNotiCount } from '../redux/reduxSlice/menuSlice'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Bangkok')
function NotificationCard() {

    const currentUser = useSelector((x) => x.user.currentUser)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [noti, setNoti] = useState([])
    const getNotification = async () => {
        try {
            const result = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/noti-api/get-notification`, { withCredentials: true })
            // console.log(result.data, 'notification')
            setNoti(result.data.result)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getNotification()
    }, [])

    // console.log(noti, 'noti data')

    const getNotiCount = async () => {
        try {
            const result = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/noti-api/get-noti-count`, { withCredentials: true })
            dispatch(setNotiCount(result.data.result[0].notiCount))
        } catch (err) {
            console.log(err)
        }
    }

    const delNotification = async (id) => {
        try {
            const result = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/noti-api/del-notification/${id}`, { withCredentials: true })
            console.log(result.data)
            getNotiCount()
            getNotification()
        } catch (err) {
            console.log(err)
        }
    }

    const clearNotification = async () => {
        try {
            const result = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/noti-api/clear-all-noti`, { withCredentials: true })
            console.log(result.data)
            getNotiCount()
            getNotification()
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className='bg-white absolute w-[250px] max-h-[300px] overflow-y-scroll no-scrollbar right-0 top-8 rounded-xl border border-gray-500 p-2 z-10'>
            <div className='bg-white flex justify-between'>
                <div>
                    <h3 className='text-md font-bold mb-2'>การแจ้งเตือน</h3>
                </div>
                {
                    noti && noti.length > 0 &&
                    <div onClick={clearNotification}>
                        <h3 className='text-sm text-gray-500 hover:cursor-pointer hover:opacity-60 duration-200'>ลบทั้งหมด</h3>
                    </div>
                }
            </div>

            {
                noti && noti.length > 0 ? noti?.map((item) => {
                    if (item.notificationType === 'PASS') {
                        return (
                            <div key={item.id} className='bg-white p-2 rounded-md flex gap-2 mb-2 duration-200 hover:cursor-pointer hover:bg-gray-200'>
                                <div className=' pt-1'>
                                    <CheckCircleOutlined style={{ color: 'green', fontSize: 32 }} />
                                </div>
                                <div className=' w-full flex justify-between'>
                                    <div onClick={() => navigate(`/review/${item.placeId}`)} className=''>
                                        <div>
                                            <h3 className='text-sm'>ระบบได้ ยืนยัน คำขอเพิ่มสถานที่ฝึกสหกิจของคุณแล้ว</h3>
                                            <h3 className='font-bold'>{item.engName}</h3>
                                        </div>
                                        <div>
                                            <span className='text-sm'>{dayjs(item?.createAt).tz('Asia/Bangkok').format('DD/MM/YYYY')}</span>
                                        </div>
                                    </div>
                                    <div onClick={() => delNotification(item.id)} className=''>
                                        <CloseOutlined style={{ color: 'gray' }} />
                                    </div>
                                </div>
                            </div>
                        )
                    } else if (item.notificationType === 'NO') {
                        return (
                            <div key={item.id} className='bg-white p-2 rounded-md flex gap-2 mb-2 duration-200 hover:cursor-pointer hover:bg-gray-200'>
                                <div className=' pt-1'>
                                    <CloseCircleOutlined style={{ color: 'red', fontSize: 32 }} />
                                </div>
                                <div className=' w-full flex justify-between'>
                                    <div className=''>
                                        <div>
                                            <h3 className='text-sm'>คำขอเพิ่มสถานที่ฝึกสหกิจของคุณไม่ได้รับการอนุมัติ</h3>
                                        </div>
                                        <div>
                                            <p className='text-sm text-gray-500'>
                                                {
                                                    item.detail
                                                }
                                            </p>
                                        </div>
                                        <div>
                                            <span className='text-sm'>{dayjs(item?.createAt).tz('Asia/Bangkok').format('DD/MM/YYYY')}</span>
                                        </div>
                                    </div>
                                    <div onClick={() => delNotification(item.id)} className=''>
                                        <CloseOutlined style={{ color: 'gray' }} />
                                    </div>
                                </div>
                            </div>
                        )
                    } else if (item.notificationType === 'EDITPASS') {
                        return (
                            <div key={item.id} className='bg-white p-2 rounded-md flex gap-2 mb-2 duration-200 hover:cursor-pointer hover:bg-gray-200'>
                                <div className=' pt-1'>
                                    <IssuesCloseOutlined style={{ color: 'blue', fontSize: 32 }} />
                                </div>
                                <div className=' w-full flex justify-between'>
                                    <div onClick={() => navigate(`/review/${item.placeId}`)} className=''>
                                        <div>
                                            <h3 className='text-sm'>ระบบได้ ยืนยัน คำขอแก้ไขสถานที่ฝึกสหกิจของคุณแล้ว</h3>
                                            <h3 className='font-bold'>{item.engName}</h3>
                                        </div>
                                        <div>
                                            <span className='text-sm'>{dayjs(item?.createAt).tz('Asia/Bangkok').format('DD/MM/YYYY')}</span>
                                        </div>
                                    </div>
                                    <div onClick={() => delNotification(item.id)} className=''>
                                        <CloseOutlined style={{ color: 'gray' }} />
                                    </div>
                                </div>
                            </div>
                        )
                    } else if (item.notificationType === 'EDITNO') {
                        return (
                            <div key={item.id} className='bg-white p-2 rounded-md flex gap-2 mb-2 duration-200 hover:cursor-pointer hover:bg-gray-200'>
                                <div className=' pt-1'>
                                    <InfoCircleOutlined style={{ color: 'orange', fontSize: 32 }} />
                                </div>
                                <div className=' w-full flex justify-between'>
                                    <div className=''>
                                        <div>
                                            <h3 className='text-sm'>คำขอแก้ไขสถานที่ฝึกสหกิจของคุณไม่ได้รับการอนุมัติ</h3>
                                            <h3 className='font-bold'>{item.engName}</h3>
                                        </div>
                                        <div>
                                            <p className='text-sm text-gray-500'>
                                                {
                                                    item.detail
                                                }
                                            </p>
                                        </div>
                                        <div>
                                            <span className='text-sm'>{dayjs(item?.createAt).tz('Asia/Bangkok').format('DD/MM/YYYY')}</span>
                                        </div>
                                    </div>
                                    <div onClick={() => delNotification(item.id)} className=''>
                                        <CloseOutlined style={{ color: 'gray' }} />
                                    </div>
                                </div>
                            </div>
                        )
                    } else if (item.notificationType === 'DELREVIEW') {
                        return (
                            <div key={item.id} className='bg-white p-2 rounded-md flex gap-2 mb-2 duration-200 hover:cursor-pointer hover:bg-gray-200'>
                                <div className=' pt-1'>
                                    <InfoCircleOutlined style={{ color: 'orange', fontSize: 32 }} />
                                </div>
                                <div className=' w-full flex justify-between'>
                                    <div onClick={() => navigate(`/review/${item.placeId}`)} className=''>
                                        <div>
                                            <h3 className='text-sm'>รีวิวของคุณถูกลบแล้ว</h3>
                                        </div>
                                        <div>
                                            <p className='text-sm text-gray-500'>
                                                {
                                                    item.detail
                                                }
                                            </p>
                                        </div>
                                        <div>
                                            <span className='text-sm'>{dayjs(item?.createAt).tz('Asia/Bangkok').format('DD/MM/YYYY')}</span>
                                        </div>
                                    </div>
                                    <div onClick={() => delNotification(item.id)} className=''>
                                        <CloseOutlined style={{ color: 'gray' }} />
                                    </div>
                                </div>
                            </div>
                        )
                    } else if (item.notificationType === 'VERIFYNO') {
                        return (
                            <div key={item.id} className='bg-white p-2 rounded-md flex gap-2 mb-2 duration-200 hover:cursor-pointer hover:bg-gray-200'>
                                <div className=' pt-1'>
                                    <CloseCircleOutlined style={{ color: 'red', fontSize: 32 }} />
                                </div>
                                <div className=' w-full flex justify-between'>
                                    <div className=''>
                                        <div>
                                            <h3 className='text-sm'>คำขอยืนยันตัวตนของคุณไม่ได้รับการอนุมัติ</h3>
                                        </div>
                                        <div>
                                            <p className='text-sm text-gray-500'>
                                                {
                                                    item.detail
                                                }
                                            </p>
                                        </div>
                                        <div>
                                            <span className='text-sm'>{dayjs(item?.createAt).tz('Asia/Bangkok').format('DD/MM/YYYY')}</span>
                                        </div>
                                    </div>
                                    <div onClick={() => delNotification(item.id)} className=''>
                                        <CloseOutlined style={{ color: 'gray' }} />
                                    </div>
                                </div>
                            </div>
                        )
                    } else if (item.notificationType === 'VERIFYPASS') {
                        return (
                            <div key={item.id} className='bg-white p-2 rounded-md flex gap-2 mb-2 duration-200 hover:cursor-pointer hover:bg-gray-200'>
                                <div className=' pt-1'>
                                    <CheckCircleOutlined style={{ color: 'green', fontSize: 32 }} />
                                </div>
                                <div className=' w-full flex justify-between'>
                                    <div onClick={() => navigate(`/review/${item.placeId}`)} className=''>
                                        <div>
                                            <h3 className='text-sm'>ยืนยันตัวตนสำเร็จ คุณสามารถรีวิวสถานที่นี้ได้แล้ว</h3>
                                            <h3 className='font-bold'>{item.engName}</h3>
                                        </div>
                                        <div>
                                            <span className='text-sm'>{dayjs(item?.createAt).tz('Asia/Bangkok').format('DD/MM/YYYY')}</span>
                                        </div>
                                    </div>
                                    <div onClick={() => delNotification(item.id)} className=''>
                                        <CloseOutlined style={{ color: 'gray' }} />
                                    </div>
                                </div>
                            </div>
                        )
                    } else if (item.notificationType === 'VERIFYACCOUNT') {
                        return (
                            <div key={item.id} className='bg-white p-2 rounded-md flex gap-2 mb-2 duration-200 hover:cursor-pointer hover:bg-gray-200'>
                                <div className=' pt-1'>
                                    <InfoCircleOutlined style={{ color: 'orange', fontSize: 32 }} />
                                </div>
                                <div className=' w-full flex justify-between'>
                                    <div onClick={() => navigate(`/profile/${currentUser?.id}`)} className=''>
                                        <div>
                                            <h3 className='text-sm'>กรุณายืนยันตัวตน เพื่อทำการรีวิว</h3>
                                        </div>
                                        <div>
                                            <p className='text-sm text-gray-500'>
                                                {
                                                    item.detail
                                                }
                                            </p>
                                        </div>
                                        <div>
                                            <span className='text-sm'>{dayjs(item?.createAt).tz('Asia/Bangkok').format('DD/MM/YYYY')}</span>
                                        </div>
                                    </div>
                                    <div onClick={() => delNotification(item.id)} className=''>
                                        <CloseOutlined style={{ color: 'gray' }} />
                                    </div>
                                </div>
                            </div>
                        )
                    }
                }) : <h2 className='text-center mt-3 text-sm text-gray-500'>ไม่มีการแจ้งเตือน</h2>
            }

        </div>
    )
}

export default NotificationCard