import React, { useRef } from 'react'
import { FaPlus } from "react-icons/fa6";
import { useDispatch } from 'react-redux';
import { addSelectImg } from '../redux/reduxSlice/selectImgSlice';

function Addimage({w, h, icon_size}) {
    const fileRef = useRef(null)
    const dispatch = useDispatch()

    const handleClick = () => {
        fileRef.current.click()
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (!file) return;

        const imageUrl = URL.createObjectURL(file)
        dispatch(addSelectImg(imageUrl))
    }

    return (
        <div>
            <div onClick={handleClick} className={`bg-[#D9D9D9] ${w} ${h} flex justify-center items-center rounded-lg duration-150 hover:bg-gray-200`}>
                <FaPlus className={`${icon_size}`} />
            </div>
            <input ref={fileRef} className='hidden' type='file' accept='image/*' onChange={handleFileChange}/>
        </div>
    )
}

export default Addimage