import { CheckCircleFilled } from '@ant-design/icons'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

function DetailReview() {

    const reviewData = useSelector((x) => x.review.reviewData)

    // console.log(reviewData, 'test compoenent')

    return (
        <div className='bg-white py-5 px-3 rounded-lg shadow-md hover:cursor-pointer'>
            <div>
                <h1 className='text-md font-bold mb-2'>รายละเอียดงาน</h1>
            </div>
            <div>
                {
                    reviewData?.hasAllowance === 1 &&
                    <div className='flex items-center gap-2'>
                        <CheckCircleFilled style={{ color: '#5894e8' }} />
                        <h3 className='text-sm text-gray-500'>เบี้ยเลี้ยง</h3>
                    </div>
                }
                {
                    reviewData?.hasCaregiver === 1 &&
                    <div className='flex items-center gap-2'>
                        <CheckCircleFilled style={{ color: '#5894e8' }} />
                        <h3 className='text-sm text-gray-500'>พี่เลี้ยงประจำตัว</h3>
                    </div>
                }
                {
                    reviewData?.nearBts === 1 &&
                    <div className='flex items-center gap-2'>
                        <CheckCircleFilled style={{ color: '#5894e8' }} />
                        <h3 className='text-sm text-gray-500'>ติดรถไฟฟ้า</h3>
                    </div>
                }
                {
                    reviewData?.hasParking === 1 &&
                    <div className='flex items-center gap-2'>
                        <CheckCircleFilled style={{ color: '#5894e8' }} />
                        <h3 className='text-sm text-gray-500'>ที่จอดรถ</h3>
                    </div>
                }
            </div>
            <div className='mt-2'>
                <div>
                    <h3 className='text-sm text-gray-500'>วันปฏิบัติงาน : {reviewData?.workDay}</h3>
                </div>
                <div>
                    <h3 className='text-sm text-gray-500'>เวลาเริ่มงาน : {reviewData?.workTime?.split(',').join(' - ')}</h3>
                </div>
                <div>
                    <h3 className='text-sm text-gray-500'>รูปแบบการทำงาน : {reviewData?.workType}</h3>
                </div>
                <div>
                    <h3 className='text-sm text-gray-500'>การแต่งกาย : {reviewData?.dressType}</h3>
                </div>
            </div>
        </div>
    )
}

export default DetailReview