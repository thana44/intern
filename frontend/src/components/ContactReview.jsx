import { EnvironmentFilled, FacebookFilled, InstagramOutlined, LinkOutlined, MailFilled, PhoneFilled } from '@ant-design/icons'
import React from 'react'
import { useSelector } from 'react-redux'

function ContactReview() {

    const reviewData = useSelector((x) => x.review.reviewData)

    return (
        <div className='bg-white py-5 px-3 rounded-lg shadow-md hover:cursor-pointer'>
            <div>
                <h1 className='text-md font-bold mb-2'>ช่องทางการติดต่อ</h1>
            </div>
            <div className='grid gap-2'>
                {
                    reviewData?.phoneNumber &&
                    <div className='flex items-center gap-2'>
                        <PhoneFilled style={{ color: 'gray' }} />
                        <h3 className='text-sm text-gray-500'>{reviewData?.phoneNumber}</h3>
                    </div>
                }
                {
                    reviewData?.email &&
                    <div className='flex items-center gap-2'>
                        <MailFilled style={{ color: 'gray' }} />
                        <h3 className='text-sm text-gray-500'>{reviewData?.email}</h3>
                    </div>
                }
                {
                    reviewData?.webSite &&
                    <a href={`https://${reviewData?.webSite}`} target="_blank" rel="noopener noreferrer">
                        <div className='flex items-center gap-2 hover:cursor-pointer hover:opacity-60 duration-200'>
                            <LinkOutlined style={{ color: 'gray' }} />
                            <h3 className='text-sm text-gray-500'>{reviewData?.webSite}</h3>
                        </div>
                    </a>
                }
                {
                    reviewData?.facebook &&
                    <a href={`https://facebook.com/${reviewData?.facebook}`} target="_blank" rel="noopener noreferrer">
                        <div className='flex items-center gap-2 hover:cursor-pointer hover:opacity-60 duration-200'>
                            <FacebookFilled style={{ color: '#065cd4' }} />
                            <h3 className='text-sm text-gray-500'>{reviewData?.facebook}</h3>
                        </div>
                    </a>
                }
                {
                    reviewData?.instagram &&
                    <a href={`https://instagram.com/${reviewData?.instagram}`} target="_blank" rel="noopener noreferrer">
                        <div className='flex items-center gap-2 hover:cursor-pointer hover:opacity-60 duration-200'>
                            <InstagramOutlined style={{ color: 'purple' }} />
                            <h3 className='text-sm text-gray-500'>{reviewData?.instagram}</h3>
                        </div>
                    </a>
                }
                <div className='flex gap-2'>
                    <div>
                        <EnvironmentFilled style={{ color: 'gray' }} />
                    </div>
                    <p className='text-sm text-gray-500'>{`${reviewData?.address}, ${reviewData?.subDistrict}, ${reviewData?.district}, ${reviewData?.province}`}</p>
                </div>
            </div>
        </div>
    )
}

export default ContactReview