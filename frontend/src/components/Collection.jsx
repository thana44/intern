import { DeleteOutlined } from '@ant-design/icons'
import React from 'react'

function Collection() {
    return (
        <div className='bg-white py-5 px-3 rounded-lg md:shadow-md'>
            <div className='bg-gray-200 px-2 py-1 rounded-md text-gray-500'>
                รายการโปรด
            </div>
            <div className='bg-white px-2 py-1 rounded-md text-gray-500 flex items-center justify-between'>
                <div>
                    ใกล้รถไฟฟ้า
                </div>
                <div>
                    <DeleteOutlined />
                </div>
            </div>
            <div className='bg-white px-2 py-1 rounded-md text-gray-500 flex items-center justify-between'>
                <div>
                    ได้เบี้ยเลี้ยง
                </div>
                <div>
                    <DeleteOutlined />
                </div>
            </div>
            <div className='bg-white px-2 py-1 rounded-md text-gray-500 flex items-center justify-between'>
                <div>
                    ใกล้ที่อยู่
                </div>
                <div>
                    <DeleteOutlined />
                </div>
            </div>
        </div>
    )
}

export default Collection