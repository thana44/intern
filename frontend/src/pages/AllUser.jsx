import { PlusSquareOutlined, SearchOutlined, WarningOutlined } from '@ant-design/icons';
import { Button, Input, message, Modal, Popconfirm, Select, Space, Table, Tag } from 'antd';
import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import NavAdmin from '../components/NavAdmin';
import { useNavigate } from 'react-router-dom';
import DetailPlaceRequest from '../components/DetailPlaceRequest';
import TextArea from 'antd/es/input/TextArea';
import DetailProfile from '../components/DetailProfile';

function AllUser() {
  const columns = [
    {
      title: 'ไอดี',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: 'ชื่อผู้ใช้',
      dataIndex: 'username',
      key: 'username'
    },
    {
      title: 'สถานะบัญชี',
      dataIndex: 'verifyAccount',
      key: 'verifyAccount',
      render: (verifyAccount) => {
        if (verifyAccount === 1) {
          return <Tag style={{ fontSize: '14px' }} color="green">ยืนยันตัวตนแล้ว</Tag>;  // ถ้าเป็น 1 ให้แสดงสีเขียว
        } else {
          return <Tag style={{ fontSize: '14px' }} color="red">ยังไม่ยืนยันตัวตน</Tag>;  // ถ้าเป็น 0 ให้แสดงสีแดง
        }
      },
    },
    {
      title: "จัดการ",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button color="primary" variant="outlined" type="link" onClick={() => handleEdit(record)}>
            ดูข้อมูลผู้ใช้
          </Button>

          <Button color="danger" variant="outlined" type="link" danger onClick={() => handleDel(record)}>
            ระงับบัญชี
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
    getUserPaginate(pagination.current, pagination.pageSize)
  }

  const getUserPaginate = async (page = 1, pageSize = 5) => {
    try {
      await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user-api/get-paginate-all-user?page=${page}&pageSize=${pageSize}&search=${search}`, { withCredentials: true })
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
    getUserPaginate(1, pagination.pageSize)
  }, [search])

  const [modalOpen, setModalOpen] = useState(false);
  const [modalUpdateOpen, setModalUpdateOpen] = useState(false)

  const [cLoading, setCLoading] = useState(false)

  const [currentData, setCurrentData] = useState()
  const [userId, setUserId] = useState('')

  const handleEdit = (record) => {
    setCurrentData(record)
    if (currentData) {
      setUserId(record.id)
      setDetailKey(prev => prev + 1)
      setModalUpdateOpen(true)
    }
  }
  const [delData, setDelData] = useState()
  const [delId, setDelId] = useState('')

  const handleDel = (record) => {
    setDelData(record)
    if (delData) {
      setDelId(record.id)
      setModalOpen(true)
    }
  }

  console.log(delId, ' del id')
  const handleBlockUser = async () => {
    setCLoading(true)
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/user-api/block-user-from-all/${delId}`, {}, { withCredentials: true })
        .then((res) => {
          console.log(res.data)
          getUserPaginate(pagination.current, pagination.pageSize)
          setModalOpen(false)
        })
    } catch (err) {
      console.log(err)
      message.error(err.response.data.message)
    } finally {
      setCLoading(false)
    }
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
            <div className='text-md font-bold mb-5'>ผู้ใช้งานทั้งหมด</div>
            <div className=' mb-5 flex gap-3 items-center justify-between'>
              <div className='w-full md:w-[400px]'>
                <Input suffix={<SearchOutlined />} onChange={(e) => setSearch(e.target.value)} size='large' placeholder="ค้นหาชื่อผู้ใช้" />
              </div>

              <Modal
                title="ยืนยันการระงับบัญชี"
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
                        คุณต้องการระงับบัญชีผู้ใช้นี้ใช่หรือไม่
                      </div>
                    </div>
                  </div>
                  <div className='flex justify-center'>
                    <Button loading={cLoading} color="danger" variant="solid" danger size='large' onClick={handleBlockUser}>
                      ระงับบัญชี
                    </Button>
                  </div>
                </div>
              </Modal>
              <Modal
                title="รายละเอียดข้อมูลผู้ใช้"
                centered
                open={modalUpdateOpen}
                closable={{ 'aria-label': 'Custom Close Button' }}
                footer={null}
                onCancel={() => setModalUpdateOpen(false)}
              >
                <div className=''>
                  <DetailProfile profileId={userId} detailKey={detailKey} />
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

export default AllUser