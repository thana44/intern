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

function Question() {
    const columns = [
        {
            title: 'ไอดี',
            dataIndex: 'id',
            key: 'id'
        },
        {
            title: 'คำถาม',
            dataIndex: 'title',
            key: 'title'
        },
        {
            title: 'คำตอบ',
            dataIndex: 'answer',
            key: 'answer'
        },
        {
            title: "จัดการ",
            key: "action",
            render: (_, record) => (
                <Space>
                    <Button color="primary" variant="outlined" type="link" onClick={() => handleEdit(record)}>
                        แก้ไข
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
        getQuestionPaginate(pagination.current, pagination.pageSize)
    }

    const getQuestionPaginate = async (page = 1, pageSize = 5) => {
        try {
            await axios.get(`${import.meta.env.VITE_BACKEND_URL}/question-api/get-paginate?page=${page}&pageSize=${pageSize}&search=${search}`, { withCredentials: true })
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
        getQuestionPaginate(1, pagination.pageSize)
    }, [search])

    const [modalOpen, setModalOpen] = useState(false);
    const [modalUpdateOpen, setModalUpdateOpen] = useState(false)

    const [cLoading, setCLoading] = useState(false)

    const [currentData, setCurrentData] = useState()
    const [questionId, setQuestionId] = useState('')

    const handleEdit = (record) => {
        setCurrentData(record)
        if (currentData) {
            setQuestionId(record.id)
            setTitle(record.title)
            setAnswer(record.answer)
            setDetailKey(prev => prev + 1)
            setUpdateQuestionModal(true)
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
            setModalOpen(true)
        }
    }

    console.log(delPlaceRequestId, ' del id')
    const deleteQuestion = async (id) => {
        setCLoading(true)
        try {
            console.log(id)
            await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/question-api/delete/${id}`, {withCredentials: true})
                .then((res) => {
                    console.log(res.data)
                    getQuestionPaginate(pagination.current, pagination.pageSize)
                    setModalOpen(false)
                })
        } catch (err) {
            console.log(err)
            message.error(err.response.data.message)
        } finally {
            setCLoading(false)
        }
    }

    const [createQuestionModal, setCreateQuestionModal] = useState(false)
    const [updateQuestionModal, setUpdateQuestionModal] = useState(false)
    const [cErr, setCErr] = useState('')
    const [title, setTitle] = useState('')
    const [answer, setAnswer] = useState('')

    const clearInput = () => {
        setCErr('')
        setTitle('')
        setAnswer('')
    }

    useEffect(() => {
        clearInput()
    }, [createQuestionModal])

    const handleCreateQuestion = async () => {
        setCLoading(true)
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/question-api/create`, { title, answer }, { withCredentials: true })
                .then((res) => {
                    console.log(res.data, 'add question')
                    getQuestionPaginate(pagination.current, pagination.pageSize)
                    setCreateQuestionModal(false)
                })
        } catch (err) {
            setCErr(err.response.data.message)
            console.log(err)
        } finally {
            setCLoading(false)
        }
    }

    const handleUpdateQuestion = async (id) => {
        setCLoading(true)
        try {
            await axios.put(`${import.meta.env.VITE_BACKEND_URL}/question-api/update/${id}`, { title, answer }, { withCredentials: true })
                .then((res) => {
                    console.log(res.data, 'update question')
                    getQuestionPaginate(pagination.current, pagination.pageSize)
                    setUpdateQuestionModal(false)
                })
        } catch (err) {
            setCErr(err.response.data.message)
            console.log(err)
        } finally {
            setCLoading(false)
        }
    }


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
                        <div className='text-md font-bold mb-5'>คำถามและคำตอบทั้งหมด</div>
                        <div className=' mb-5 flex gap-3 items-center justify-between'>
                            <div className='w-full md:w-[400px]'>
                                <Input suffix={<SearchOutlined />} onChange={(e) => setSearch(e.target.value)} size='large' placeholder="ค้นหาคำถาม/คำตอบ" />
                            </div>
                            <div onClick={() => setCreateQuestionModal(true)} className='text-2xl'>
                                <PlusSquareOutlined />
                            </div>
                            <Modal
                                title="เพิ่มคำถาม/คำตอบ"
                                centered
                                open={createQuestionModal}
                                closable={{ 'aria-label': 'Custom Close Button' }}
                                footer={null}
                                onCancel={() => setCreateQuestionModal(false)}
                            >
                                <div className='grid gap-3'>
                                    <div>
                                        <Input value={title} onChange={(e) => setTitle(e.target.value)} size='large' placeholder="คำถาม" />
                                    </div>
                                    <div>
                                        <TextArea
                                            value={answer}
                                            onChange={(e) => setAnswer(e.target.value)}
                                            placeholder="คำตอบ"
                                            size='large'
                                            style={{ height: 120, resize: 'none' }}
                                        />
                                    </div>
                                    {
                                        cErr &&
                                        <div className='text-red-400'>
                                            {cErr}
                                        </div>
                                    }
                                    <div>
                                        <Button onClick={handleCreateQuestion} className='w-full' size="large" type="primary" loading={cLoading}>เพิ่ม</Button>
                                    </div>
                                </div>
                            </Modal>
                            <Modal
                                title="ยืนยันการลบคำถาม"
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
                                                คุณต้องการลบคำถามและคำตอบนี้ใช่หรือไม่
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex justify-center'>
                                        <Button loading={cLoading} color="danger" variant="solid" danger size='large' onClick={() => deleteQuestion(delId)}>
                                            ยืนยันการลบ
                                        </Button>
                                    </div>
                                </div>
                            </Modal>
                            <Modal
                                title="แก้ไขคำถาม/คำตอบ"
                                centered
                                open={updateQuestionModal}
                                closable={{ 'aria-label': 'Custom Close Button' }}
                                footer={null}
                                onCancel={() => setUpdateQuestionModal(false)}
                            >
                                <div className='grid gap-3'>
                                    <div>
                                        <Input value={title || ''} onChange={(e) => setTitle(e.target.value)} size='large' placeholder="คำถาม" />
                                    </div>
                                    <div>
                                        <TextArea
                                            value={answer || ''}
                                            onChange={(e) => setAnswer(e.target.value)}
                                            placeholder="คำตอบ"
                                            size='large'
                                            style={{ height: 120, resize: 'none' }}
                                        />
                                    </div>
                                    {
                                        cErr &&
                                        <div className='text-red-400'>
                                            {cErr}
                                        </div>
                                    }
                                    <div>
                                        <Button onClick={() => handleUpdateQuestion(questionId)} className='w-full' size="large" type="primary" loading={cLoading}>แก้ไข</Button>
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

export default Question