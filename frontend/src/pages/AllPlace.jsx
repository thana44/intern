import { PlusSquareOutlined, SearchOutlined, WarningOutlined } from '@ant-design/icons';
import { Button, Input, message, Modal, Popconfirm, Select, Space, Table } from 'antd';
import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import NavAdmin from '../components/NavAdmin';
import { useNavigate } from 'react-router-dom';
import TextArea from 'antd/es/input/TextArea';
import DetailPlace from '../components/DetailPlace';
import CreatePlace from '../components/CreatePlace';

function AllPlace() {
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
            title: 'ประเภทธุรกิจ',
            dataIndex: 'placeType',
            key: 'placeType'
        },
        {
            title: 'ละติจูด',
            dataIndex: 'latitude',
            key: 'latitude'
        },
        {
            title: 'ลองติจูด',
            dataIndex: 'longitude',
            key: 'longitude'
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
                        ลบ
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
        getPlacePaginate(pagination.current, pagination.pageSize)
    }

    const getPlacePaginate = async (page = 1, pageSize = 5) => {
        try {
            await axios.get(`${import.meta.env.VITE_BACKEND_URL}/place-api/get-paginate?page=${page}&pageSize=${pageSize}&search=${search}`, { withCredentials: true })
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
        getPlacePaginate(1, pagination.pageSize)
    }, [search])

    const [modalOpen, setModalOpen] = useState(false);
    const [modalUpdateOpen, setModalUpdateOpen] = useState(false)

    const [cLoading, setCLoading] = useState(false)

    const [currentData, setCurrentData] = useState()
    const [placeId, setPlaceId] = useState('')
    const [placeRequestId, setPlaceRequestId] = useState('')

    const handleEdit = (record) => {
        setCurrentData(record)
        if (currentData) {
            setPlaceId(record.id)
            setPlaceRequestId(record.placeRequestId)
            setDetailKey(prev => prev + 1)
            setModalUpdateOpen(true)
        }
    }
    const [delData, setDelData] = useState()
    const [delId, setDelId] = useState('')
    const [delPlaceRequestId, setDelPlaceRequestId] = useState('')
    const [detailKey, setDetailKey] = useState(0)

    const handleDel = (record) => {
        setDelData(record)
        if (delData) {
            setDelId(record.id)
            setDelPlaceRequestId(record.placeRequestId)
            setModalOpen(true)
        }
    }

    console.log(delPlaceRequestId, ' del id')
    const deletePlace = async (id) => {
        setCLoading(true)
        try {
            console.log(id)
            await axios.put(`${import.meta.env.VITE_BACKEND_URL}/place-api/delete/${id}`, { delPlaceRequestId }, { withCredentials: true })
                .then((res) => {
                    console.log(res.data)
                    getPlacePaginate(pagination.current, pagination.pageSize)
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
        setCreatePlaceModal(false)
        getPlacePaginate(pagination.current, pagination.pageSize)
    }

    const [createPlaceModal, setCreatePlaceModal] = useState(false)


    return (
        <div className='bg-white flex h-screen'>
            <div className='bg-white border border-gray-300 border-y-0 border-l-0'>
                <Sidebar />
            </div>
            <div className='bg-gray-200 w-full'>
                <div>
                    <NavAdmin />
                </div>
                <div className='mt-5  flex justify-center'>
                    <div className=' px-3 pb-10 w-full lg:w-[80%]'>
                        <div className='text-md font-bold mb-5'>สถานที่ฝึกทั้งหมด</div>
                        <div className=' mb-5 flex gap-3 items-center justify-between'>
                            <div className='w-full md:w-[400px]'>
                                <Input suffix={<SearchOutlined />} onChange={(e) => setSearch(e.target.value)} size='large' placeholder="ค้นหาชื่อสถานที่/ประเภทธุรกิจ" />
                            </div>
                            <div onClick={() => setCreatePlaceModal(true)} className='text-2xl'>
                                <PlusSquareOutlined />
                            </div>
                            <Modal
                                title="สร้างสถานที่ฝึก"
                                centered
                                open={createPlaceModal}
                                closable={{ 'aria-label': 'Custom Close Button' }}
                                footer={null}
                                onCancel={() => setCreatePlaceModal(false)}
                            >
                                <div className=''>
                                    <CreatePlace detailKey={detailKey} onSuccess={handleUpdateSuccess} />
                                </div>
                            </Modal>
                            <Modal
                                title="ยืนยันการลบสถานที่ฝึก"
                                centered
                                open={modalOpen}
                                closable={{ 'aria-label': 'Custom Close Button' }}
                                footer={null}
                                onCancel={() => setModalOpen(false)}
                            >
                                <div>
                                    <div className='my-5'>
                                        <div className='flex flex-col justify-center items-center gap-3'>
                                            <div className='text-6xl text-yellow-500'>
                                                <WarningOutlined />
                                            </div>
                                            <div>
                                                คุณต้องการลบสถานที่ฝึกนี้ใช่หรือไม่
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex justify-center'>
                                        <Button loading={cLoading} color="danger" variant="solid" danger size='large' onClick={() => deletePlace(delId)}>
                                            ยืนยันการลบ
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
                                    <DetailPlace detailKey={detailKey} placeId={placeId} onSuccess={handleUpdateSuccess} placeRequestId={placeRequestId} />
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

export default AllPlace