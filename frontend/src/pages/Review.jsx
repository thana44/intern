import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import DetailReview from '../components/DetailReview'
import ContactReview from '../components/ContactReview'
import { IoBookmarkOutline } from 'react-icons/io5'
import { EditOutlined, StarFilled } from '@ant-design/icons'
import { Button, Progress, Rate, Image, Select, Modal } from 'antd'
import ReviewCard from '../components/ReviewCard'
import ImageGallery from '../components/ImageGallery'
import MapCard from '../components/MapCard'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getReviewData } from '../redux/reduxSlice/reviewSlice'
import CreateReview from '../components/CreateReview'
import MyReviewCard from '../components/MyReviewCard'
import { setSaveCount } from '../redux/reduxSlice/menuSlice'

function Review() {

    const { placeId } = useParams()
    const dispatch = useDispatch()
    const reviewData = useSelector((x) => x.review.reviewData)
    const currentUser = useSelector((x) => x.user.currentUser)
    const navigate = useNavigate()

    const getPlaceId = async () => {
        try {
            await axios.get(`${import.meta.env.VITE_BACKEND_URL}/place-api/get-place-review/${placeId}`, { withCredentials: true })
                .then((res) => {
                    dispatch(getReviewData(res.data.place))
                    console.log(res.data.place, 'placeeeeeeeeeeeeee')
                })
        } catch (err) {
            console.log(err)
            return navigate('/')
        }
    }

    useEffect(() => {
        if (placeId) {
            getPlaceId()
        }
    }, [placeId])

    console.log(reviewData, 'test redux')

    const [images, setImages] = useState([])
    const getImage = async () => {
        try {
            await axios.get(`${import.meta.env.VITE_BACKEND_URL}/image-api/get-image/${reviewData?.placeRequestId}`, { withCredentials: true })
                .then((res) => {
                    console.log(res.data)
                    setImages(res.data.result.map((img) => img.imgUrl))
                })
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getImage()
    }, [reviewData, placeId])

    const [openCreateReviewModal, setOpenCreateReviewModal] = useState(false)
    const handleCreateReviewSuccess = () => {
        setOpenCreateReviewModal(false)
        getMyReview()
    }

    const handleDeleteReviewSuccess = () => {
        getMyReview()
    }

    const [myReview, setMyReview] = useState([])
    const getMyReview = async () => {
        try {
            await axios.get(`${import.meta.env.VITE_BACKEND_URL}/review-api/getMyReview/${placeId}`, { withCredentials: true })
                .then((res) => {
                    console.log(res.data.result, 'test get my review')
                    setMyReview(res.data.result)
                })
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getMyReview()
    }, [placeId])

    const reviewUpdated = useSelector(
        (state) => state.review.reviewUpdated
    )
    const [summary, setSummary] = useState({
        avgRating: 0,
        totalReviews: 0,
        breakdown: {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
        }
    })
    const getRatingSummary = async () => {
        try {
            await axios.get(`${import.meta.env.VITE_BACKEND_URL}/review-api/review-summary/${placeId}`, { withCredentials: true })
                .then((res) => {
                    // console.log(res.data, 'summary')
                    setSummary(res.data)
                })
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getRatingSummary()
    }, [reviewUpdated, placeId])

    console.log(summary, 'test sum')

    const [selectedStar, setSelectedStar] = useState(null)
    const [sortBy, setSortBy] = useState('createAt')

    console.log(selectedStar, 'star')
    console.log(sortBy, 'sortBy')

    const [allReview, setAllReview] = useState([])
    const getReviewInPlace = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/review-api/get-all-review/${placeId}`, { selectedStar, sortBy }, { withCredentials: true })
                .then((res) => {
                    console.log(res.data, 'all -review')
                    if (currentUser) {
                        setAllReview(res.data.newResult.filter((item) => item.userId !== currentUser.id))
                    } else {
                        setAllReview(res.data.newResult)
                    }
                })
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getReviewInPlace()
        getRatingSummary()
    }, [reviewUpdated, placeId, currentUser, selectedStar, sortBy])

    const onLikeSucc = () => {
        getReviewInPlace()
    }

    console.log(allReview, 'this is final result')

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
            getPlaceId()
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className='bg-gray-200 min-h-screen'>
            <Navbar />
            <div className='bg-transparent flex justify-center min-h-screen'>
                <div className='bg-transparent w-[90%] sm:w-[80%] md:w-[90%] xl:w-[80%] mt-15'>
                    <div className='bg-transparent max-h-[300px] mb-4'>
                        <Image.PreviewGroup>
                            <ImageGallery images={images} placeId={placeId} />
                        </Image.PreviewGroup>

                    </div>
                    <div className='bg-transparent md:grid md:grid-cols-[0.6fr_0.4fr] lg:grid-cols-[0.7fr_0.3fr] gap-3'>
                        <div>
                            <div className='bg-white py-5 px-3 rounded-lg shadow-md hover:cursor-pointer'>
                                <div className='bg-transparent flex justify-between items-center'>
                                    <div className='flex gap-3 items-center'>
                                        <h1 className='text-xl font-bold'>{reviewData?.engName}</h1>
                                        <span className='text-sm text-gray-500'>{reviewData?.district}</span>
                                    </div>
                                    {
                                        currentUser && currentUser?.role !== 'ADMIN' &&
                                        <div onClick={() => navigate(`/edit-place/${placeId}`)} className='flex items-center justify-center gap-2 duration-200 hover:opacity-60'>
                                            <EditOutlined style={{ color: 'gray' }} className='text-xl' />
                                            <span className='text-sm text-gray-500'>แก้ไขข้อมูล</span>
                                        </div>
                                    }
                                </div>
                                <div>
                                    <div className='text-sm text-gray-500 my-2'>
                                        {reviewData?.placeType}
                                    </div>
                                    <div className='flex items-center gap-3'>
                                        <div className='flex gap-1 items-center'>
                                            <StarFilled style={{ color: '#d6960d' }} />
                                            <span className='text-sm'>{summary?.avgRating.toFixed(1)}</span>
                                        </div>
                                        <div className='text-sm text-gray-500'>
                                            {summary?.totalReviews} รีวิว
                                        </div>
                                    </div>
                                </div>
                                <div className='border-[1px] border-black mt-3 border-x-0 border-b-0'>
                                    <div className='mt-4 flex items-center gap-3'>
                                        {
                                            currentUser ?
                                                <Button disabled={myReview?.length > 0 || currentUser?.myPlaceId !== placeId ? true : false} onClick={() => setOpenCreateReviewModal(true)} color="primary" variant="solid">
                                                    เขียนรีวิว
                                                </Button>
                                                :
                                                <Button onClick={() => navigate('/login')} color="primary" variant="solid">
                                                    เขียนรีวิว
                                                </Button>
                                        }
                                        <Modal
                                            title="เขียนรีวิวของคุณ"
                                            centered
                                            open={openCreateReviewModal}
                                            closable={{ 'aria-label': 'Custom Close Button' }}
                                            footer={null}
                                            onCancel={() => setOpenCreateReviewModal(false)}
                                        >
                                            <div className=''>
                                                <CreateReview detailKey={''} onSuccess={handleCreateReviewSuccess} placeId={placeId} />
                                            </div>
                                        </Modal>
                                        <Button onClick={() => navigate(`/all-photo/${placeId}`)} color="default" variant="filled">
                                            ภาพทั้งหมด
                                        </Button>
                                        {
                                            reviewData?.userSave && currentUser?.id && reviewData?.userSave.includes(currentUser?.id) ?
                                                <Button onClick={() => handleSave(placeId)} color="default" variant="filled">
                                                    บันทึกแล้ว
                                                </Button>
                                                :
                                                <Button onClick={() => handleSave(placeId)} color="default" variant="filled">
                                                    บันทึก
                                                </Button>
                                        }
                                    </div>
                                </div>
                            </div>

                            <div className='mt-3 md:hidden'>
                                <DetailReview />
                            </div>
                            <div className='mt-3 md:hidden'>
                                <ContactReview />
                            </div>
                            <div className='mt-3 md:hidden'>
                                <MapCard />
                            </div>

                            {
                                myReview?.length > 0 && <MyReviewCard placeId={placeId} onDelSucc={handleDeleteReviewSuccess} />
                            }

                            <div className='bg-white py-5 px-3 rounded-lg shadow-md hover:cursor-pointer my-3'>
                                <div>
                                    <h3 className='text-md font-bold mb-3'>{summary?.totalReviews} รีวิว</h3>
                                </div>
                                <div className='bg-transparent flex justify-center gap-2'>
                                    <div className='bg-transparent flex flex-col items-center justify-center'>
                                        <h3 className='text-5xl font-bold'>{summary?.avgRating.toFixed(1)}</h3>
                                        <div className='hidden sm:block'>
                                            <Rate style={{ fontSize: 16, color: '#d6960d' }} disabled allowHalf value={summary?.avgRating} />
                                        </div>
                                        <div className='block sm:hidden'>
                                            <Rate style={{ fontSize: 12, color: '#d6960d' }} disabled allowHalf value={summary?.avgRating} />
                                        </div>
                                        <h3 className='text-sm text-gray-500'>จาก {summary?.totalReviews}</h3>
                                    </div>
                                    <div className='bg-transparent flex flex-col items-center justify-center'>
                                        <div className='flex gap-2'>
                                            <div className='flex gap-1 items-center'>
                                                <span className='text-sm'>5</span>
                                                <StarFilled style={{ color: '#d6960d' }} />
                                            </div>
                                            <div className='w-[150px] sm:w-[250px] flex items-center'>
                                                <Progress percent={summary?.breakdown[5]} showInfo={false} />
                                            </div>
                                        </div>
                                        <div className='flex gap-2'>
                                            <div className='flex gap-1 items-center'>
                                                <span className='text-sm'>4</span>
                                                <StarFilled style={{ color: '#d6960d' }} />
                                            </div>
                                            <div className='w-[150px] sm:w-[250px] flex items-center'>
                                                <Progress percent={summary?.breakdown[4]} showInfo={false} />
                                            </div>
                                        </div>
                                        <div className='flex gap-2'>
                                            <div className='flex gap-1 items-center'>
                                                <span className='text-sm'>3</span>
                                                <StarFilled style={{ color: '#d6960d' }} />
                                            </div>
                                            <div className='w-[150px] sm:w-[250px] flex items-center'>
                                                <Progress percent={summary?.breakdown[3]} showInfo={false} />
                                            </div>
                                        </div>
                                        <div className='flex gap-2'>
                                            <div className='flex gap-1 items-center'>
                                                <span className='text-sm'>2</span>
                                                <StarFilled style={{ color: '#d6960d' }} />
                                            </div>
                                            <div className='w-[150px] sm:w-[250px] flex items-center'>
                                                <Progress percent={summary?.breakdown[2]} showInfo={false} />
                                            </div>
                                        </div>
                                        <div className='flex gap-2'>
                                            <div className='flex gap-1 items-center'>
                                                <span className='text-sm'>1</span>
                                                <StarFilled style={{ color: '#d6960d' }} />
                                            </div>
                                            <div className='w-[150px] sm:w-[250px] flex items-center'>
                                                <Progress percent={summary?.breakdown[1]} showInfo={false} />
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div className='border border-black border-x-0 border-b-0 mt-5 pt-3 flex items-center justify-between'>
                                    <div className='flex gap-4'>
                                        <h3 className='text-md font-bold'>ตัวกรอง</h3>
                                    </div>
                                    <div className='text-xl font-bold'>
                                        <Select
                                            value={sortBy}
                                            style={{ width: 120 }}
                                            onChange={(value) => setSortBy(value)}
                                            options={[
                                                { value: 'createAt', label: 'ล่าสุด' },
                                                { value: 'maxLike', label: 'ยอดนิยม' },
                                            ]}
                                        />
                                    </div>
                                </div>
                                <div className='bg-white mt-2'>
                                    <div className='flex gap-4 justify-center'>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <div
                                                key={star}
                                                onClick={() =>
                                                    setSelectedStar(selectedStar === star ? null : star)
                                                }
                                                className={`cursor-pointer border px-2 rounded-md flex items-center gap-1
                                                    ${selectedStar === star
                                                        ? 'border-yellow-400 bg-yellow-50'
                                                        : 'border-gray-300'}
                                                    `}
                                            >
                                                <span>{star}</span>
                                                <StarFilled
                                                    style={{
                                                        color: selectedStar === star ? '#d6960d' : 'gray'
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className='bg-transparent mt-6'>
                                    {
                                        allReview?.length > 0 ? allReview.map((item) => {
                                            return (
                                                <ReviewCard key={item.id} data={item} onLikeSucc={onLikeSucc} />
                                            )
                                        }) : <h2 className='text-center mt-10 text-sm text-gray-500'>ไม่พบรีวิวอื่น</h2>
                                    }
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className='mb-3 hidden md:block'>
                                <DetailReview />
                            </div>
                            <div className='mb-3 hidden md:block'>
                                <ContactReview />
                            </div>
                            <div className='hidden md:block'>
                                <MapCard />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Review