import React, { useEffect, useState } from 'react'
import { TimePicker, ConfigProvider, DatePicker, Select, Input, Switch, Checkbox, Radio, Upload, Image, Button, message, Modal, Rate, AutoComplete } from 'antd';
import { CheckCircleOutlined, DownOutlined, EnvironmentOutlined, PlusOutlined } from '@ant-design/icons'
import axios from 'axios'

function DetailVerifyAccount({ currentData, handleVerifySuccess }) {

    const [isLoading, setIsLoading] = useState(false)

    const handleVerify = async (id) => {
        setIsLoading(true)
        try {
            console.log(id)
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user-api/verify-account-success/${id}`, { placeId: currentData?.placeId, userId: currentData?.userId }, { withCredentials: true })
                .then((res) => {
                    console.log(res.data)
                    handleVerifySuccess()
                })
        } catch (err) {
            console.log(err)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className='bg-transparent w-full'>

            <div className='bg-white py-5 px-3 rounded-lg shadow-md mt-3'>
                <div className='font-bold mb-4'>
                    ข้อมูลนักศึกษา
                </div>
                <div className='bg-white mt-4 grid gap-2'>
                    <div>
                        <div className='flex items-center gap-1'>
                            <span className='text-sm text-gray-500'>รหัสนักศึกษา</span>
                            <div className='text-red-500'>*</div>
                        </div>
                        <Input disabled value={currentData?.studentId || ''} size='large' count={{ show: true, max: 20, }} maxLength={20} placeholder="เช่น 05655020XXXX-X" />
                    </div>

                    <div>
                        <div className='flex items-center gap-1'>
                            <span className='text-sm text-gray-500'>ชื่อ-นามสกุล (ภาษาไทย)</span>
                            <div className='text-red-500'>*</div>
                        </div>
                        <Input disabled value={currentData?.fullName || ''} count={{ show: true, max: 50, }} maxLength={50} size='large' placeholder="เช่น XXXX XXXX" />
                    </div>
                    <div>
                        <div className='flex items-center gap-1'>
                            <span className='text-sm text-gray-500'>ชื่อบริษัทที่ไปฝึก (ภาษาไทย)</span>
                            <div className='text-red-500'>*</div>
                        </div>
                        <div className=''>
                            <AutoComplete
                                disabled
                                size='large'
                                style={{ width: '100%' }}
                                value={currentData?.thaiName || ''}
                                className='w-full'
                                placeholder="ค้นหาชื่อบริษัท"
                                showSearch={{
                                    filterOption: (inputValue, option) =>
                                        option.label.toUpperCase().includes(inputValue.toUpperCase()),
                                }}
                                suffix={<DownOutlined />}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className='bg-white py-5 px-3 rounded-lg shadow-md mt-3'>
                <div className='font-bold mb-4'>
                    รูปภาพเอกสาร/หลักฐาน
                </div>
                <div>
                    {
                        currentData && currentData?.imgUrl ?
                            <div className="pr-1">
                                <Image
                                    height={100}
                                    width={100}
                                    src={currentData?.imgUrl}
                                    className="h-[138px] w-full object-cover rounded-xl"
                                />
                            </div>
                            : <h2 className='text-center mt-10 text-sm text-gray-500'>ไม่ได้แนบภาพหลักฐาน</h2>
                    }
                </div>
            </div>

            <div className='flex justify-end mt-4'>
                <Button onClick={() => handleVerify(currentData?.id)} size="large" type="primary" loading={isLoading}>อนุมัติคำขอยืนยันตัวตน</Button>
            </div>
        </div>

    )
}

export default DetailVerifyAccount