import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Input } from 'antd';
import axios from 'axios'
import { useState } from 'react'

function Register() {

  const [username, setUsername] = useState()
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [confirmPassword, setConfirmPassword] = useState()

  const [isLoading, setIsLoading] = useState(false)
  const [err, setErr] = useState()

  const navigate = useNavigate()

  const handleRegister = async () => {
    setIsLoading(true)
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth-api/register`, { username, email, password, confirmPassword })
        .then((res) => {
          if (res.status === 201) {
            const { message } = res.data
            console.log(message)
            setTimeout(() => {
              return navigate('/login')
            }, 1000)
          }
        })
    } catch (err) {
      const { message } = err.response.data
      setErr(message)
      console.log(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='bg-white h-screen flex items-center justify-center'>
      <div className='bg-white w-75 sm:w-[50%] md:w-[40%] lg:w-[30%] grid gap-4'>
        <div className='text-2xl font-bold'>ลงทะเบียน</div>
        <div>
          <span className='text-sm'>ชื่อผู้ใช้</span>
          <Input onChange={(e) => setUsername(e.target.value)} count={{ show: true, max: 10, }} size='large' placeholder="ป้อนชื่อผู้ใช้" />
        </div>
        <div>
          <span className='text-sm'>อีเมล</span>
          <Input onChange={(e) => setEmail(e.target.value)} size='large' placeholder="ป้อนอีเมล" />
        </div>
        <div>
          <span className='text-sm'>รหัสผ่าน</span>
          <Input.Password onChange={(e) => setPassword(e.target.value)} size="large" placeholder="ป้อนรหัสผ่าน" />
        </div>
        <div>
          <span className='text-sm'>ยืนยันรหัสผ่าน</span>
          <Input.Password onChange={(e) => setConfirmPassword(e.target.value)} size="large" placeholder="ป้อนยืนยันรหัสผ่าน" />
        </div>
        {
          err && <div className='flex items-center justify-center'><span className='text-red-400'>{err}</span></div>
        }
        <div className='mt-3'>
          <Button onClick={handleRegister} className='w-full' size="large" type="primary" loading={isLoading}>สมัครสมาชิก</Button>
        </div>
        <div className='flex justify-center items-center gap-2'>
          <div className='text-sm'>
            มีบัญชีอยู่แล้ว?
          </div>
          <Link to={'/login'}>
            <div className='text-sm text-blue-500 duration-200 hover:text-blue-300 hover:cursor-pointer'>เข้าสู่ระบบ</div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Register