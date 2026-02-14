import React, { useEffect, useState } from 'react'
import { TimePicker, ConfigProvider, DatePicker, Select, Input, Switch, Checkbox, Radio, Upload, Image, Button, message, Modal } from 'antd';
import { CheckCircleOutlined, PlusOutlined } from '@ant-design/icons'
import axios from 'axios'
import dayjs from "dayjs"

const { RangePicker } = TimePicker;

function DetailPlaceRequestEdit({ placeId, onSuccess, placeRequestEditId, detailKey, userId }) {

    const handleChange = value => {
        console.log(`เลือกประเภทองค์กร ${value}`);
        setNewPlaceType(value)
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
        setNewWorkTime(values) // ✅ values = [dayjs, dayjs]
    }
    // if (workTime) {
    //     formData.append(
    //         "workTime",
    //         `${workTime[0].format("HH:mm")},${workTime[1].format("HH:mm")}`
    //     )
    // }

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

    const [newThaiName, setNewThaiName] = useState('')
    const [newEngName, setNewEngName] = useState('')
    const [newPlaceType, setNewPlaceType] = useState('')
    const [newAddress, setNewAddress] = useState('')
    const [newProvince, setNewProvince] = useState('')
    const [newDistrict, setNewDistrict] = useState('')
    const [newSubDistrict, setNewSubDistrict] = useState('')
    const [newPhoneNumber, setNewPhoneNumber] = useState('')
    const [newEmail, setNewEmail] = useState('')
    const [newWebSite, setNewWebSite] = useState('')
    const [newFacebook, setNewFacebook] = useState('')
    const [newInstagram, setNewInstagram] = useState('')
    const [newHasAllowance, setNewHasAllowance] = useState(false)
    const [newHasCaregiver, setNewHasCaregiver] = useState(false)
    const [newNearBts, setNewNearBts] = useState(false)
    const [NewHasParking, setNewHasParking] = useState(false)
    const [newWorkDay, setNewWorkDay] = useState([])
    const [newWorkTime, setNewWorkTime] = useState(null)
    const [newWorkType, setNewWorkType] = useState('')
    const [newDressType, setNewDressType] = useState('')

    const [isLoading, setIsLoading] = useState(false)

    const [provinceOption, setProvinceOption] = useState([])
    const [districtOption, setDistrictOption] = useState([])


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


    console.log(placeId, 'edit palce id')

    const getPlaceRequestEditId = async (id) => {
        try {
            await axios.get(`${import.meta.env.VITE_BACKEND_URL}/placeRequest-api/get-placeRequestEdit/${id}`, { withCredentials: true })
                .then((res) => {
                    console.log(res.data, ' ข้อมูลที่แนบ')
                    setThaiName(res.data.placeRequest.thaiName)
                    setEngName(res.data.placeRequest.engName)
                    setPlaceType(res.data.placeRequest.placeType)
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
                    setWorkTime(res.data.placeRequest.workTime)

                    // const wTime = res.data.placeRequest.workTime.split(',')
                    // setWorkTime([
                    //     dayjs(wTime[0], "HH:mm"),
                    //     dayjs(wTime[1], "HH:mm")
                    // ])

                    setWorkType(res.data.placeRequest.workType)
                    setDressType(res.data.placeRequest.dressType)
                })
        } catch (err) {
            console.log(err)
        }
    }
    const [latitude, setLatitude] = useState('')
    const [longitude, setLongitude] = useState('')

    const getPlaceId = async (id) => {
        try {
            await axios.get(`${import.meta.env.VITE_BACKEND_URL}/place-api/get-place/${id}`, { withCredentials: true })
                .then((res) => {
                    console.log(res.data, ' สถานที่จริง')
                    setNewThaiName(res.data.place.thaiName)
                    setNewEngName(res.data.place.engName)
                    setNewPlaceType(res.data.place.placeTypeId)
                    setNewAddress(res.data.place.address)
                    setNewProvince(res.data.place.provinceId)
                    setNewDistrict(res.data.place.districtId)
                    setNewSubDistrict(res.data.place.subDistrict)
                    setNewPhoneNumber(res.data.place.phoneNumber)
                    setNewEmail(res.data.place.email)
                    setNewWebSite(res.data.place.webSite)
                    setNewFacebook(res.data.place.facebook)
                    setNewInstagram(res.data.place.instagram)
                    setNewHasAllowance(res.data.place.hasAllowance === 1 ? true : false)
                    setNewHasCaregiver(res.data.place.hasCaregiver === 1 ? true : false)
                    setNewNearBts(res.data.place.nearBts === 1 ? true : false)
                    setNewHasParking(res.data.place.hasParking === 1 ? true : false)
                    setNewWorkDay(res.data.place.workDay)
                    setNewWorkTime(res.data.place.workTime)

                    const wTime = res.data.place.workTime.split(',')
                    setNewWorkTime([
                        dayjs(wTime[0], "HH:mm"),
                        dayjs(wTime[1], "HH:mm")
                    ])

                    setNewWorkType(res.data.place.workType)
                    setNewDressType(res.data.place.dressType)
                    setLatitude(res.data.place.latitude)
                    setLongitude(res.data.place.longitude)
                })
        } catch (err) {
            console.log(err)
        }
    }


    useEffect(() => {
        if (placeId) {
            getPlaceId(placeId)
        }
    }, [placeId, detailKey])

    useEffect(() => {
        if (placeRequestEditId) {
            getPlaceRequestEditId(placeRequestEditId)
        }
    }, [placeRequestEditId, detailKey])

    console.log(workTime, 'worktime')

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
        if (province) {
            getDistrictSelect()
        }
    }, [newProvince])

    const handleProvinceChange = (value) => {
        setNewProvince(value)
        setNewDistrict('')
    }



    // const [newWorkDay, setNewWorkDay] = useState('')

    const handleUpdatePlaceRequestEdit = async () => {
        setIsLoading(true)
        try {
            const formData = new FormData()
            formData.append("placeRequestEditId", placeRequestEditId)
            formData.append("placeId", placeId)
            formData.append("userId", userId)
            formData.append("thaiName", newThaiName)
            formData.append("engName", newEngName)
            formData.append("placeType", newPlaceType)
            formData.append("address", newAddress)
            formData.append("province", newProvince)
            formData.append("district", newDistrict)
            formData.append("latitude", latitude)
            formData.append("longitude", longitude)
            formData.append("subDistrict", newSubDistrict)
            formData.append("phoneNumber", newPhoneNumber)
            formData.append("email", newEmail)
            formData.append("webSite", newWebSite)
            formData.append("facebook", newFacebook)
            formData.append("instagram", newInstagram)
            formData.append("hasAllowance", newHasAllowance)
            formData.append("hasCaregiver", newHasCaregiver)
            formData.append("nearBts", newNearBts)
            formData.append("hasParking", NewHasParking)
            formData.append("workDay", newWorkDay)
            if (newWorkTime) {
                formData.append(
                    "workTime",
                    `${newWorkTime[0].format("HH:mm")},${newWorkTime[1].format("HH:mm")}`
                )
            }
            formData.append("workType", newWorkType)
            formData.append("dressType", newDressType)

            await axios.put(`${import.meta.env.VITE_BACKEND_URL}/placeRequest-api/update`, formData, { withCredentials: true })
                .then((res) => {
                    console.log(res.data, 'data from place update')
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

    console.log(latitude, longitude)


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
                        <div className='text-red-500'>
                            ข้อมูลที่แนบมา {thaiName}
                        </div>
                        <Input value={newThaiName || ''} onChange={(e) => setNewThaiName(e.target.value)} count={{ show: true, max: 100, }} maxLength={100} size='large' placeholder="ชื่อบริษัท" />
                    </div>
                    <div>
                        <div className='flex items-center gap-1'>
                            <span className='text-sm text-gray-500'>ชื่อบริษัท (ภาษาอังกฤษ)</span>
                            <div className='text-red-500'>*</div>
                        </div>
                        <div className='text-red-500'>
                            ข้อมูลที่แนบมา {engName}
                        </div>
                        <Input value={newEngName || ''} onChange={(e) => setNewEngName(e.target.value)} count={{ show: true, max: 100, }} maxLength={100} size='large' placeholder="ชื่อบริษัท" />
                    </div>
                    <div>
                        <div className='flex items-center gap-1'>
                            <span className='text-sm text-gray-500'>ประเภทองค์กร</span>
                            <div className='text-red-500'>*</div>
                        </div>
                        <div className='text-red-500'>
                            ข้อมูลที่แนบมา {placeType}
                        </div>
                        <div>
                            <Select
                                size='large'
                                placeholder='ประเภทองค์กร'
                                style={{ width: 190 }}
                                value={newPlaceType}
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
                        <div className='text-red-500'>
                            ข้อมูลที่แนบมา {address}
                        </div>
                        <Input value={newAddress || ''} onChange={(e) => setNewAddress(e.target.value)} size='large' count={{ show: true, max: 100, }} maxLength={100} placeholder="รายละเอียดที่อยู่ เช่นบ้านเลขที่ หรือ ชื่อถนน" />
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
                                value={newProvince ? newProvince : null}
                                onChange={handleProvinceChange}
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
                        <div className='text-red-500'>
                            ข้อมูลที่แนบมา {subDistrict}
                        </div>
                        <Input value={newSubDistrict || ''} onChange={(e) => setNewSubDistrict(e.target.value)} count={{ show: true, max: 100, }} maxLength={100} size='large' placeholder="เช่น แขวงบางอ้อ" />
                    </div>
                    <div>
                        <div className='flex items-center gap-1'>
                            <span className='text-sm text-gray-500'>ตำแหน่งบนแผนที่</span>
                            <div className='text-red-500'>*</div>
                        </div>
                        <div className='grid grid-cols-2 gap-3'>
                            <div>
                                <span className='text-sm text-gray-500'>ละติจูด</span>
                                <Input value={latitude || ''} onChange={(e) => setLatitude(e.target.value)} count={{ show: true, max: 20, }} maxLength={20} size='large' placeholder="ตำแหน่งละติจูด" />
                            </div>
                            <div>
                                <span className='text-sm text-gray-500'>ลองติจุด</span>
                                <Input value={longitude || ''} onChange={(e) => setLongitude(e.target.value)} count={{ show: true, max: 20, }} maxLength={20} size='large' placeholder="ตำแหน่งลองติจูด" />
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
                        <div className='text-red-500'>
                            ข้อมูลที่แนบมา {phoneNumber ? phoneNumber : 'ไม่ระบุ'}
                        </div>
                        <Input value={newPhoneNumber || ''} onChange={(e) => setNewPhoneNumber(e.target.value)} count={{ show: true, max: 10, }} maxLength={10} size='large' placeholder="เบอร์โทรศัพท์" />
                    </div>
                    <div>
                        <span className='text-sm text-gray-500'>อีเมล</span>
                        <div className='text-red-500'>
                            ข้อมูลที่แนบมา {email ? email : 'ไม่ระบุ'}
                        </div>
                        <Input value={newEmail || ''} onChange={(e) => setNewEmail(e.target.value)} count={{ show: true, max: 100, }} maxLength={100} size='large' placeholder="อีเมล" />
                    </div>
                    <div>
                        <span className='text-sm text-gray-500'>เว็บไซต์</span>
                        <div className='text-red-500'>
                            ข้อมูลที่แนบมา {webSite ? webSite : 'ไม่ระบุ'}
                        </div>
                        <Input value={newWebSite || ''} onChange={(e) => setNewWebSite(e.target.value)} count={{ show: true, max: 100, }} maxLength={100} size='large' placeholder="ชื่อเว็บไซต์" />
                    </div>
                    <div className='grid grid-cols-2 gap-3'>
                        <div>
                            <span className='text-sm text-gray-500'>Facebook</span>
                            <div className='text-red-500'>
                                ข้อมูลที่แนบมา {facebook ? facebook : 'ไม่ระบุ'}
                            </div>
                            <Input value={newFacebook || ''} onChange={(e) => setNewFacebook(e.target.value)} count={{ show: true, max: 100, }} maxLength={100} size='large' placeholder="ชื่อ Facebook" />
                        </div>
                        <div>
                            <span className='text-sm text-gray-500'>Instagram</span>
                            <div className='text-red-500'>
                                ข้อมูลที่แนบมา {instagram ? instagram : 'ไม่ระบุ'}
                            </div>
                            <Input value={newInstagram || ''} onChange={(e) => setNewInstagram(e.target.value)} count={{ show: true, max: 100, }} maxLength={100} size='large' placeholder="ชื่อ Instagram" />
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
                            <Switch value={newHasAllowance} onChange={(value) => setNewHasAllowance(value)} />
                        </div>
                        <div>
                            <h3 className='text-gray-500 text-sm'>ได้เบี้ยเลี้ยง</h3>
                            <div className='text-red-500'>
                                ข้อมูลที่แนบมา {hasAllowance ? 'ได้เบี้ยเลี้ยง' : 'ไม่ระบุ'}
                            </div>
                        </div>
                    </div>
                    <div className='flex items-center gap-2'>
                        <div>
                            <Switch value={newHasCaregiver} onChange={(value) => setNewHasCaregiver(value)} />
                        </div>
                        <div>
                            <h3 className='text-gray-500 text-sm'>มีพี่เลี้ยงประจำตัว</h3>
                            <div className='text-red-500'>
                                ข้อมูลที่แนบมา {hasCaregiver ? 'มีพี่เลี้ยงประจำตัว' : 'ไม่ระบุ'}
                            </div>
                        </div>
                    </div>
                    <div className='flex items-center gap-2'>
                        <div>
                            <Switch value={newNearBts} onChange={(value) => setNewNearBts(value)} />
                        </div>
                        <div>
                            <h3 className='text-gray-500 text-sm'>ติดสถานีรถไฟฟ้า</h3>
                            <div className='text-red-500'>
                                ข้อมูลที่แนบมา {nearBts ? 'ติดสถานีรถไฟฟ้า' : 'ไม่ระบุ'}
                            </div>
                        </div>
                    </div>
                    <div className='flex items-center gap-2'>
                        <div>
                            <Switch value={NewHasParking} onChange={(value) => setNewHasParking(value)} />
                        </div>
                        <div>
                            <h3 className='text-gray-500 text-sm'>ที่จอดรถ</h3>
                            <div className='text-red-500'>
                                ข้อมูลที่แนบมา {hasParking ? 'ที่จอดรถ' : 'ไม่ระบุ'}
                            </div>
                        </div>
                    </div>
                    <div className='mt-3'>
                        <div className='flex items-center gap-1'>
                            <span className='text-sm text-gray-500'>วันปฏิบัติงาน</span>
                            <div className='text-red-500'>*</div>
                        </div>
                        <div className='mt-3'>
                            <div className='text-red-500'>
                                ข้อมูลที่แนบมา {workDay}
                            </div>
                            <div>
                                <Input value={newWorkDay || ''} onChange={(e) => setNewWorkDay(e.target.value)} count={{ show: true, max: 50, }} maxLength={50} size='large' placeholder="เช่น ทุกวัน/จันทร์-ศุกร์" />
                            </div>
                        </div>
                    </div>
                    <div className='mt-3'>
                        <div className='flex items-center gap-1'>
                            <span className='text-sm text-gray-500'>เวลาเริ่มงาน</span>
                            <div className='text-red-500'>*</div>
                        </div>
                        <div className='mt-3'>
                            <div className='text-red-500'>
                                ข้อมูลที่แนบมา {workTime?.split(',').join(' - ')}
                            </div>
                            <RangePicker
                                format="HH:mm"
                                value={newWorkTime}
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
                            <div className='text-red-500'>
                                ข้อมูลที่แนบมา {workType}
                            </div>
                            <div>
                                <Radio.Group
                                    className='big-radio'
                                    onChange={(e) => setNewWorkType(e.target.value)}
                                    value={newWorkType}
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
                            <div className='text-red-500'>
                                ข้อมูลที่แนบมา {dressType}
                            </div>
                            <div>
                                <Radio.Group
                                    className='big-radio'
                                    onChange={(e) => setNewDressType(e.target.value)}
                                    value={newDressType}
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

            <div className='flex justify-end mt-4'>
                <Button onClick={handleUpdatePlaceRequestEdit} style={{ width: 150 }} size="large" type="primary" loading={isLoading}>อนุมัติคำขอแก้ไข</Button>
            </div>

        </div>
    )
}

export default DetailPlaceRequestEdit