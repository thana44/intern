import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { PlusOutlined } from '@ant-design/icons';
import { Button, Image, Input, message, Upload } from 'antd';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
const { TextArea } = Input;

const getBase64 = file =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

function EditProfile() {

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
    const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>อัพโหลด</div>
        </button>
    );

    const beforeUpload = (file) => {
        const isImage = file.type.startsWith("image/");

        if (!isImage) {
            message.error("กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น");
            return Upload.LIST_IGNORE; // ไม่เพิ่มเข้า fileList
        }

        return false; // ไม่ให้ antd auto upload
    };

    // console.log(fileList, 'this is image file')

    const { profileId } = useParams()
    const navigate = useNavigate()

    const [username, setUsername] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [aboutMe, setAboutMe] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [email, setEmail] = useState('')
    const [facebook, setFacebook] = useState('')
    const [instagram, setInstagram] = useState('')
    const [loading, setLoading] = useState(false)

    const getProfileForUpdate = async () => {
        try {
            await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user-api/get-profile-for-update/${profileId}`, { withCredentials: true })
                .then((res) => {
                    const { username, firstName, lastName, aboutMe, phoneNumber, email, facebook, instagram } = res.data.profile[0]
                    setFileList([
                        {
                            uid: '-1',
                            name: 'profile.jpg',
                            status: 'done',
                            url: res.data.profile[0]?.profileImg,
                        },
                    ]);
                    setUsername(username ?? '')
                    setFirstName(firstName ?? '')
                    setLastName(lastName ?? '')
                    setAboutMe(aboutMe ?? '')
                    setPhoneNumber(phoneNumber ?? '')
                    setEmail(email ?? '')
                    setFacebook(facebook ?? '')
                    setInstagram(instagram ?? '')
                })
        } catch (err) {
            console.log(err)
            return navigate('/')
        }
    }

    useEffect(() => {
        getProfileForUpdate()
    }, [])

    // console.log(email, 'this is username')

    const onSaveProfile = async () => {
        setLoading(true)
        try {
            const formData = new FormData();

            formData.append("username", username);
            formData.append("firstName", firstName);
            formData.append("lastName", lastName);
            formData.append("aboutMe", aboutMe);
            formData.append("phoneNumber", phoneNumber);
            formData.append("email", email);
            formData.append("facebook", facebook);
            formData.append("instagram", instagram);

            const imageFile = fileList[0];

            if (imageFile?.originFileObj) {
                formData.append("profileImg", imageFile.originFileObj);
            } else {
                formData.append("keepOldImage", true);
            }

            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user-api/update-profile/${profileId}`, formData, { withCredentials: true })
                .then((res) => {
                    message.success(res.data.message);
                    setTimeout(() => {
                        return navigate(`/profile/${profileId}`)
                    }, 1500)
                })
        } catch (err) {
            message.error(err.response.data.message);
        } finally {
            setLoading(false)
        }
    };


    return (
        <div className='bg-gray-200 min-h-screen'>
            <Navbar />
            <div className='bg-transparent flex justify-center min-h-screen'>
                <div className='bg-transparent w-[90%] sm:w-[80%] md:w-[90%] xl:w-[80%] mt-15 flex justify-center'>
                    <div className='bg-transparent w-full sm:w-[90%] md:w-[80%] lg:w-[60%] pb-20'>
                        <div>
                            <h3 className='text-xl font-extrabold'>แก้ไขโปรไฟล์</h3>
                        </div>
                        <div className='bg-white py-5 px-3 rounded-lg shadow-md mt-3'>
                            <div className='font-bold mb-4'>
                                ข้อมูลพื้นฐาน
                            </div>
                            <div>
                                <Upload
                                    listType="picture-circle"
                                    fileList={fileList}
                                    accept="image/*"
                                    beforeUpload={beforeUpload}
                                    onPreview={handlePreview}
                                    onChange={handleChange}
                                    maxCount={1}
                                >
                                    {fileList.length === 1 ? null : uploadButton}
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
                            <div className='bg-white mt-4 grid gap-2'>
                                <div>
                                    <span className='text-sm text-gray-500'>ชื่อผู้ใช้</span>
                                    <Input value={username || ''} onChange={(e) => setUsername(e.target.value)} count={{ show: true, max: 10, }} maxLength={10} size='large' placeholder="กรุณากรอกชื่อผู้ใช้" />
                                </div>
                                <div>
                                    <span className='text-sm text-gray-500'>ชื่อ</span>
                                    <Input value={firstName || ''} onChange={(e) => setFirstName(e.target.value)} size='large' placeholder="ชื่อ" />
                                </div>
                                <div>
                                    <span className='text-sm text-gray-500'>นามสกุล</span>
                                    <Input value={lastName || ''} onChange={(e) => setLastName(e.target.value)} size='large' placeholder="นามสกุล" />
                                </div>
                                <div className='mb-4'>
                                    <span className='text-sm text-gray-500'>เกี่ยวกับฉัน</span>
                                    <TextArea
                                        value={aboutMe || ''}
                                        size='large'
                                        showCount
                                        maxLength={100}
                                        onChange={(e) => setAboutMe(e.target.value)}
                                        placeholder="(ถ้ามี)"
                                        style={{ height: 120, resize: 'none' }}
                                    />
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
                                    <Input value={phoneNumber || ''} onChange={(e) => setPhoneNumber(e.target.value)} count={{ show: true, max: 10, }} maxLength={10} size='large' placeholder="กรุณากรอกเบอร์โทรศัพท์" />
                                </div>
                                <div>
                                    <span className='text-sm text-gray-500'>อีเมล</span>
                                    <Input value={email || ''} onChange={(e) => setEmail(e.target.value)} size='large' placeholder="กรุณากรอกอีเมล" />
                                </div>
                                <div>
                                    <span className='text-sm text-gray-500'>Facebook</span>
                                    <Input value={facebook || ''} onChange={(e) => setFacebook(e.target.value)} size='large' placeholder="(ถ้ามี)" />
                                </div>
                                <div>
                                    <span className='text-sm text-gray-500'>Instagram</span>
                                    <Input value={instagram || ''} onChange={(e) => setInstagram(e.target.value)} size='large' placeholder="(ถ้ามี)" />
                                </div>
                            </div>
                        </div>

                        <div className='flex justify-end mt-4'>
                            <Button onClick={onSaveProfile} style={{ width: 150 }} size="large" type="primary" loading={loading}>บันทึก</Button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditProfile