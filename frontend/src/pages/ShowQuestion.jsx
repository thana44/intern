import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { Button, Collapse } from 'antd';
import axios from 'axios';

function ShowQuestion() {

  const [question, setQuestion] = useState([])

  const getShowQuestion = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_BACKEND_URL}/question-api/getshow-question`, { withCredentials: true })
        .then((res) => {
          console.log(res.data, 'this is question')
          setQuestion(res.data.result)
        })
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getShowQuestion()
  }, [])

  const items = question.map((question, index) => ({
    key: index.toString(),
    label: question.title,
    children: <p>{question.answer}</p>,
  }))

  return (
    <div className='bg-gray-200 min-h-screen'>
      <Navbar />
      <div className='bg-transparent flex justify-center min-h-screen'>
        <div className='bg-transparent w-[90%] sm:w-[80%] md:w-[90%] xl:w-[80%] mt-15 flex justify-center'>
          <div className='bg-transparent w-full sm:w-[90%] md:w-[80%] lg:w-[60%] pb-20'>
            <div className='flex items-center justify-between'>
              <div>
                <h3 className='text-xl font-extrabold'>คำถาม/คำตอบ</h3>
              </div>
            </div>
            <div className='bg-white py-5 px-5 rounded-lg shadow-md mt-3'>
              {
                items?.length > 0 ?
                  <Collapse items={items} />
                  :
                  <h2 className='text-center mt-10 text-sm text-gray-500'>ไม่พบคำถามและคำตอบ</h2>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShowQuestion