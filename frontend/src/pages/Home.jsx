import React, { useEffect, useState } from 'react'
import Postcard from '../components/Postcard'
import Masonry from "react-masonry-css";
import Menubar from '../components/Menubar';
import Navbar from '../components/Navbar'
import { RightOutlined } from '@ant-design/icons';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

function Home() {

  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('keyword');

  console.log(keyword, 'keword from home')
  const [places, setPlaces] = useState([])

  const getPlaceFilter = async () => {
    try {
      const result = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/place-api/get-filter`, {
        search: keyword
      }, { withCredentials: true })
      console.log(result.data, 'place home')
      setPlaces(result.data.data)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getPlaceFilter()
  }, [keyword])

  const handleSaveSucc = () => {
    getPlaceFilter()
  }

  return (
    <div className='bg-gray-200 min-h-screen'>
      <Navbar />
      <div className='bg-transparent flex justify-center min-h-screen'>
        <div className='bg-transparent w-[90%] sm:w-[80%] md:w-[90%] xl:w-[80%] mt-15'>

          <div className='mb-5'>
            <div className='bg-transparent flex items-center gap-1 hover:cursor-pointer hover:opacity-60 duration-200'>
              {
                keyword && keyword.length > 0 ?
                  <h1 className='text-xl font-extrabold'>กำลังค้นหา {keyword}</h1>
                  : <h1 className='text-xl font-extrabold'>สถานที่ฝึกทั้งหมด</h1>
              }
            </div>

            <div className='bg-transparent grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 mt-3'>
              {
                places && places?.length > 0 ? places.map((item) => {
                  return <Postcard key={item.id} data={item} onSaveSuc={handleSaveSucc} />
                })
                  : <h2 className='text-center mt-10 text-sm text-gray-500'>ไม่พบสถานที่ฝึกงาน</h2>
              }
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Home