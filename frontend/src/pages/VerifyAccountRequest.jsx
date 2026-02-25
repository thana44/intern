import React, { useEffect, useState } from 'react'
import { TimePicker, ConfigProvider, DatePicker, Select, Input, Switch, Checkbox, Radio, Upload, Image, Button, message, Modal, Rate, AutoComplete } from 'antd';
import { CheckCircleOutlined, DownOutlined, EnvironmentOutlined, PlusOutlined } from '@ant-design/icons'
import axios from 'axios'
import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const { RangePicker } = TimePicker;
const getBase64 = file =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

function VerifyAccountRequest() {

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState([]);
    const navigate = useNavigate()
    const currentUser = useSelector((x) => x.user.currentUser)

    const handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };
    const handleChangeImg = ({ fileList: newFileList }) => setFileList(newFileList);
    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>อัพโหลด</div>
        </button>
    )

    const [isLoading, setIsLoading] = useState(false)

    // console.log(fileList, 'test filelist')

    const handleSendRequest = async () => {
        if (!studentId?.trim() || !fullName?.trim() || !selectId) {
            return message.error("กรุณากรอกข้อมูลให้ครบ")
        }
        setIsLoading(true)
        try {
            const formData = new FormData()
            fileList.forEach((file) => {
                formData.append("images", file.originFileObj)
            })
            formData.append("studentId", studentId)
            formData.append("fullName", fullName)
            formData.append("placeId", selectId)

            const result = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user-api/send-request-verify-account`, formData, { withCredentials: true })
            setStudentId('')
            setFullName('')
            setDisplayValue("")
            setSelectId(null)
            setFileList([])
            setModalOpen(true)
            // console.log(result.data, 'test data')

        } catch (err) {
            console.log(err)
            message.error(err.response.data.message)
        } finally {
            setIsLoading(false)
        }
    }
    const [studentId, setStudentId] = useState('')
    const [fullName, setFullName] = useState('')
    const [modalOpen, setModalOpen] = useState(false)

    // console.log(studentId, 'studentId')
    // console.log(fullName, 'fullName')

    useEffect(() => {
        if (currentUser?.verifyAccount === 1) {
            return navigate('/')
        }
    }, [currentUser?.verifyAccount])

    const [options, setOptions] = useState([])
    const [selectId, setSelectId] = useState(null)
    const [displayValue, setDisplayValue] = useState('')

    const getPlaceSelect = async () => {
        try {
            await axios.get(`${import.meta.env.VITE_BACKEND_URL}/place-api/get-select`, { withCredentials: true })
                .then((res) => {
                    // console.log(res.data, 'place select')
                    setOptions(res.data.place)
                })
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getPlaceSelect()
    }, [])

    // console.log(selectId, 'id from place select')

    return (
        <div className='bg-gray-200 min-h-screen'>
            <Navbar />
            <div className='bg-transparent flex justify-center min-h-screen'>
                <div className='bg-transparent w-[90%] sm:w-[80%] md:w-[90%] xl:w-[80%] mt-15 flex justify-center'>
                    <div className='bg-transparent w-full sm:w-[90%] md:w-[80%] lg:w-[60%] pb-20'>
                        <div className='flex items-center justify-between'>
                            <div>
                                <h3 className='text-xl font-extrabold'>ยืนยันตัวตน</h3>
                            </div>
                        </div>

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
                                        <Input value={studentId || ''} onChange={(e) => setStudentId(e.target.value)} size='large' count={{ show: true, max: 20, }} maxLength={20} placeholder="เช่น 05655020XXXX-X" />
                                    </div>

                                    <div>
                                        <div className='flex items-center gap-1'>
                                            <span className='text-sm text-gray-500'>ชื่อ-นามสกุล (ภาษาไทย)</span>
                                            <div className='text-red-500'>*</div>
                                        </div>
                                        <Input value={fullName || ''} onChange={(e) => setFullName(e.target.value)} count={{ show: true, max: 50, }} maxLength={50} size='large' placeholder="เช่น XXXX XXXX" />
                                    </div>
                                    <div>
                                        <div className='flex items-center gap-1'>
                                            <span className='text-sm text-gray-500'>ชื่อบริษัทที่ไปฝึก (ภาษาไทย)</span>
                                            <div className='text-red-500'>*</div>
                                        </div>
                                        <div className=''>
                                            <AutoComplete
                                                size='large'
                                                style={{ width: '100%' }}
                                                value={displayValue}
                                                className='w-full'
                                                options={options}
                                                placeholder="ค้นหาชื่อบริษัท"
                                                showSearch={{
                                                    filterOption: (inputValue, option) =>
                                                        option.label.toUpperCase().includes(inputValue.toUpperCase()),
                                                }}
                                                suffix={<DownOutlined />}
                                                onSelect={(value, option) => {
                                                    setSelectId(value)        //id
                                                    setDisplayValue(option.label) //name
                                                }}
                                                onChange={(text) => {
                                                    setDisplayValue(text)
                                                    setSelectId(null) // ถ้าพิมพ์เองโดยไม่เลือก จะไม่ให้มี id
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='bg-white py-5 px-3 rounded-lg shadow-md mt-3'>
                                <div className='font-bold mb-4'>
                                    รูปภาพเอกสาร/หลักฐาน (ไม่บังคับ)
                                </div>
                                <div>
                                    <Upload
                                        listType="picture-card"
                                        fileList={fileList}
                                        beforeUpload={() => false}
                                        onPreview={handlePreview}
                                        onChange={handleChangeImg}
                                        maxCount={1}
                                    >
                                        {fileList.length >= 1 ? null : uploadButton}
                                    </Upload>
                                    {previewImage && (
                                        <Image
                                            styles={{ root: { display: 'none' } }}
                                            preview={{
                                                open: previewOpen,
                                                onOpenChange: visible => setPreviewOpen(visible),
                                                afterOpenChange: visible => !visible && setPreviewImage(''),
                                            }}
                                            src={previewImage}
                                        />
                                    )}
                                </div>
                            </div>

                            <div className='flex justify-end mt-4'>
                                <Button onClick={handleSendRequest} size="large" type="primary" loading={isLoading}>ส่งคำขอยืนยันตัวตน</Button>
                            </div>

                            <Modal
                                title="คำขอยืนยันตัวตน"
                                centered
                                open={modalOpen}
                                closable={false}
                                footer={null}
                            >
                                <div className='grid gap-3'>
                                    <div className='flex flex-col justify-center items-center gap-3'>
                                        <div className='text-6xl text-green-500'>
                                            <CheckCircleOutlined />
                                        </div>
                                        <div>
                                            คำขอยืนยันตัวตนของคุณถูกส่งแล้ว โปรดรอการตรวจสอบจากผู้ดูแลระบบ
                                        </div>
                                    </div>
                                    <div className='mt-3'>
                                        <Button onClick={() => navigate('/')} className='w-full' size="large" type="primary" loading={''}>กลับหน้าหลัก</Button>
                                    </div>
                                </div>
                            </Modal>

                        </div>

                    </div>
                </div>
            </div>
        </div>

    )
}

export default VerifyAccountRequest