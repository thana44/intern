import { StarFilled } from '@ant-design/icons';
import React from 'react'
import { IoBookmarkOutline } from "react-icons/io5";
import { Carousel } from 'antd';
import { Image } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { FaBookmark } from 'react-icons/fa6';
import { setSaveCount } from '../redux/reduxSlice/menuSlice';

function PlaceCard({ data, onSave, onSaveSearch }) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const currentUser = useSelector((x) => x.user.currentUser)

    const getSaveCount = async () => {
        try {
            const result = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/noti-api/get-save-count`, { withCredentials: true })
            dispatch(setSaveCount(result.data.result[0].saveCount))
        } catch (err) {
            console.log(err)
        }
    }

    const handleSave = async (id) => {
        try {

            const result = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/save-api/save-unsave/${id}`, {}, { withCredentials: true })
            console.log(result.data, 'test handle save')
            getSaveCount()
            if (onSave) {
                onSave()
            } else {
                onSaveSearch()
            }
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className='bg-white py-5 px-3 rounded-lg shadow-md hover:cursor-pointer'>
            <div className='bg-transparent grid grid-cols-1 gap-3 mb-5'>
                <div className='hidden sm:block'>
                    <Image.PreviewGroup>
                        <div className="flex gap-2 overflow-x-auto">
                            {
                                data?.images.length > 0 && data?.images?.slice(0, 4).map((imgUrl, index) => {
                                    return <Image key={index} className='object-cover rounded-xl' width={200} height={138} src={imgUrl} />
                                })
                            }
                        </div>
                    </Image.PreviewGroup>
                </div>
                <div className='block sm:hidden'>
                    <Image.PreviewGroup>
                        <div className="flex gap-2 overflow-x-auto">
                            {
                                data?.images.length > 0 && data?.images?.slice(0, 3).map((imgUrl, index) => {
                                    return <Image key={index} className='object-cover rounded-xl' width={200} height={138} src={imgUrl} />
                                })
                            }
                        </div>
                    </Image.PreviewGroup>
                </div>
            </div>
            <div className='bg-transparent flex justify-between items-center'>
                <div onClick={() => navigate(`/review/${data?.id}`)} className='flex gap-3 items-center duration-200 hover:opacity-50'>
                    <h1 className='text-xl font-bold'>{data?.engName}</h1>
                    <span className='text-sm text-gray-500'>{data?.district}</span>
                </div>
                {
                    data && data?.userSave?.includes(currentUser?.id) ?
                        <div onClick={() => handleSave(data?.id)} className='hover:cursor-pointer'>
                            <FaBookmark
                                className="text-2xl"
                                style={{
                                    fill: 'rgba(232, 176, 0)',   // สีดำจางด้านใน
                                    stroke: '#fff',            // ขอบสีขาว
                                    strokeWidth: 40,
                                }}
                            />
                        </div>
                        :
                        <div onClick={() => handleSave(data?.id)} className='hover:cursor-pointer'>
                            <FaBookmark
                                className="text-2xl"
                                style={{
                                    fill: 'rgba(0,0,0,0.35)',   // สีดำจางด้านใน
                                    stroke: '#fff',            // ขอบสีขาว
                                    strokeWidth: 40,
                                }}
                            />
                        </div>
                }
            </div>
            <div>
                <div className='text-sm text-gray-500 my-2'>
                    {data?.placeType}
                </div>
                <div className='flex items-center gap-3'>
                    <div className='flex gap-1 items-center'>
                        <StarFilled style={{ color: '#d6960d' }} />
                        <span className='text-sm'>{data?.avg_rating}</span>
                    </div>
                    <div className='text-sm text-gray-500'>
                        {data?.review_count} รีวิว
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PlaceCard