import React, { useEffect, useState } from 'react'
import { TimePicker, ConfigProvider, DatePicker, Select, Input, Switch, Checkbox, Radio, Upload, Image, Button, message, Modal, Rate } from 'antd';
import { CheckCircleOutlined, PlusOutlined } from '@ant-design/icons'
import axios from 'axios'
import dayjs from "dayjs"
import TextArea from 'antd/es/input/TextArea';
import { useDispatch } from 'react-redux';
import { triggerReviewUpdate } from '../redux/reduxSlice/reviewSlice';

const { RangePicker } = TimePicker;
const getBase64 = file =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

function EditReview({ placeId, onSuccess, detailKey }) {

    const dispatch = useDispatch()

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState([]);
    const handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };
    const handleChangeImg = ({ fileList: newFileList }) => setFileList(newFileList);
    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>อัพโหลด</div>
        </button>
    )

    const [isLoading, setIsLoading] = useState(false)

    console.log(fileList, 'test filelist')

    const handleUpdateReview = async () => {
        setIsLoading(true)
        try {
            const newImages = fileList.filter(f => f.originFileObj)
            const keepOldImages = fileList.filter(f => f.imageId)
            const formData = new FormData()
            newImages.forEach((file) => {
                formData.append("newImages", file.originFileObj)
            })
            formData.append(
                "keepOldImages",
                JSON.stringify(keepOldImages.map(img => ({
                    id: img.imageId,
                    publicId: img.publicId
                }))))
            formData.append(
                "deletedImages",
                JSON.stringify(deletedImages.map(img => ({
                    id: img.imageId,
                    publicId: img.publicId
                }))))
            formData.append("rating", rating)
            formData.append("position", position)
            formData.append("period", period)
            formData.append("detail", detail)
            formData.append("placeId", placeId)
            formData.append("reviewId", reviewId)

            const result = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/review-api/update`, formData, { withCredentials: true })
            dispatch(triggerReviewUpdate())
            onSuccess()
            console.log(result.data, 'test data for update')

        } catch (err) {
            console.log(err)
            message.error(err.response.data.message)
        } finally {
            setIsLoading(false)
        }
    }

    const [rating, setRating] = useState(0)
    const [position, setPosition] = useState('')
    const [period, setPeriod] = useState('')
    const [detail, setDetail] = useState('')

    console.log(rating, 'rating')
    console.log(position, 'position')
    console.log(period, 'period')
    console.log(detail, 'detail')

    console.log(placeId, ' place id')

    const [myReview, setMyReview] = useState([])
    const [reviewId, setReviewId] = useState('')
    const getMyReviewId = async () => {
        try {
            await axios.get(`${import.meta.env.VITE_BACKEND_URL}/review-api/getMyReview/${placeId}`, { withCredentials: true })
                .then((res) => {
                    console.log(res.data.result, 'test get my review')
                    setMyReview(res.data.result)
                    setRating(res.data.result[0].rating)
                    setPosition(res.data.result[0].position)
                    setPeriod(res.data.result[0].period)
                    setDetail(res.data.result[0].detail)
                    setReviewId(res.data.result[0].id)
                })
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getMyReviewId()
    }, [detailKey])

    console.log(myReview, 'oldData')

    const [deletedImages, setDeletedImages] = useState([])
    const getImage = async () => {
        try {
            await axios.get(`${import.meta.env.VITE_BACKEND_URL}/image-api/get-my-review-image/${reviewId}`, { withCredentials: true })
                .then((res) => {
                    console.log(res.data, 'image 555555555555')
                    if (res.data.result.length > 0) {
                        const oldImages = res.data.result.map(img => ({
                            uid: `old-${img.id}`,
                            name: `image-${img.id}`,
                            status: 'done',
                            url: img.imgUrl,
                            imageId: img.id,          // ใช้แยกรูปเก่า
                            publicId: img.publicId    // ใช้ลบ cloudinary
                        }))

                        setFileList(oldImages)
                    }
                    else {
                        setFileList([])
                    }
                })
        } catch (err) {
            console.log(err)
        }
    }
    useEffect(() => {
        getImage()
        setDeletedImages([])
    }, [reviewId, detailKey])

    return (
        <div className='bg-transparent w-full'>
            <div className='bg-white py-5 px-3 rounded-lg shadow-md mt-3'>
                <div className='font-bold mb-4'>
                    คะแนนรีวิว
                </div>
                <div className='bg-white mt-4 grid gap-2'>
                    <div className='flex items-center justify-center'>
                        <Rate
                            size='large'
                            value={rating}
                            onChange={(value) => {
                                setRating(value)
                                console.log('rating =', value)
                            }}
                            allowClear
                        />
                    </div>
                </div>
            </div>

            <div className='bg-white py-5 px-3 rounded-lg shadow-md mt-3'>
                <div className='font-bold mb-4'>
                    รายละเอียดรีวิว
                </div>
                <div className='bg-white mt-4 grid gap-2'>
                    <div>
                        <div className='flex items-center gap-1'>
                            <span className='text-sm text-gray-500'>ตำแหน่งที่ฝึก</span>
                            <div className='text-red-500'>*</div>
                        </div>
                        <Input value={position || ''} onChange={(e) => setPosition(e.target.value)} size='large' count={{ show: true, max: 100, }} maxLength={100} placeholder="เช่น Backend Developer" />
                    </div>

                    <div>
                        <div className='flex items-center gap-1'>
                            <span className='text-sm text-gray-500'>ระยะเวลาฝึก</span>
                            <div className='text-red-500'>*</div>
                        </div>
                        <Input value={period || ''} onChange={(e) => setPeriod(e.target.value)} count={{ show: true, max: 100, }} maxLength={100} size='large' placeholder="เช่น 3 เดือน" />
                    </div>
                    <div>
                        <div className='flex items-center gap-1'>
                            <span className='text-sm text-gray-500'>ความคิดเห็น</span>
                            <div className='text-red-500'>*</div>
                        </div>
                        <div className='mb-5'>
                            <TextArea
                                value={detail}
                                size='large'
                                onChange={(e) => setDetail(e.target.value)}
                                placeholder="แสดงความคิดเห็นเกี่ยวกับสถานที่ฝึก"
                                style={{ height: 120, resize: 'none' }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className='bg-white py-5 px-3 rounded-lg shadow-md mt-3'>
                <div className='font-bold mb-4'>
                    อัพโหลดรูปภาพ
                </div>
                <div>
                    <Upload
                        listType="picture-card"
                        fileList={fileList}
                        beforeUpload={() => false}
                        onPreview={handlePreview}
                        onChange={handleChangeImg}
                        onRemove={(file) => {
                            // mark ว่ารูปนี้ถูกลบ
                            if (file.imageId) {
                                setDeletedImages(prev => [...prev, file])
                            }
                        }}
                        maxCount={10}
                    >
                        {fileList.length >= 10 ? null : uploadButton}
                    </Upload>
                    {previewImage && (
                        <Image
                            styles={{ root: { display: 'none' } }}
                            preview={{
                                open: previewOpen,
                                onOpenChange: visible => setPreviewOpen(visible),
                                afterOpenChange: visible => !visible && setPreviewImage(''),
                            }}
                            src={previewImage}
                        />
                    )}
                </div>
            </div>

            <div className='flex justify-end mt-4'>
                <Button onClick={handleUpdateReview} style={{ width: 150 }} size="large" type="primary" loading={isLoading}>แก้ไข</Button>
            </div>

        </div>
    )
}

export default EditReview