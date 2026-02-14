import React from 'react'
import { Button, Input } from 'antd';
import googleLogo from '../assets/googleLogo.svg'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'

function Login() {

    const [username, setUsername] = useState()
    const [password, setPassword] = useState()

    const [err, setErr] = useState()
    const [isLoading, setIsLoading] = useState(false)

    const navigate = useNavigate()

    const handleLogin = async () => {
        setIsLoading(true)
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth-api/login`, { username, password }, { withCredentials: true })
                .then((res) => {
                    const { message } = res.data
                    console.log(message)
                    setTimeout(() => {
                        return navigate('/')
                    }, 1500)
                })
        } catch (err) {
            const { message } = err.response.data
            setErr(message)
            console.log(message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleGoogleLogin = async () => {
        window.open(`${import.meta.env.VITE_BACKEND_URL}/auth-api/auth/google`, '_self')
    }

    return (
        <div className='bg-white h-screen flex items-center justify-center'>
            <div className='bg-white w-75 sm:w-[50%] md:w-[40%] lg:w-[30%] grid gap-4'>
                <div className='text-2xl font-bold'>ลงชื่อเข้าใช้</div>
                <div>
                    <span className='text-sm'>ชื่อผู้ใช้</span>
                    <Input onChange={(e) => setUsername(e.target.value)} size='large' placeholder="ป้อนชื่อผู้ใช้" />
                </div>
                <div>
                    <span className='text-sm'>รหัสผ่าน</span>
                    <Input.Password onChange={(e) => setPassword(e.target.value)} size="large" placeholder="ป้อนรหัสผ่าน" />
                </div>
                {/* <div className='flex justify-end'>
                    <div className='text-sm text-blue-500 duration-200 hover:text-blue-300 hover:cursor-pointer'>ลืมรหัสผ่าน?</div>
                </div> */}
                {
                    err && <div className='flex items-center justify-center'><span className='text-red-400'>{err}</span></div>
                }
                <div>
                    <Button onClick={handleLogin} className='w-full' size="large" type="primary" loading={isLoading}>เข้าสู่ระบบ</Button>
                </div>
                <div className='border-2 border-white border-b-gray-200 relative my-2'>
                    <div className='bg-white absolute left-1/2 -translate-x-1/2 px-2 -top-3 text-gray-500'>หรือ</div>
                </div>
                <div>
                    <Button onClick={handleGoogleLogin} className='w-full' size="large" color="default" variant="solid">
                        <img className='w-5' src={googleLogo} alt='google' />
                        เข้าสู่ระบบด้วย Google
                    </Button>
                </div>
                <div className='flex justify-center items-center gap-2'>
                    <div className='text-sm'>
                        ไม่มีบัญชีใช่ไหม?
                    </div>
                    <Link to={'/register'}>
                        <div className='text-sm text-blue-500 duration-200 hover:text-blue-300 hover:cursor-pointer'>ลงทะเบียน</div>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Login