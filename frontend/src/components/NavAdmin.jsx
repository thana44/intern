import { HomeOutlined } from '@ant-design/icons'
import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import { clearCurrentUser, setCurrentUser } from '../redux/reduxSlice/userSlice'

function NavAdmin() {
    const location = useLocation()
    const dispatch = useDispatch()
    const currentUser = useSelector((x) => x.user.currentUser)
    const handleCurrentUser = async () => {
        try {
            await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth-api/get-current-user`, { withCredentials: true })
                .then((res) => {
                    console.log(res.data)
                    dispatch(setCurrentUser(res.data))
                })
        } catch (err) {
            dispatch(clearCurrentUser(null))
            console.log(err)
        }
    }

    useEffect(() => {
        handleCurrentUser()
    }, [location.pathname])

    return (
        <div className='bg-white h-15 flex items-center justify-between px-2 border border-gray-300 border-x-0 border-t-0'>
            <div className='bg-white flex items-center gap-2'>
                <img className='w-8 h-8 object-cover rounded-full' src={currentUser?.profileImg} />
                <div>
                    <span className='text-sm'>{currentUser?.username}</span>
                </div>
            </div>
            <Link to={'/'}>
                <div className='text-xl'>
                    <HomeOutlined />
                </div>
            </Link>
        </div>
    )
}

export default NavAdmin