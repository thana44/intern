import React from 'react'
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell,
} from 'recharts';
import Sidebar from '../components/Sidebar';
import { HomeOutlined } from '@ant-design/icons';
import NavAdmin from '../components/NavAdmin';
import axios from 'axios';
import { useState } from 'react';
import { useEffect } from 'react';

function Admin() {

    const COLORS = {
        5: '#22c55e',
        4: '#3b82f6',
        3: '#eab308',
        2: '#f97316',
        1: '#ef4444',
    }
    const [barData, setBarData] = useState([])
    const [pieData, setPieData] = useState([])

    const getDashBoard = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/dashboard-api/get-dashboard`,
                { withCredentials: true }
            )

            setBarData(
                [...res.data.companyData].sort((a, b) => b.value - a.value)
            )

            const defaultRatings = [5, 4, 3, 2, 1]

            const merged = defaultRatings.map(star => {
                const found = res.data.ratingData.find(r => r.rating === star)

                return {
                    name: `${star} ดาว`,
                    value: found ? parseFloat(found.percentage) : 0,
                    fill: COLORS[star]
                }
            })

            setPieData(merged)

        } catch (err) {
            console.log(err)
        }
    }


    const [getCount, setGetCount] = useState({})

    const getCountDash = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/dashboard-api/get-count-dash`,
                { withCredentials: true }
            )
            setGetCount(res.data)
        } catch (err) {
            console.log(err)
        }
    }


    useEffect(() => {
        getDashBoard()
        getCountDash()
    }, [])

    return (
        <div className='bg-white flex h-screen'>
            <div className='bg-white border border-gray-300 border-y-0 border-l-0'>
                <Sidebar />
            </div>
            <div className='bg-white w-full'>
                <div>
                    <NavAdmin />
                </div>
                <div className='mt-5 bg-white flex justify-center'>
                    <div className='bg-white px-3 pb-10 w-full lg:w-[80%]'>
                        <div className='text-md font-bold mb-5'>แดชบอร์ด</div>
                        <div className='bg-white grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
                            <div className='bg-purple-100 h-[140px] rounded-md shadow-md px-3 py-5'>
                                <span>จำนวนผู้ใช้งาน</span>
                                <div className='mt-3'>
                                    <h3 className='text-4xl font-bold'>{getCount?.users}</h3>
                                </div>
                            </div>
                            <div className='bg-blue-100 h-[140px] rounded-md shadow-md px-3 py-5'>
                                <span>จำนวนสถานที่ฝึก</span>
                                <div className='mt-3'>
                                    <h3 className='text-4xl font-bold'>{getCount?.places}</h3>
                                </div>
                            </div>
                            <div className='bg-red-100 h-[140px] rounded-md shadow-md px-3 py-5'>
                                <span>จำนวนรีวิว</span>
                                <div className='mt-3'>
                                    <h3 className='text-4xl font-bold'>{getCount?.reviews}</h3>
                                </div>
                            </div>
                        </div>

                        <div className='bg-white mt-5 grid grid-cols-1 lg:grid-cols-2 gap-3'>
                            <div className='bg-gray-200 rounded-md shadow-md py-5 px-3'>
                                <div>
                                    สถิติสถานที่ฝึก
                                </div>
                                <div className="overflow-x-auto no-scrollbar">
                                    <div style={{ minWidth: barData.length * 80 }}>
                                        <ResponsiveContainer width="100%" height={250}>
                                            <BarChart data={barData}>
                                                <XAxis
                                                    dataKey="name"
                                                    angle={-30}
                                                    textAnchor="end"
                                                    tick={{ fontSize: 10 }}
                                                />
                                                <YAxis />
                                                <Tooltip />
                                                <Bar dataKey="value" fill="#b0c6eb" radius={[8, 8, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                            <div className="overflow-x-auto bg-gray-200 rounded-md shadow-md py-5 px-3 no-scrollbar">
                                <div>
                                    คะแนนรีวิว
                                </div>
                                <div className="flex flex-nowrap gap-4">
                                    {/* Pie Chart */}
                                    <div className="flex-shrink-0" style={{ minWidth: 320 }}>
                                        <PieChart width={'100%'} height={250}>
                                            <Pie
                                                data={pieData}
                                                dataKey="value"
                                                nameKey="name"
                                                innerRadius={60}
                                                outerRadius={90}
                                                fill="#3B82F6"
                                            />
                                            <Tooltip />
                                        </PieChart>
                                    </div>

                                    {/* ข้อความด้านขวา */}
                                    <div className="flex-shrink-0 min-w-[180px] bg-transparent">
                                        <div className="flex justify-between px-4">
                                            <div>5 ดาว</div>
                                            <div>{pieData[0]?.value} %</div>
                                        </div>
                                        <div className="flex justify-between px-4">
                                            <div>4 ดาว</div>
                                            <div>{pieData[1]?.value} %</div>
                                        </div>
                                        <div className="flex justify-between px-4">
                                            <div>3 ดาว</div>
                                            <div>{pieData[2]?.value} %</div>
                                        </div>
                                        <div className="flex justify-between px-4">
                                            <div>2 ดาว</div>
                                            <div>{pieData[3]?.value} %</div>
                                        </div>
                                        <div className="flex justify-between px-4">
                                            <div>1 ดาว</div>
                                            <div>{pieData[4]?.value} %</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    )
}

export default Admin