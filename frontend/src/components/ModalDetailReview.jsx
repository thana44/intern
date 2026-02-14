import { DeleteOutlined, LikeOutlined, SignatureOutlined, WarningOutlined } from '@ant-design/icons'
import { Carousel, Rate, Image, Modal, Button } from 'antd'
import React from 'react'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { useState } from 'react'
import EditReview from './EditReview'
import axios from 'axios'
import { useEffect } from 'react'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Bangkok')

function ModalDetailReview({ reviewId, detailKey }) {

    const [myReview, setMyReview] = useState([])
    const getMyReview = async () => {
        try {
            await axios.get(`${import.meta.env.VITE_BACKEND_URL}/review-api/get-review/${reviewId}`, { withCredentials: true })
                .then((res) => {
                    console.log(res.data.result, 'test get my review')
                    setMyReview(res.data.result[0])
                })
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getMyReview()
    }, [detailKey])

    console.log(myReview, 'this is my new review')

    return (
        <div className='bg-white py-5 px-3 rounded-lg shadow-md hover:cursor-pointer mt-3'>
            <div className='flex items-center justify-between'>

            </div>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                    <div>
                        <img className='h-10 w-10 object-cover rounded-full' src={myReview?.profileImg} />
                    </div>
                    <div>
                        <h3 className='text-md font-bold'>{myReview?.username}</h3>
                        <h3 className='text-sm text-gray-500'>{dayjs(myReview?.createAt).tz('Asia/Bangkok').format('DD/MM/YYYY')}</h3>
                    </div>
                </div>
            </div>
            <div className='my-2'>
                <Rate style={{ fontSize: 15, color: '#d6960d' }} disabled value={myReview?.rating} />
            </div>
            <div>
                <div className='mb-3'>
                    <div className='text-gray-500'>
                        ตำแหน่ง: {myReview?.position}
                    </div>
                    <div className='text-gray-500'>
                        ระยะเวลาฝึก: {myReview?.period}
                    </div>
                </div>
                <div className='text-gray-500'>
                    <p>
                        {myReview?.detail}
                    </p>
                </div>
            </div>
            <div className='mt-4 bg-transparent grid grid-cols-1'>
                <Image.PreviewGroup>
                    <Carousel arrows infinite={false} slidesToShow={4} dots
                        responsive={[
                            {
                                breakpoint: 1280, // < xl
                                settings: { slidesToShow: 4 },
                            },
                            {
                                breakpoint: 1024, // < lg
                                settings: { slidesToShow: 4 },
                            },
                            {
                                breakpoint: 768, // < md
                                settings: { slidesToShow: 4 },
                            },
                            {
                                breakpoint: 640, // < sm
                                settings: { slidesToShow: 3 },
                            },
                        ]}
                    >

                        {
                            myReview?.images && myReview?.images.map((img) => {
                                return (
                                    <div className="pr-1">
                                        <Image
                                            height={138}
                                            width="100%"
                                            src={img}
                                            className="h-[138px] w-full object-cover rounded-xl"
                                        />
                                    </div>
                                )
                            })
                        }

                    </Carousel>
                </Image.PreviewGroup>
            </div>

        </div>
    )
}

export default ModalDetailReview