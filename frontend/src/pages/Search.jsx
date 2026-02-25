import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import FilterCard from '../components/FilterCard'
import PlaceCard from '../components/PlaceCard'
import { Drawer, Modal } from 'antd'
import { useParams, useSearchParams } from 'react-router-dom'
import axios from 'axios'

function Search() {
    const [openResponsive, setOpenResponsive] = useState(false)
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get('keyword');
    const [placeTypes, setPlaceTypes] = useState([]);
    const [selectedPlaceTypeId, setSelectedPlaceTypeId] = useState(null);

    const [selectedRating, setSelectedRating] = useState(null)

    const [districts, setDistricts] = useState([]);
    const [selectedDistrictIds, setSelectedDistrictIds] = useState([]);


    const [places, setPlaces] = useState([]);


    const { provinceId } = useParams()
    // console.log(provinceId, 'from main search')
    // console.log(selectedPlaceTypeId, 'select place type from main search')
    // console.log(selectedRating, 'select rating from main search')
    // console.log(selectedDistrictIds, 'select district from main search')
    // console.log(keyword, 'keyword from main search')

    const getPlaceType = async () => {
        try {
            const result = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/place-type-api/get-place-type-select`, { withCredentials: true })
            // console.log(result.data, 'test get place type')
            setPlaceTypes(result.data.placeType)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getPlaceType()
    }, [])


    const getDistrict = async () => {
        try {
            const result = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/district-api/get-select/${provinceId}`, { withCredentials: true })
            // console.log(result.data, 'test get district')
            setDistricts(result.data.district);
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        if (!provinceId) return;
        getDistrict();
    }, [provinceId]);

    const handleClearAllFilter = () => {
        setSelectedPlaceTypeId(null);
        setSelectedRating(null);
        setSelectedDistrictIds([]);
    };

    const [showProvince, setShowProvince] = useState('')
    const getPlaceFilter = async () => {
        try {
            const result = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/place-api/get-filter`, {
                provinceId, placeTypeId: selectedPlaceTypeId, rating: selectedRating, districtId: selectedDistrictIds,
                search: keyword
            }, { withCredentials: true })
            // console.log(result.data, 'place filter')
            setPlaces(result.data.data)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getPlaceFilter()
    }, [provinceId, selectedPlaceTypeId, selectedRating, selectedDistrictIds, keyword])

    const getNameProvince = async () => {
        try {
            const result = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/province-api/get-name/${provinceId}`, {}, { withCredentials: true })
            // console.log(result.data, 'prvince name')
            setShowProvince(result.data.province[0].name)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getNameProvince()
    }, [provinceId])

    const handleSave = () => {
        getPlaceFilter()
    }


    return (
        <div className='bg-gray-200 min-h-screen'>
            <Drawer
                title="ตัวกรอง"
                closable={{ placement: 'end' }}
                onClose={() => setOpenResponsive(false)}
                open={openResponsive}
            >
                <FilterCard placeTypes={placeTypes}
                    selectedPlaceTypeId={selectedPlaceTypeId}
                    onChangePlaceType={setSelectedPlaceTypeId}

                    onChangeRating={setSelectedRating}
                    selectedRating={selectedRating}

                    districts={districts}
                    selectedDistrictIds={selectedDistrictIds}
                    onChangeDistrict={setSelectedDistrictIds}

                    onClearAll={handleClearAllFilter} />
            </Drawer>
            <Navbar />
            <div className='bg-transparent flex justify-center min-h-screen'>
                <div className='bg-transparent w-[90%] sm:w-[80%] md:w-[90%] xl:w-[80%] mt-15'>
                    <div className='bg-transparent flex items-center justify-between'>
                        <h1 className='text-xl font-extrabold'>ภายใน {showProvince && showProvince}</h1>
                        <div onClick={() => setOpenResponsive(true)} className='block md:hidden text-blue-500'>
                            ตัวกรอง
                        </div>
                    </div>
                    <div className='bg-transparent grid md:grid-cols-[0.3fr_0.7fr] gap-3 mt-5'>
                        <div className='hidden md:block'>
                            <FilterCard placeTypes={placeTypes}
                                selectedPlaceTypeId={selectedPlaceTypeId}
                                onChangePlaceType={setSelectedPlaceTypeId}

                                onChangeRating={setSelectedRating}
                                selectedRating={selectedRating}

                                districts={districts}
                                selectedDistrictIds={selectedDistrictIds}
                                onChangeDistrict={setSelectedDistrictIds}

                                onClearAll={handleClearAllFilter} />
                        </div>
                        <div className='bg-transparent flex flex-col gap-5 pb-5'>
                            {
                                places?.length > 0 ? places?.map((item) => {
                                    return <PlaceCard key={item.id} data={item} onSaveSearch={handleSave} />
                                })
                                    : <h2 className='text-center mt-10 text-sm text-gray-500'>ไม่พบสถานที่ฝึกงาน</h2>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Search