import { FlagOutlined, LikeOutlined } from '@ant-design/icons'
import { Carousel, Rate, Image, Modal, Button, message } from 'antd'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import dayjs from 'dayjs'
import React from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import TextArea from 'antd/es/input/TextArea'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Bangkok')
function ReviewCard({ data, onLikeSucc }) {

    // console.log(data, 'data post')
    const currentUser = useSelector((x) => x.user.currentUser)
    const navigate = useNavigate()

    const handleLike = async () => {
        try {
            await axios.put(`${import.meta.env.VITE_BACKEND_URL}/review-api/like-unlike/${data?.id}`, {}, { withCredentials: true })
                .then((res) => {
                    // console.log(res.data)
                    onLikeSucc()
                })
        } catch (err) {
            console.log(err)
        }
    }

    const [modalOpen, setModalOpen] = useState(false)
    const [detail, setDetail] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleReportReview = async () => {
        setIsLoading(true)
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/review-api/report-review/${data?.id}`, { detail }, { withCredentials: true })
                .then((res) => {
                    // console.log(res.data)
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
        <div className='bg-transparent'>
            <div className='flex items-center justify-between'>
                <div onClick={() => navigate(`/profile/${data?.userId}`)} className='flex items-center gap-3'>
                    <div>
                        <img className='h-10 w-10 object-cover rounded-full' src={data?.profileImg} />
                    </div>
                    <div>
                        <h3 className='text-md font-bold'>{data?.username}</h3>
                        <h3 className='text-sm text-gray-500'>{dayjs(data?.createAt).tz('Asia/Bangkok').format('DD/MM/YYYY')}</h3>
                    </div>
                </div>
                {
                    currentUser ?
                        <div onClick={openModal} className='duration-200 hover:opacity-60'>
                            <FlagOutlined style={{ color: 'gray' }} className='text-lg' />
                        </div>
                        :
                        <div onClick={() => navigate('/login')} className='duration-200 hover:opacity-60'>
                            <FlagOutlined style={{ color: 'gray' }} className='text-lg' />
                        </div>
                }
                <Modal
                    title="รายงานรีวิวที่ไม่เหมาะสม"
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
                            <Button loading={isLoading} color="danger" variant="solid" danger size='large' onClick={handleReportReview}>
                                รายงาน
                            </Button>
                        </div>
                    </div>
                </Modal>
            </div>
            <div className='my-2'>
                <Rate style={{ fontSize: 15, color: '#d6960d' }} disabled value={data?.rating} />
            </div>
            <div>
                <div className='mb-3'>
                    <div className='text-gray-500'>
                        ตำแหน่ง: {data?.position}
                    </div>
                    <div className='text-gray-500'>
                        ระยะเวลาฝึก: {data?.period}
                    </div>
                </div>
                <div className='text-gray-500'>
                    <p>
                        {data?.detail}
                    </p>
                </div>
            </div>
            <div className='mt-4 bg-transparent grid grid-cols-1'>
                <Image.PreviewGroup>
                    <Carousel arrows infinite={false} slidesToShow={6} dots
                        responsive={[
                            {
                                breakpoint: 1280, // < xl
                                settings: { slidesToShow: 5 },
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
                            data?.images && data?.images.map((img) => {
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
            <div className='border border-black border-x-0 border-t-0 my-5'>
                {
                    currentUser && data?.likes?.includes(currentUser?.id) ?
                        <div onClick={() => handleLike()} className='bg-gray-200 border border-gray-300 flex items-center gap-1 mb-4 w-fit px-3 py-1 rounded-md'>
                            <div>
                                <LikeOutlined className='text-xl' style={{ color: 'gray' }} />
                            </div>
                            <h3 className='text-gray-500'>{data.likes.length} คนถูกใจรีวิวนี้</h3>
                        </div>
                        : <div onClick={() => handleLike()} className='bg-transparent border border-gray-300 flex items-center gap-1 mb-4 w-fit px-3 py-1 rounded-md'>
                            <div>
                                <LikeOutlined className='text-xl' style={{ color: 'gray' }} />
                            </div>
                            <h3 className='text-gray-500'>{data.likes.length} คนถูกใจรีวิวนี้</h3>
                        </div>
                }
            </div>
        </div>
    )
}

export default ReviewCard