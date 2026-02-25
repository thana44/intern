import React, { useEffect, useState } from 'react'
import Menubar from '../components/Menubar'
import Navbar from '../components/Navbar'
import { TimePicker, ConfigProvider, DatePicker, Select, Input, Switch, Checkbox, Radio, Upload, Image, Button, message, Modal } from 'antd';
import { CheckCircleOutlined, PlusOutlined } from '@ant-design/icons'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import dayjs from 'dayjs'

const { RangePicker } = TimePicker;

function EditPlace() {

    const handleChange = value => {
        console.log(`เลือกประเภทองค์กร ${value}`);
        setPlaceType(value)
    };

    const onChange = checked => {
        console.log(`switch to ${checked}`);
    };

    const plainOptions = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์', 'เสาร์', 'อาทิตย์'];

    // const onChangeCheckBox = checkedValues => {
    //     console.log('checked = ', checkedValues);
    // };

    const onChangeTime = (values) => {
        setWorkTime(values) // ✅ values = [dayjs, dayjs]
    }

    // const [valueRadio, setValueRadio] = useState();
    // const onChangeRadio = e => {
    //     setValueRadio(e.target.value);
    // };

    const [placeTypeOption, setPlaceTypeOption] = useState([])

    const getPlaceTypeSelect = async () => {
        try {
            await axios.get(`${import.meta.env.VITE_BACKEND_URL}/place-type-api/get-place-type-select`)
                .then((res) => {
                    // console.log(res.data)
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
    const [newWorkDay, setNewWorkDay] = useState([])

    const [modalOpen, setModalOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()


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
    // console.log(placeType, 'switch เบี้ยเลี้ยง')

    const handlePlaceRequestEdit = async () => {
        setIsLoading(true)
        try {
            const formData = new FormData()
            formData.append("editPlaceId", placeId)
            formData.append("thaiName", thaiName)
            formData.append("engName", engName)
            formData.append("placeType", placeType)
            formData.append("address", address)
            formData.append("province", province)
            formData.append("district", district)
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

            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/placeRequest-api/create-request-edit`, formData, { withCredentials: true })
                .then((res) => {
                    console.log(res.data)
                    setModalOpen(true)
                })
        } catch (err) {
            console.log(err)
            message.error(err.response.data.message);
        } finally {
            setIsLoading(false)
        }
    }

    const { placeId } = useParams()
    const getPlaceId = async () => {
        try {
            await axios.get(`${import.meta.env.VITE_BACKEND_URL}/place-api/get-place-review/${placeId}`, { withCredentials: true })
                .then((res) => {
                    // console.log(res.data, 'test data')
                    setThaiName(res.data.place.thaiName)
                    setEngName(res.data.place.engName)
                    setPlaceType(res.data.place.placeTypeId)
                    setAddress(res.data.place.address)
                    setProvince(res.data.place.province)
                    setDistrict(res.data.place.district)
                    setSubDistrict(res.data.place.subDistrict)
                    setPhoneNumber(res.data.place.phoneNumber)
                    setEmail(res.data.place.email)
                    setWebSite(res.data.place.webSite)
                    setFacebook(res.data.place.facebook)
                    setInstagram(res.data.place.instagram)
                    setHasAllowance(res.data.place.hasAllowance === 1 ? true : false)
                    setHasCaregiver(res.data.place.hasCaregiver === 1 ? true : false)
                    setNearBts(res.data.place.nearBts === 1 ? true : false)
                    setHasParking(res.data.place.hasParking === 1 ? true : false)
                    setWorkDay(res.data.place.workDay)

                    const wTime = res.data.place.workTime.split(',')
                    setWorkTime([
                        dayjs(wTime[0], "HH:mm"),
                        dayjs(wTime[1], "HH:mm")
                    ])

                    setWorkType(res.data.place.workType)
                    setDressType(res.data.place.dressType)
                })
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        if (placeId) {
            getPlaceId()
        }
    }, [placeId])

    // console.log(newWorkDay, 'test new work day')
    // console.log(workTime, 'test work time')

    return (
        <div className='bg-gray-200 min-h-screen'>
            <Navbar />
            <div className='bg-transparent flex justify-center min-h-screen'>
                <div className='bg-transparent w-[90%] sm:w-[80%] md:w-[90%] xl:w-[80%] mt-15 flex justify-center'>
                    <div className='bg-transparent w-full sm:w-[90%] md:w-[80%] lg:w-[60%] pb-20'>
                        <div className=''>
                            <h3 className='text-xl font-bold'>แก้ไขสถานที่ฝึกสหกิจ</h3>
                        </div>
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
                                    <Input value={province || ''} onChange={(e) => setProvince(e.target.value)} count={{ show: true, max: 100, }} maxLength={100} size='large' placeholder="เช่น กรุงเทพมหานคร" />
                                </div>
                                <div>
                                    <div className='flex items-center gap-1'>
                                        <span className='text-sm text-gray-500'>เขต/อำเภอ</span>
                                        <div className='text-red-500'>*</div>
                                    </div>
                                    <Input value={district || ''} onChange={(e) => setDistrict(e.target.value)} count={{ show: true, max: 100, }} maxLength={100} size='large' placeholder="เช่น เขตบางพลัด" />
                                </div>
                                <div>
                                    <div className='flex items-center gap-1'>
                                        <span className='text-sm text-gray-500'>แขวง/ตำบล</span>
                                        <div className='text-red-500'>*</div>
                                    </div>
                                    <Input value={subDistrict || ''} onChange={(e) => setSubDistrict(e.target.value)} count={{ show: true, max: 100, }} maxLength={100} size='large' placeholder="เช่น แขวงบางอ้อ" />
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
                                        <div className='text-red-500'>
                                            ข้อมูลเดิม {workDay}
                                        </div>
                                        <div>
                                            <Checkbox.Group
                                                className="flex flex-col gap-2 big-checkbox"
                                                options={plainOptions}
                                                onChange={(value) => setNewWorkDay(value)} />
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
                                            defaultValue={[]}
                                            minuteStep={5}
                                            placeholder={["เวลาเริ่มงาน", "เวลาเลิกงาน"]}
                                            value={workTime}
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

                        <div className='flex justify-end mt-4'>
                            <Button onClick={handlePlaceRequestEdit} style={{ width: 150 }} size="large" type="primary" loading={isLoading}>ส่งคำขอแก้ไข</Button>
                        </div>
                        <Modal
                            title="คำขอแก้ไขสถานที่ฝึก"
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
                                        คำขอของคุณถูกส่งแล้ว โปรดรอการตรวจสอบจากผู้ดูแลระบบ
                                    </div>
                                </div>
                                <div className='mt-3'>
                                    <Button onClick={() => navigate(`/review/${placeId}`)} className='w-full' size="large" type="primary" loading={''}>กลับหน้าหลัก</Button>
                                </div>
                            </div>
                        </Modal>

                    </div>
                </div>
            </div>
        </div >
    )
}

export default EditPlace