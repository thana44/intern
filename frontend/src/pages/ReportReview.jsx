import { PlusSquareOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input, message, Modal, Popconfirm, Select, Space, Table } from 'antd';
import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import NavAdmin from '../components/NavAdmin';
import { useNavigate } from 'react-router-dom';
import DetailPlaceRequest from '../components/DetailPlaceRequest';
import TextArea from 'antd/es/input/TextArea';
import ModalDetailReview from '../components/ModalDetailReview';

function ReportReview() {
    const columns = [
        {
            title: 'ชื่อผู้รายงานรีวิว',
            dataIndex: 'reporterName',
            key: 'reporterName'
        },
        {
            title: 'ชื่อผู้รีวิว',
            dataIndex: 'reviewerName',
            key: 'reviewerName'
        },
        {
            title: 'สาเหตุ',
            dataIndex: 'detail',
            key: 'detail'
        },
        {
            title: "จัดการ",
            key: "action",
            render: (_, record) => (
                <Space>
                    <Button color="primary" variant="outlined" type="link" onClick={() => handleEdit(record)}>
                        ดูรายละเอียดรีวิว
                    </Button>

                    <Button color="danger" variant="outlined" type="link" danger onClick={() => handleDel(record)}>
                        ลบรีวิว
                    </Button>

                    <Popconfirm
                        title="ยืนยันการลบ?"
                        description={`ต้องการลบรายงานนี้ของ ${record.reporterName} ใช่หรือไม่`}
                        onConfirm={() => deleteReport(record.id)}
                        okText="ลบ"
                        cancelText="ยกเลิก"
                    >
                        <Button color="orange" variant="outlined" type="link" danger>
                            ลบรายงาน
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
        getReportReviewPaginate(pagination.current, pagination.pageSize)
    }

    const getReportReviewPaginate = async (page = 1, pageSize = 5) => {
        try {
            await axios.get(`${import.meta.env.VITE_BACKEND_URL}/review-api/get-paginate?page=${page}&pageSize=${pageSize}&search=${search}`, { withCredentials: true })
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
        getReportReviewPaginate(1, pagination.pageSize)
    }, [search])

    const [modalOpen, setModalOpen] = useState(false);
    const [modalUpdateOpen, setModalUpdateOpen] = useState(false)

    const [cLoading, setCLoading] = useState(false)

    const [currentData, setCurrentData] = useState()
    const [reviewId, setReviewId] = useState('')
    // const [userId, setUserId] = useState('')

    const handleEdit = (record) => {
        setCurrentData(record)
        if (currentData) {
            setReviewId(record.reviewId)
            setDetailKey(prev => prev + 1)
            setModalUpdateOpen(true)
        }
    }
    const [delData, setDelData] = useState()
    const [placeId, setPlaceId] = useState('')
    const [reviewIdDel, setReviewIdDel] = useState('')
    const [reviewerId, setReviewerId] = useState('')
    const [detail, setDetail] = useState('')

    const handleDel = (record) => {
        setDelData(record)
        if (delData) {
            setPlaceId(record.placeId)
            setReviewIdDel(record.reviewId)
            setReviewerId(record.reviewerId)
            setDetail('')
            setModalOpen(true)
        }
    }

    const deleteReview = async () => {
        setCLoading(true)
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/review-api/delete-review-from-report`, { placeId, reviewId: reviewIdDel, reviewerId, detail }, { withCredentials: true })
                .then((res) => {
                    console.log(res.data)
                    getReportReviewPaginate(pagination.current, pagination.pageSize)
                    setModalOpen(false)
                })
        } catch (err) {
            console.log(err)
            message.error(err.response.data.message)
        } finally {
            setCLoading(false)
        }
    }

    const deleteReport = async (id) => {
        setCLoading(true)
        try {
            console.log(id)
            await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/review-api/delete-report/${id}`, { withCredentials: true })
                .then((res) => {
                    console.log(res.data)
                    getReportReviewPaginate(pagination.current, pagination.pageSize)
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
        getReportReviewPaginate(pagination.current, pagination.pageSize)
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
                        <div className='text-md font-bold mb-5'>รีวิวที่ถูกรายงานทั้งหมด</div>
                        <div className=' mb-5 flex gap-3 items-center justify-between'>
                            <div className='w-full md:w-[400px]'>
                                <Input suffix={<SearchOutlined />} onChange={(e) => setSearch(e.target.value)} size='large' placeholder="ค้นหาชื่อผู้รีวิว/ชื่อผู้รายงาน" />
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
                                            value={detail || ''}
                                            showCount
                                            maxLength={100}
                                            onChange={(e) => setDetail(e.target.value)}
                                            placeholder="ระบุเหตุผล"
                                            style={{ height: 120, resize: 'none' }}
                                        />
                                    </div>
                                    <div className='flex justify-center'>
                                        <Button loading={cLoading} color="danger" variant="solid" danger size='large' onClick={deleteReview}>
                                            ยืนยันการลบรีวิว
                                        </Button>
                                    </div>
                                </div>
                            </Modal>
                            <Modal
                                title="ดูรายละเอียดรีวิว"
                                centered
                                open={modalUpdateOpen}
                                closable={{ 'aria-label': 'Custom Close Button' }}
                                footer={null}
                                onCancel={() => setModalUpdateOpen(false)}
                            >
                                <div className=''>
                                    {/* <DetailPlaceRequest detailKey={detailKey} placeRequestId={placeRequestId} onSuccess={handleUpdateSuccess} userId={userId} /> */}
                                    <ModalDetailReview reviewId={reviewId} detailKey={detailKey} />
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

export default ReportReview