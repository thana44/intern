import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import PlaceCard from '../components/PlaceCard'
import Collection from '../components/Collection'
import { Select } from 'antd'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import axios from 'axios'

function Save() {

    const [data, setData] = useState([])

    const getPlaceSave = async () => {
        try {
            const result = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/save-api/get-place-save`, {withCredentials: true})
            console.log(result.data,' this is my post')
            setData(result.data.data)
        }catch(err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getPlaceSave()
    }, [])

    const handleSave = () => {
        getPlaceSave()
    }
    
    return (
        <div className='bg-gray-200 min-h-screen'>
            <Navbar />
            <div className='bg-transparent flex justify-center min-h-screen'>
                <div className='bg-transparent w-[90%] sm:w-[70%] md:w-[50%] xl:w-[40%] mt-15'>
                    <div className='bg-transparent flex items-center justify-between'>
                        <h1 className='text-xl font-extrabold'>รายการที่บันทึกไว้</h1>
                    </div>
                    <div className='bg-transparent flex flex-col gap-5 pb-5 mt-4'>
                        {
                            data && data?.length > 0 ? data?.map((item) => {
                                return <PlaceCard key={item.id} data={item} onSave={handleSave} />
                            })
                            
                            :
                            <h2 className='text-center mt-10 text-sm text-gray-500'>ไม่มีการบันทึกสถานที่</h2>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Save