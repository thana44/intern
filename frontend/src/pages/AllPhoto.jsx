import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { StarFilled } from '@ant-design/icons'
import { Image } from 'antd'
import { useParams } from 'react-router-dom'
import axios from 'axios'

function AllPhoto() {

    const { placeId } = useParams()
    const [allPhoto, setAllPhoto] = useState([])
    const [data, setData] = useState([])

    const getAllPhoto = async () => {
        try {
            const result = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/image-api/get-all-place/${placeId}`, { withCredentials: true })
            const imgPlace = result.data.newResult[0].images
            const imgReview = result.data.reviewImages
            setData(result.data.newResult[0])
            setAllPhoto([...imgPlace, ...imgReview])
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getAllPhoto()
    }, [])

    // console.log(allPhoto, data)

    return (
        <div className='bg-gray-200 min-h-screen'>
            <Navbar />
            <div className='bg-transparent flex justify-center min-h-screen'>
                <div className='bg-transparent w-[90%] sm:w-[80%] md:w-[90%] xl:w-[80%] mt-15 flex justify-center'>
                    <div className='bg-transparent w-full sm:w-[90%] md:w-[80%] lg:w-[60%] pb-20'>
                        <div className='flex items-center gap-1'>
                            <h3 className='text-xl'>รูปภาพทั้งหมดของ</h3>
                            <h3 className='text-xl font-bold'>{data?.engName}</h3>
                        </div>
                        <div className='bg-white py-5 px-3 rounded-lg shadow-md mt-3'>
                            <div className='border border-gray-300 rounded-md flex gap-3 py-3 px-3'>
                                <img className='w-25 h-25 object-cover rounded-md' src={allPhoto[0]} />
                                <div className='bg-transparent w-full'>
                                    <div className='grid gap-1'>
                                        <h1 className='text-md font-bold'>{data?.engName}</h1>
                                        <span className='text-sm text-gray-500'>{data?.district}</span>
                                        <span className='text-sm text-gray-500'>{data?.placeType}</span>
                                        <div className='flex gap-1 items-center'>
                                            <StarFilled style={{ color: '#d6960d' }} />
                                            <span className='text-sm'>{data?.avg_rating}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='mt-8'>
                                <Image.PreviewGroup>
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                        {
                                            allPhoto && allPhoto?.length > 0 && allPhoto.map((img, i) => {
                                                return <Image key={i} className='object-cover rounded-md' width={'100%'} height={138} src={img} />
                                            })
                                        }
                                    </div>
                                </Image.PreviewGroup>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AllPhoto