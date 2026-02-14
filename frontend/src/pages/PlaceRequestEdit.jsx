import { PlusSquareOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input, message, Modal, Popconfirm, Select, Space, Table } from 'antd';
import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import NavAdmin from '../components/NavAdmin';
import { useNavigate } from 'react-router-dom';
import TextArea from 'antd/es/input/TextArea';
import DetailPlaceRequestEdit from '../components/DetailPlaceRequestEdit';

function PlaceRequestEdit() {
    const columns = [
        {
            title: 'ไอดี',
            dataIndex: 'id',
            key: 'id'
        },
        {
            title: 'ชื่อบริษัท (ภาษาไทย)',
            dataIndex: 'thaiName',
            key: 'thaiName'
        },
        {
            title: 'ชื่อบริษัท (ภาษาอังกฤษ)',
            dataIndex: 'engName',
            key: 'engName'
        },
        {
            title: 'ไอดีผู้ส่งคำขอ',
            dataIndex: 'userId',
            key: 'userId'
        },
        {
            title: 'ชื่อผู้ส่งคำขอ',
            dataIndex: 'username',
            key: 'username'
        },
        {
            title: "จัดการ",
            key: "action",
            render: (_, record) => (
                <Space>
                    <Button color="primary" variant="outlined" type="link" onClick={() => handleEdit(record)}>
                        ดูรายละเอียด
                    </Button>

                    <Button color="danger" variant="outlined" type="link" danger onClick={() => handleDel(record)}>
                        ไม่อนุมัติคำขอ
                    </Button>
                </Space>
            ),
        },
    ];

    const [dataSource, setDataSource] = useState([])
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
        total: 0,
    })
    const [search, setSearch] = useState('')
    const navigate = useNavigate()

    const handleTableChange = (pagination) => {
        getPlaceRequestEditPaginate(pagination.current, pagination.pageSize)
    }

    const getPlaceRequestEditPaginate = async (page = 1, pageSize = 5) => {
        try {
            await axios.get(`${import.meta.env.VITE_BACKEND_URL}/placeRequest-api/get-paginate-edit?page=${page}&pageSize=${pageSize}&search=${search}`, { withCredentials: true })
                .then((res) => {
                    console.log(res.data, 'paginate')
                    setDataSource(res.data.data)
                    setPagination({
                        current: res.data.pagination.page,
                        pageSize: res.data.pagination.limit,
                        total: res.data.pagination.total,
                    })
                })
        } catch (err) {
            console.log(err)
            return navigate('/')
        }
    }

    useEffect(() => {
        getPlaceRequestEditPaginate(1, pagination.pageSize)
    }, [search])

    const [modalOpen, setModalOpen] = useState(false);
    const [modalUpdateOpen, setModalUpdateOpen] = useState(false)

    const [cLoading, setCLoading] = useState(false)

    const [currentData, setCurrentData] = useState()
    const [placeRequestEditId, setPlaceRequestEditId] = useState('')
    const [userId, setUserId] = useState('')
    const [placeId, setPlaceId] = useState('')

    const handleEdit = (record) => {
        setCurrentData(record)
        if (currentData) {
            setPlaceRequestEditId(record.id)
            setUserId(record.userId)
            setPlaceId(record.editPlaceId)
            setDetailKey(prev => prev + 1)
            setModalUpdateOpen(true)
        }
    }
    const [delData, setDelData] = useState()
    const [delId, setDelId] = useState('')
    const [detail, setDetail] = useState('')

    const handleDel = (record) => {
        setDelData(record)
        if (delData) {
            setDelId(record.id)
            setModalOpen(true)
        }
    }

    console.log(delId, ' del id')
    const deletePlaceRequest = async (id) => {
        setCLoading(true)
        try {
            console.log(id)
            await axios.put(`${import.meta.env.VITE_BACKEND_URL}/placeRequest-api/delete-placeRequestEdit/${id}`, { detail }, { withCredentials: true })
                .then((res) => {
                    console.log(res.data)
                    getPlaceRequestEditPaginate(pagination.current, pagination.pageSize)
                    setModalOpen(false)
                })
        } catch (err) {
            console.log(err)
            message.error(err.response.data.message)
        } finally {
            setCLoading(false)
        }
    }


    const handleUpdateSuccess = () => {
        setModalUpdateOpen(false)
        getPlaceRequestEditPaginate(pagination.current, pagination.pageSize)
    }

    const [detailKey, setDetailKey] = useState(0)


    return (
        <div className=' flex h-screen'>
            <div className='bg-white border border-gray-300 border-y-0 border-l-0'>
                <Sidebar />
            </div>
            <div className='bg-gray-200 w-full'>
                <div>
                    <NavAdmin />
                </div>
                <div className='mt-5  flex justify-center'>
                    <div className=' px-3 pb-10 w-full lg:w-[80%]'>
                        <div className='text-md font-bold mb-5'>คำขอแก้ไขสถานที่ฝึกทั้งหมด</div>
                        <div className=' mb-5 flex gap-3 items-center justify-between'>
                            <div className='w-full md:w-[400px]'>
                                <Input suffix={<SearchOutlined />} onChange={(e) => setSearch(e.target.value)} size='large' placeholder="ค้นหาชื่อสถานที่" />
                            </div>
                            {/* <div onClick={() => setModalOpen(true)} className='text-2xl'>
                                <PlusSquareOutlined />
                            </div> */}
                            <Modal
                                title="แจ้งเหตุผลต่อผู้ใช้"
                                centered
                                open={modalOpen}
                                closable={{ 'aria-label': 'Custom Close Button' }}
                                footer={null}
                                onCancel={() => setModalOpen(false)}
                            >
                                <div>
                                    <div className='my-5'>
                                        <TextArea
                                            // value={''}
                                            showCount
                                            maxLength={100}
                                            onChange={(e) => setDetail(e.target.value)}
                                            placeholder="ระบุเหตุผล"
                                            style={{ height: 120, resize: 'none' }}
                                        />
                                    </div>
                                    <div className='flex justify-center'>
                                        <Button loading={cLoading} color="danger" variant="solid" danger size='large' onClick={() => deletePlaceRequest(delId)}>
                                            ยืนยันไม่อนุมัติคำขอ
                                        </Button>
                                    </div>
                                </div>
                            </Modal>
                            <Modal
                                title="รายละเอียดสถานที่ฝึก"
                                centered
                                open={modalUpdateOpen}
                                closable={{ 'aria-label': 'Custom Close Button' }}
                                footer={null}
                                onCancel={() => setModalUpdateOpen(false)}
                            >
                                <div className=''>
                                    <DetailPlaceRequestEdit placeId={placeId} detailKey={detailKey} placeRequestEditId={placeRequestEditId} onSuccess={handleUpdateSuccess} userId={userId} />
                                </div>
                            </Modal>
                        </div>
                        <div className='grid grid-cols-1'>
                            <div className='overflow-x-auto'>
                                <Table dataSource={dataSource} rowKey="id" columns={columns}
                                    pagination={pagination}
                                    onChange={handleTableChange}
                                />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default PlaceRequestEdit