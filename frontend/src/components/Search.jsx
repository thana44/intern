import React, { useEffect, useState } from 'react'
import { AutoComplete, Input } from 'antd';
import { DownOutlined, EnvironmentOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

function Search() {

    const [options, setOptions] = useState([])
    const [selectId, setSelectId] = useState()
    const [displayValue, setDisplayValue] = useState('')
    const navigate = useNavigate()
    const { provinceId } = useParams()
    const [searchParams, setSearchParams] = useSearchParams();
    const keyword = searchParams.get('keyword') || '';


    const getProvinceSelect = async () => {
        try {
            await axios.get(`${import.meta.env.VITE_BACKEND_URL}/province-api/get-select`)
                .then((res) => {
                    // console.log(res.data, 'province')
                    setOptions(res.data.province)
                })
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getProvinceSelect()
    }, [])

    useEffect(() => {
        if (!provinceId || options.length === 0) return;

        const selected = options.find(
            (item) => String(item.value) === String(provinceId)
        );

        if (selected) {
            setSelectId(selected.value);
            setDisplayValue(selected.label);
        }
    }, [provinceId, options]);


    // console.log('id selected', selectId)

    return (
        <div className='bg-white flex items-center gap-2'>
            <div className='bg-white'>
                <AutoComplete
                    style={{ width: 130 }}
                    value={displayValue}
                    className='w-full'
                    options={options}
                    placeholder="จังหวัด"
                    showSearch={{
                        filterOption: (inputValue, option) =>
                            option.label.toUpperCase().includes(inputValue.toUpperCase()),
                    }}
                    prefix={<EnvironmentOutlined className='text-gray-200' />}
                    suffix={<DownOutlined />}
                    onSelect={(value, option) => {
                        setSelectId(value)        //id
                        setDisplayValue(option.label) //name
                        navigate(`/search/${value}`)
                    }}
                    onChange={(text) => setDisplayValue(text)}
                />
            </div>
            <div className='bg-white'>
                <Input.Search style={{ width: 300 }} value={keyword} className='w-full' placeholder='ค้นหาสถานที่' onChange={(e) => {
                    setSearchParams({
                        keyword: e.target.value
                    });
                }} />
            </div>
        </div>
    )
}

export default Search