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
import { useDispatch } from 'react-redux'
import { triggerReviewUpdate } from '../redux/reduxSlice/reviewSlice'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Bangkok')

function MyReviewCard({ placeId, onDelSucc }) {

    const [editReviewModal, setEditReviewModal] = useState(false)
    const [delReviewModal, setDelReviewModal] = useState(false)
    const [detailKey, setDetailKey] = useState(0)

    const handleOpenModal = () => {
        setDetailKey(prev => prev + 1)
        setEditReviewModal(true)
    }

    const [myReview, setMyReview] = useState([])
    const getMyReview = async () => {
        try {
            await axios.get(`${import.meta.env.VITE_BACKEND_URL}/review-api/getMyReview/${placeId}`, { withCredentials: true })
                .then((res) => {
                    // console.log(res.data.result, 'test get my review')
                    setMyReview(res.data.result[0])
                })
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getMyReview()
    }, [])

    const handleUpdateSuccess = () => {
        setEditReviewModal(false)
        getMyReview()
    }

    const handleOpenDeleteModal = () => {
        setDelReviewModal(true)
    }

    const dispatch = useDispatch()
    const [isLoading, setLoading] = useState(false)
    const delMyReview = async (id) => {
        setLoading(true)
        try {
            await axios.put(`${import.meta.env.VITE_BACKEND_URL}/review-api/delete/${id}`, {}, { withCredentials: true })
                .then((res) => {
                    // console.log(res.data.result, 'test delete review')
                    dispatch(triggerReviewUpdate())
                    onDelSucc()
                })
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    // console.log(myReview, 'this is my new review')

    return (
        <div className='bg-white py-5 px-3 rounded-lg shadow-md hover:cursor-pointer mt-3'>
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='text-md font-bold mb-2'>รีวิวของฉัน</h1>
                </div>
                <div className='flex items-center gap-4'>
                    <div onClick={() => handleOpenModal()} className='duration-200 hover:opacity-60'>
                        <SignatureOutlined style={{ color: 'gray' }} className='text-md' />
                    </div>
                    <Modal
                        title="แก้ไขรีวิวของคุณ"
                        centered
                        open={editReviewModal}
                        closable={{ 'aria-label': 'Custom Close Button' }}
                        footer={null}
                        onCancel={() => setEditReviewModal(false)}
                    >
                        <div className=''>
                            <EditReview detailKey={detailKey} placeId={myReview?.placeId} onSuccess={handleUpdateSuccess} />
                        </div>
                    </Modal>
                    <div onClick={() => handleOpenDeleteModal()} className='duration-200 hover:opacity-60'>
                        <DeleteOutlined style={{ color: 'gray' }} className='text-md' />
                    </div>
                    <Modal
                        title="ยืนยันการลบรีวิว"
                        centered
                        open={delReviewModal}
                        closable={{ 'aria-label': 'Custom Close Button' }}
                        footer={null}
                        onCancel={() => setDelReviewModal(false)}
                    >
                        <div>
                            <div className='my-5'>
                                <div className='flex flex-col justify-center items-center gap-3'>
                                    <div className='text-6xl text-yellow-500'>
                                        <WarningOutlined />
                                    </div>
                                    <div>
                                        คุณต้องการลบรีวิวนี้ใช่หรือไม่
                                    </div>
                                </div>
                            </div>
                            <div className='flex justify-center'>
                                <Button loading={isLoading} color="danger" variant="solid" danger size='large' onClick={() => delMyReview(myReview?.id)}>
                                    ยืนยันการลบ
                                </Button>
                            </div>
                        </div>
                    </Modal>
                </div>
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
            <div className=' my-5'>
                <div className='bg-transparent border border-gray-300 flex items-center gap-1 mb-4 w-fit px-3 py-1 rounded-md'>
                    <div>
                        <LikeOutlined className='text-xl' style={{ color: 'gray' }} />
                    </div>
                    <h3 className='text-gray-500'>{myReview?.likes?.length} คนถูกใจรีวิวของคุณ</h3>
                </div>
            </div>
        </div>
    )
}

export default MyReviewCard