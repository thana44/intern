import { PlusSquareOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input, message, Modal, Popconfirm, Space, Table } from 'antd';
import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import NavAdmin from '../components/NavAdmin';
import { useNavigate } from 'react-router-dom';

function Province() {
    const columns = [
        {
            title: 'ไอดี',
            dataIndex: 'id',
            key: 'id'
        },
        {
            title: 'จังหวัด',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: "จัดการ",
            key: "action",
            render: (_, record) => (
                <Space>
                    <Button color="primary" variant="outlined" type="link" onClick={() => handleEdit(record)}>
                        แก้ไข
                    </Button>

                    <Popconfirm
                        title="ยืนยันการลบ?"
                        description={`ต้องการลบ ${record.name} ใช่หรือไม่`}
                        onConfirm={() => deleteProvince(record.id)}
                        okText="ลบ"
                        cancelText="ยกเลิก"
                    >
                        <Button color="danger" variant="outlined" type="link" danger>
                            ลบ
                        </Button>
                    </Popconfirm>
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
        getProvincePaginate(pagination.current, pagination.pageSize)
    }

    const getProvincePaginate = async (page = 1, pageSize = 5) => {
        try {
            await axios.get(`${import.meta.env.VITE_BACKEND_URL}/province-api/get-paginate?page=${page}&pageSize=${pageSize}&search=${search}`, { withCredentials: true })
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
        getProvincePaginate(1, pagination.pageSize)
    }, [search])

    const [modalOpen, setModalOpen] = useState(false);
    const [modalUpdateOpen, setModalUpdateOpen] = useState(false)

    const [name, setName] = useState('')
    const [cLoading, setCLoading] = useState(false)
    const [cErr, setCErr] = useState(null)

    const createProvince = async () => {
        setCLoading(true)
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/province-api/create`, { name }, { withCredentials: true })
                .then((res) => {
                    console.log(res.data)
                    getProvincePaginate(pagination.current, pagination.pageSize)
                    setModalOpen(false)
                })
        } catch (err) {
            setCErr(err.response.data.message)
            console.log(err)
        } finally {
            setCLoading(false)
        }
    }

    const [currentProvince, setCurrentProvince] = useState()
    const [nameUpdate, setNameUpdate] = useState('')
    const [uErr, setUErr] = useState(null)

    const handleEdit = (record) => {
        setCurrentProvince(record)
        if (currentProvince) {
            setNameUpdate(record.name)
            setModalUpdateOpen(true)
        }
    }

    const updateProvince = async (id, name) => {
        setCLoading(true)
        try {
            await axios.put(`${import.meta.env.VITE_BACKEND_URL}/province-api/update/${id}`, { name }, { withCredentials: true })
                .then((res) => {
                    console.log(res.data)
                    getProvincePaginate(pagination.current, pagination.pageSize)
                    setModalUpdateOpen(false)
                })
        } catch (err) {
            setUErr(err.response.data.message)
            console.log(err)
        } finally {
            setCLoading(false)
        }
    }
    const deleteProvince = async (id) => {
        try {
            console.log(id)
            await axios.put(`${import.meta.env.VITE_BACKEND_URL}/province-api/delete/${id}`, {}, { withCredentials: true })
                .then((res) => {
                    console.log(res.data)
                    getProvincePaginate(pagination.current, pagination.pageSize)
                })
        } catch (err) {
            console.log(err)
            message.error(err.response.data.message)
        }
    }

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
                        <div className='text-md font-bold mb-5'>จังหวัดทั้งหมด</div>
                        <div className=' mb-5 flex gap-3 items-center justify-between'>
                            <div className='w-full md:w-[400px]'>
                                <Input suffix={<SearchOutlined />} onChange={(e) => setSearch(e.target.value)} size='large' placeholder="ค้นหาจังหวัด" />
                            </div>
                            <div onClick={() => setModalOpen(true)} className='text-2xl'>
                                <PlusSquareOutlined />
                            </div>
                            <Modal
                                title="เพิ่มจังหวัด"
                                centered
                                open={modalOpen}
                                closable={{ 'aria-label': 'Custom Close Button' }}
                                footer={null}
                                onCancel={() => setModalOpen(false)}
                            >
                                <div className='grid gap-3'>
                                    <div>
                                        <Input onChange={(e) => setName(e.target.value)} size='large' placeholder="ชื่อจังหวัด" />
                                    </div>
                                    {
                                        cErr &&
                                        <div className='text-red-400'>
                                            {cErr}
                                        </div>
                                    }
                                    <div>
                                        <Button onClick={createProvince} className='w-full' size="large" type="primary" loading={cLoading}>เพิ่ม</Button>
                                    </div>
                                </div>
                            </Modal>
                            <Modal
                                title="แก้ไขจังหวัด"
                                centered
                                open={modalUpdateOpen}
                                closable={{ 'aria-label': 'Custom Close Button' }}
                                footer={null}
                                onCancel={() => setModalUpdateOpen(false)}
                            >
                                <div className='grid gap-3'>
                                    <div>
                                        <Input value={nameUpdate || ''} onChange={(e) => setNameUpdate(e.target.value)} size='large' placeholder="ชื่อจังหวัด" />
                                    </div>
                                    {
                                        uErr &&
                                        <div className='text-red-400'>
                                            {uErr}
                                        </div>
                                    }
                                    <div>
                                        <Button onClick={() => updateProvince(currentProvince?.id, nameUpdate)} className='w-full' size="large" type="primary" loading={cLoading}>แก้ไข</Button>
                                    </div>
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

export default Province