import { StarFilled } from '@ant-design/icons';
import React from 'react'
import { GoHeart } from "react-icons/go";
import { FaRegBookmark } from "react-icons/fa6";
import { FaBookmark } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setSaveCount } from '../redux/reduxSlice/menuSlice';

function Postcard({ data, onSaveSuc }) {
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
      onSaveSuc()
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className='relative'>
      <div onClick={() => navigate(`/review/${data?.id}`)} className='mb-4 break-inside-avoid hover:cursor-pointer duration-200'>
        <div>
          <img className='w-full h-[138px] shadow-2xl object-cover rounded-xl filter brightness-85 duration-200 hover:brightness-50' src={data?.images[0]} />
        </div>
        <div className=''>
          <div className=''>
            <h3 className='font-bold text-md line-clamp-1'>{data?.engName}</h3>
          </div>
          <div className='flex items-center justify-between'>
            <div className='bg-transparent'>
              <h3 className='text-sm line-clamp-1 w-auto'>{data?.placeType}</h3>
            </div>
            <div className='flex gap-1 items-center'>
              <StarFilled style={{ color: '#d6960d' }} />
              <span className='text-sm'>{data?.avg_rating}</span>
            </div>
          </div>
        </div>
      </div>

      {
        data && data?.userSave?.includes(currentUser?.id) ?
          <div onClick={() => handleSave(data?.id)} className='absolute top-2 right-2 hover:cursor-pointer'>
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
          <div onClick={() => handleSave(data?.id)} className='absolute top-2 right-2 hover:cursor-pointer'>
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
  )
}

export default Postcard