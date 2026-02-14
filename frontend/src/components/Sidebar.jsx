import React, { useState } from 'react'
import {
    AppstoreOutlined,
    AuditOutlined,
    BankOutlined,
    ContainerOutlined,
    DesktopOutlined,
    IdcardOutlined,
    MailOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    PieChartOutlined,
    SolutionOutlined,
    TeamOutlined,
} from '@ant-design/icons'
import { Button, Menu } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'

const items = [
    {
        key: '/admin',
        icon: <PieChartOutlined />,
        label: 'แดชบอร์ด',
    },
    {
        key: 'sub4',
        icon: <IdcardOutlined />,
        label: 'จัดการผู้ใช้งาน',
        children: [
            {
                key: '/all-user',
                label: 'ผู้ใช้งานทั้งหมด',
            },
            {
                key: '/report-user',
                label: 'ผู้ใช้งานที่ถูกรายงาน',
            },
            {
                key: '/verify-account',
                label: 'คำขอยืนยันตัวตน',
            },
        ],
    },
    {
        key: 'sub1',
        icon: <BankOutlined />,
        label: 'สถานที่ฝึก',
        children: [
            {
                key: '/all-place',
                label: 'สถานที่ฝึกทั้งหมด',
            },
            {
                key: '/place-request',
                label: 'คำขอเพิ่มสถานที่ฝึก',
            },
            {
                key: '/place-request-edit',
                label: 'คำขอแก้ไขสถานที่ฝึก',
            },
        ],
    },
    {
        key: 'sub2',
        label: 'รีวิว',
        icon: <TeamOutlined />,
        children: [
            {
                key: '/all-review',
                label: 'ดูรีวิวทั้งหมด',
            },
            {
                key: '/report-review',
                label: 'รีวิวที่ถูกรายงาน',
            },
        ],
    },
    {
        key: 'sub3',
        label: 'จัดการหมวดหมู่',
        icon: <AuditOutlined />,
        children: [
            {
                key: '/place-type',
                label: 'ประเภทธุรกิจ',
            },
            {
                key: '/province',
                label: 'จังหวัด',
            },
            {
                key: '/district',
                label: 'เขต/อำเภอ',
            },
        ],
    },
    {
        key: '/all-question',
        icon: <MailOutlined />,
        label: 'คำถาม',
    },
]

const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <div className='pl-2 pt-4'>
                <Button
                    type="primary"
                    onClick={() => setCollapsed(!collapsed)}
                    style={{ marginBottom: 16 }}
                >
                    {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                </Button>
            </div>

            <Menu
                theme="light"
                mode="inline"
                inlineCollapsed={collapsed}
                selectedKeys={[location.pathname]}   // ⭐ highlight menu
                onClick={({ key }) => navigate(key)} // ⭐ เปลี่ยนหน้า
                items={items}
            />
        </div>
    )
}

export default Sidebar
