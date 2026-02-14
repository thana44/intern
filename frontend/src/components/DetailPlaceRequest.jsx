import React, { useEffect, useState } from 'react'
import { TimePicker, ConfigProvider, DatePicker, Select, Input, Switch, Checkbox, Radio, Upload, Image, Button, message, Modal } from 'antd';
import { CheckCircleOutlined, PlusOutlined } from '@ant-design/icons'
import axios from 'axios'
import dayjs from "dayjs"

const { RangePicker } = TimePicker;
const getBase64 = file =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

function DetailPlaceRequest({ placeRequestId, onSuccess, userId, detailKey }) {

    const handleChange = value => {
        console.log(`เลือกประเภทองค์กร ${value}`);
        setPlaceType(value)
    };


    // const onChangeCheckBox = checkedValues => {
    //     console.log('checked = ', checkedValues);
    // };

    // const onChangeTime = (values, formatStrings) => {
    //     if (!values) return;

    //     const [start, end] = formatStrings;

    //     console.log("Start:", start);
    //     console.log("End:", end);
    //     setWorkTime([start, end])
    // }
    const onChangeTime = (values) => {
        setWorkTime(values) // ✅ values = [dayjs, dayjs]
    }
    // if (workTime) {
    //     formData.append(
    //         "workTime",
    //         `${workTime[0].format("HH:mm")},${workTime[1].format("HH:mm")}`
    //     )
    // }

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState([]);
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

    const [placeTypeOption, setPlaceTypeOption] = useState([])

    const getPlaceTypeSelect = async () => {
        try {
            await axios.get(`${import.meta.env.VITE_BACKEND_URL}/place-type-api/get-place-type-select`)
                .then((res) => {
                    console.log(res.data)
                    setPlaceTypeOption(res.data.placeType)
                })
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getPlaceTypeSelect()
    }, [])

    const [thaiName, setThaiName] = useState('')
    const [engName, setEngName] = useState('')
    const [placeType, setPlaceType] = useState('')
    const [address, setAddress] = useState('')
    const [province, setProvince] = useState('')
    const [district, setDistrict] = useState('')
    const [subDistrict, setSubDistrict] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [email, setEmail] = useState('')
    const [webSite, setWebSite] = useState('')
    const [facebook, setFacebook] = useState('')
    const [instagram, setInstagram] = useState('')
    const [hasAllowance, setHasAllowance] = useState(false)
    const [hasCaregiver, setHasCaregiver] = useState(false)
    const [nearBts, setNearBts] = useState(false)
    const [hasParking, setHasParking] = useState(false)
    const [workDay, setWorkDay] = useState([])
    const [workTime, setWorkTime] = useState(null)
    const [workType, setWorkType] = useState('')
    const [dressType, setDressType] = useState('')

    const [isLoading, setIsLoading] = useState(false)


    // console.log(thaiName)
    // console.log(engName)
    // console.log(placeType)
    // console.log(address)
    // console.log(province)
    // console.log(district)
    // console.log(subDistrict)
    // console.log(phoneNumber)
    // console.log(email)
    // console.log(webSite)
    // console.log(facebook)
    // console.log(instagram)
    console.log(placeType, 'switch เบี้ยเลี้ยง')


    console.log(placeRequestId, 'place request id')

    const getPlaceRequestId = async (id) => {
        try {
            await axios.get(`${import.meta.env.VITE_BACKEND_URL}/placeRequest-api/get-placeRequest/${id}`, { withCredentials: true })
                .then((res) => {
                    console.log(res.data, ' testttt')
                    setThaiName(res.data.placeRequest.thaiName)
                    setEngName(res.data.placeRequest.engName)
                    setPlaceType(res.data.placeRequest.placeTypeId)
                    setAddress(res.data.placeRequest.address)
                    setProvince(res.data.placeRequest.province)
                    setDistrict(res.data.placeRequest.district)
                    setSubDistrict(res.data.placeRequest.subDistrict)
                    setPhoneNumber(res.data.placeRequest.phoneNumber)
                    setEmail(res.data.placeRequest.email)
                    setWebSite(res.data.placeRequest.webSite)
                    setFacebook(res.data.placeRequest.facebook)
                    setInstagram(res.data.placeRequest.instagram)
                    setHasAllowance(res.data.placeRequest.hasAllowance === 1 ? true : false)
                    setHasCaregiver(res.data.placeRequest.hasCaregiver === 1 ? true : false)
                    setNearBts(res.data.placeRequest.nearBts === 1 ? true : false)
                    setHasParking(res.data.placeRequest.hasParking === 1 ? true : false)
                    setWorkDay(res.data.placeRequest.workDay)

                    const wTime = res.data.placeRequest.workTime.split(',')
                    setWorkTime([
                        dayjs(wTime[0], "HH:mm"),
                        dayjs(wTime[1], "HH:mm")
                    ])

                    setWorkType(res.data.placeRequest.workType)
                    setDressType(res.data.placeRequest.dressType)
                })
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        if (placeRequestId) {
            getPlaceRequestId(placeRequestId)
        }
    }, [placeRequestId, detailKey])

    console.log(workTime, 'worktime')

    const [newProvince, setNewProvince] = useState('')
    const [provinceOption, setProvinceOption] = useState([])
    const [newDistrict, setNewDistrict] = useState('')
    const [districtOption, setDistrictOption] = useState([])

    const getProvinceSelect = async () => {
        try {
            await axios.get(`${import.meta.env.VITE_BACKEND_URL}/province-api/get-select`, { withCredentials: true })
                .then((res) => {
                    setProvinceOption(res.data.province)
                })
        } catch (err) {
            console.log(err)
        }
    }
    useEffect(() => {
        getProvinceSelect()
    }, [])

    const getDistrictSelect = async () => {
        try {
            await axios.get(`${import.meta.env.VITE_BACKEND_URL}/district-api/get-select/${newProvince}`, { withCredentials: true })
                .then((res) => {
                    setDistrictOption(res.data.district)
                })
        } catch (err) {
            console.log(err)
        }
    }
    useEffect(() => {
        getDistrictSelect()
        setNewDistrict('')
    }, [newProvince])

    const getImage = async () => {
        try {
            await axios.get(`${import.meta.env.VITE_BACKEND_URL}/image-api/get-image-place-request/${placeRequestId}`, { withCredentials: true })
                .then((res) => {
                    console.log(res.data, 'image')
                    if (res.data.result.length > 0) {
                        const oldImages = res.data.result.map(img => ({
                            uid: `old-${img.id}`,
                            name: `image-${img.id}`,
                            status: 'done',
                            url: img.imgUrl,
                            imageId: img.id,          // ใช้แยกรูปเก่า
                            publicId: img.publicId    // ใช้ลบ cloudinary
                        }))

                        setFileList(oldImages)
                    }
                })
        } catch (err) {
            console.log(err)
        }
    }
    useEffect(() => {
        getImage()
        setDeletedImages([])
    }, [placeRequestId, detailKey])

    console.log(fileList, 'test filelist')

    const [deletedImages, setDeletedImages] = useState([])
    const [latitude, setLatitude] = useState('')
    const [longitude, setLongitude] = useState('')
    const [newWorkDay, setNewWorkDay] = useState('')
    console.log(deletedImages, 'image deleted')

    const handleCreatePlace = async () => {
        setIsLoading(true)
        try {
            const newImages = fileList.filter(f => f.originFileObj)
            const keepOldImages = fileList.filter(f => f.imageId)
            const formData = new FormData()
            newImages.forEach((file) => {
                formData.append("newImages", file.originFileObj)
            })
            formData.append(
                "keepOldImages",
                JSON.stringify(keepOldImages.map(img => ({
                    id: img.imageId,
                    publicId: img.publicId
                }))))
            formData.append(
                "deletedImages",
                JSON.stringify(deletedImages.map(img => ({
                    id: img.imageId,
                    publicId: img.publicId
                }))))
            formData.append("placeRequestId", placeRequestId)
            formData.append("userId", userId)
            formData.append("thaiName", thaiName)
            formData.append("engName", engName)
            formData.append("placeType", placeType)
            formData.append("address", address)
            formData.append("province", newProvince)
            formData.append("district", newDistrict)
            formData.append("latitude", latitude)
            formData.append("longitude", longitude)
            formData.append("subDistrict", subDistrict)
            formData.append("phoneNumber", phoneNumber)
            formData.append("email", email)
            formData.append("webSite", webSite)
            formData.append("facebook", facebook)
            formData.append("instagram", instagram)
            formData.append("hasAllowance", hasAllowance)
            formData.append("hasCaregiver", hasCaregiver)
            formData.append("nearBts", nearBts)
            formData.append("hasParking", hasParking)
            formData.append("workDay", newWorkDay)
            if (workTime) {
                formData.append(
                    "workTime",
                    `${workTime[0].format("HH:mm")},${workTime[1].format("HH:mm")}`
                )
            }
            formData.append("workType", workType)
            formData.append("dressType", dressType)

            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/place-api/create`, formData, { withCredentials: true })
                .then((res) => {
                    console.log(res.data, 'data from place create')
                    onSuccess()
                    // setModalOpen(true)
                })
        } catch (err) {
            console.log(err)
            message.error(err.response.data.message)
        } finally {
            setIsLoading(false)
        }
    }

    console.log(userId, 'test userId')


    return (
        <div className='bg-transparent w-full'>
            <div className='bg-white py-5 px-3 rounded-lg shadow-md mt-3'>
                <div className='font-bold mb-4'>
                    ข้อมูลพื้นฐาน
                </div>
                <div className='bg-white mt-4 grid gap-2'>
                    <div>
                        <div className='flex items-center gap-1'>
                            <span className='text-sm text-gray-500'>ชื่อบริษัท (ภาษาไทย)</span>
                            <div className='text-red-500'>*</div>
                        </div>
                        <Input value={thaiName || ''} onChange={(e) => setThaiName(e.target.value)} count={{ show: true, max: 100, }} maxLength={100} size='large' placeholder="ชื่อบริษัท" />
                    </div>
                    <div>
                        <div className='flex items-center gap-1'>
                            <span className='text-sm text-gray-500'>ชื่อบริษัท (ภาษาอังกฤษ)</span>
                            <div className='text-red-500'>*</div>
                        </div>
                        <Input value={engName || ''} onChange={(e) => setEngName(e.target.value)} count={{ show: true, max: 100, }} maxLength={100} size='large' placeholder="ชื่อบริษัท" />
                    </div>
                    <div>
                        <div className='flex items-center gap-1'>
                            <span className='text-sm text-gray-500'>ประเภทองค์กร</span>
                            <div className='text-red-500'>*</div>
                        </div>
                        <div>
                            <Select
                                size='large'
                                placeholder='ประเภทองค์กร'
                                style={{ width: 190 }}
                                value={placeType}
                                onChange={handleChange}
                                options={placeTypeOption}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className='bg-white py-5 px-3 rounded-lg shadow-md mt-3'>
                <div className='font-bold mb-4'>
                    ที่อยู่
                </div>
                <div className='bg-white mt-4 grid gap-2'>
                    <div>
                        <div className='flex items-center gap-1'>
                            <span className='text-sm text-gray-500'>ที่อยู่</span>
                            <div className='text-red-500'>*</div>
                        </div>
                        <Input value={address || ''} onChange={(e) => setAddress(e.target.value)} size='large' count={{ show: true, max: 100, }} maxLength={100} placeholder="รายละเอียดที่อยู่ เช่นบ้านเลขที่ หรือ ชื่อถนน" />
                    </div>
                    <div>
                        <div className='flex items-center gap-1'>
                            <span className='text-sm text-gray-500'>จังหวัด</span>
                            <div className='text-red-500'>*</div>
                        </div>
                        <div className='text-red-500'>
                            ข้อมูลที่แนบมา {province}
                        </div>
                        <div>
                            <Select
                                size='large'
                                placeholder='เลือกจังหวัด'
                                style={{ width: '100%' }}
                                onChange={(value) => setNewProvince(value)}
                                options={provinceOption}
                            />
                        </div>
                    </div>
                    <div>
                        <div className='flex items-center gap-1'>
                            <span className='text-sm text-gray-500'>เขต/อำเภอ</span>
                            <div className='text-red-500'>*</div>
                        </div>
                        <div className='text-red-500'>
                            ข้อมูลที่แนบมา {district}
                        </div>
                        <div>
                            <Select
                                size='large'
                                placeholder='เลือกเขต/อำเภอ'
                                style={{ width: '100%' }}
                                value={newDistrict ? newDistrict : null}
                                onChange={(value) => setNewDistrict(value)}
                                options={districtOption}
                            />
                        </div>
                    </div>
                    <div>
                        <div className='flex items-center gap-1'>
                            <span className='text-sm text-gray-500'>แขวง/ตำบล</span>
                            <div className='text-red-500'>*</div>
                        </div>
                        <Input value={subDistrict || ''} onChange={(e) => setSubDistrict(e.target.value)} count={{ show: true, max: 100, }} maxLength={100} size='large' placeholder="เช่น แขวงบางอ้อ" />
                    </div>
                    <div>
                        <div className='flex items-center gap-1'>
                            <span className='text-sm text-gray-500'>ตำแหน่งบนแผนที่</span>
                            <div className='text-red-500'>*</div>
                        </div>
                        <div className='grid grid-cols-2 gap-3'>
                            <div>
                                <span className='text-sm text-gray-500'>ละติจูด</span>
                                <Input onChange={(e) => setLatitude(e.target.value)} count={{ show: true, max: 20, }} maxLength={20} size='large' placeholder="ตำแหน่งละติจูด" />
                            </div>
                            <div>
                                <span className='text-sm text-gray-500'>ลองติจุด</span>
                                <Input onChange={(e) => setLongitude(e.target.value)} count={{ show: true, max: 20, }} maxLength={20} size='large' placeholder="ตำแหน่งลองติจูด" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='bg-white py-5 px-3 rounded-lg shadow-md mt-3'>
                <div className='font-bold mb-4'>
                    ข้อมูลติดต่อ
                </div>
                <div className='bg-white mt-4 grid gap-2'>
                    <div>
                        <span className='text-sm text-gray-500'>เบอร์โทรศัพท์</span>
                        <Input value={phoneNumber || ''} onChange={(e) => setPhoneNumber(e.target.value)} count={{ show: true, max: 10, }} maxLength={10} size='large' placeholder="เบอร์โทรศัพท์" />
                    </div>
                    <div>
                        <span className='text-sm text-gray-500'>อีเมล</span>
                        <Input value={email || ''} onChange={(e) => setEmail(e.target.value)} count={{ show: true, max: 100, }} maxLength={100} size='large' placeholder="อีเมล" />
                    </div>
                    <div>
                        <span className='text-sm text-gray-500'>เว็บไซต์</span>
                        <Input value={webSite || ''} onChange={(e) => setWebSite(e.target.value)} count={{ show: true, max: 100, }} maxLength={100} size='large' placeholder="ชื่อเว็บไซต์" />
                    </div>
                    <div className='grid grid-cols-2 gap-3'>
                        <div>
                            <span className='text-sm text-gray-500'>Facebook</span>
                            <Input value={facebook || ''} onChange={(e) => setFacebook(e.target.value)} count={{ show: true, max: 100, }} maxLength={100} size='large' placeholder="ชื่อ Facebook" />
                        </div>
                        <div>
                            <span className='text-sm text-gray-500'>Instagram</span>
                            <Input value={instagram || ''} onChange={(e) => setInstagram(e.target.value)} count={{ show: true, max: 100, }} maxLength={100} size='large' placeholder="ชื่อ Instagram" />
                        </div>
                    </div>
                </div>
            </div>

            <div className='bg-white py-5 px-3 rounded-lg shadow-md mt-3'>
                <div className='font-bold mb-4'>
                    ข้อมูลเพิ่มเติม
                </div>
                <div className='bg-white mt-4 grid gap-2'>
                    <div className='flex items-center gap-2'>
                        <div>
                            <Switch value={hasAllowance} onChange={(value) => setHasAllowance(value)} />
                        </div>
                        <div>
                            <h3 className='text-gray-500 text-sm'>ได้เบี้ยเลี้ยง</h3>
                        </div>
                    </div>
                    <div className='flex items-center gap-2'>
                        <div>
                            <Switch value={hasCaregiver} onChange={(value) => setHasCaregiver(value)} />
                        </div>
                        <div>
                            <h3 className='text-gray-500 text-sm'>มีพี่เลี้ยงประจำตัว</h3>
                        </div>
                    </div>
                    <div className='flex items-center gap-2'>
                        <div>
                            <Switch value={nearBts} onChange={(value) => setNearBts(value)} />
                        </div>
                        <div>
                            <h3 className='text-gray-500 text-sm'>ติดสถานีรถไฟฟ้า</h3>
                        </div>
                    </div>
                    <div className='flex items-center gap-2'>
                        <div>
                            <Switch value={hasParking} onChange={(value) => setHasParking(value)} />
                        </div>
                        <div>
                            <h3 className='text-gray-500 text-sm'>ที่จอดรถ</h3>
                        </div>
                    </div>
                    <div className='mt-3'>
                        <div className='flex items-center gap-1'>
                            <span className='text-sm text-gray-500'>วันปฏิบัติงาน</span>
                            <div className='text-red-500'>*</div>
                        </div>
                        <div className='mt-3'>
                            {/* <Checkbox.Group
                                className="flex flex-col gap-2 big-checkbox"
                                options={plainOptions}
                                onChange={(value) => setWorkDay(value)} /> */}
                            <div className='text-red-500'>
                                ข้อมูลที่แนบมา {workDay}
                            </div>
                            <div>
                                <Input onChange={(e) => setNewWorkDay(e.target.value)} count={{ show: true, max: 50, }} maxLength={50} size='large' placeholder="เช่น ทุกวัน/จันทร์-ศุกร์" />
                            </div>
                        </div>
                    </div>
                    <div className='mt-3'>
                        <div className='flex items-center gap-1'>
                            <span className='text-sm text-gray-500'>เวลาเริ่มงาน</span>
                            <div className='text-red-500'>*</div>
                        </div>
                        <div className='mt-3'>
                            <RangePicker
                                format="HH:mm"
                                value={workTime}
                                minuteStep={5}
                                placeholder={["เวลาเริ่มงาน", "เวลาเลิกงาน"]}
                                onChange={onChangeTime}
                            />
                        </div>
                    </div>
                    <div className='mt-3'>
                        <div className='flex items-center gap-1'>
                            <span className='text-sm text-gray-500'>รูปแบบการทำงาน</span>
                            <div className='text-red-500'>*</div>
                        </div>
                        <div className='mt-3'>
                            <div>
                                <Radio.Group
                                    className='big-radio'
                                    onChange={(e) => setWorkType(e.target.value)}
                                    value={workType}
                                    options={[
                                        { value: 'ออนไลน์', label: 'ออนไลน์' },
                                        { value: 'ออนไซต์', label: 'ออนไซต์' },
                                        { value: 'ไฮบริด', label: 'ไฮบริด' },
                                    ]}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='mt-3'>
                        <div className='flex items-center gap-1'>
                            <span className='text-sm text-gray-500'>รูปแบบการแต่งกาย</span>
                            <div className='text-red-500'>*</div>
                        </div>
                        <div className='mt-3'>
                            <div>
                                <Radio.Group
                                    className='big-radio'
                                    onChange={(e) => setDressType(e.target.value)}
                                    value={dressType}
                                    options={[
                                        { value: 'ชุดนักศึกษา', label: 'ชุดนักศึกษา' },
                                        { value: 'ชุดลำลองสุภาพ', label: 'ชุดลำลองสุภาพ' },
                                        { value: 'ชุดยูนิฟอร์มของสถานที่ฝึก', label: 'ชุดยูนิฟอร์มของสถานที่ฝึก' },
                                    ]}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='bg-white py-5 px-3 rounded-lg shadow-md mt-3'>
                <div className='font-bold mb-4'>
                    รูปสถานที่ฝึกสหกิจ
                </div>
                <div>
                    <Upload
                        listType="picture-card"
                        fileList={fileList}
                        beforeUpload={() => false}
                        onPreview={handlePreview}
                        onChange={handleChangeImg}
                        onRemove={(file) => {
                            // mark ว่ารูปนี้ถูกลบ
                            if (file.imageId) {
                                setDeletedImages(prev => [...prev, file])
                            }
                        }}
                        maxCount={10}
                    >
                        {fileList.length >= 10 ? null : uploadButton}
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
                <Button onClick={handleCreatePlace} style={{ width: 150 }} size="large" type="primary" loading={isLoading}>อนุมัติคำขอ</Button>
            </div>

        </div>
    )
}

export default DetailPlaceRequest