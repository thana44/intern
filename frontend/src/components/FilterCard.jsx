import React, { useState } from 'react'
import { Checkbox, Radio } from 'antd';

function FilterCard({ placeTypes, selectedPlaceTypeId, onChangePlaceType, selectedRating,
    onChangeRating, districts, selectedDistrictIds, onChangeDistrict, onClearAll }) {
    const [value, setValue] = useState();
    const [rating, setRating] = useState()

    const onChange = e => {
        setValue(e.target.value);
    };

    const plainOptions = ['Apple', 'Pear', 'Orange'];

    const onChangeCheckBox = checkedValues => {
        console.log('checked = ', checkedValues);
    };

    const hasFilter =
        selectedPlaceTypeId ||
        selectedRating ||
        selectedDistrictIds.length > 0;

    return (
        <div className='bg-white py-5 px-3 rounded-lg md:shadow-md'>
            <div>
                <div className='mb-2 flex items-center justify-between'>
                    <div>
                        <h1 className='text-md font-bold'>ประเภทบริษัท</h1>
                    </div>
                    <div>
                        {hasFilter && (
                            <button
                                onClick={onClearAll}
                                className="text-sm text-red-500"
                            >
                                เคลียร์ทั้งหมด
                            </button>
                        )}
                    </div>
                </div>
                <div>
                    <Radio.Group
                        className="flex flex-col gap-2"
                        value={selectedPlaceTypeId}
                        onChange={(e) => onChangePlaceType(e.target.value)}
                    >
                        {placeTypes.map((item) => (
                            <div key={item.value}>
                                <Radio key={item.value} value={item.value}>
                                    {item.label}
                                </Radio>
                            </div>
                        ))}
                    </Radio.Group>
                </div>
            </div>

            <div className='border border-black border-x-0 py-2 my-2'>
                <div className='mb-2'>
                    <h1 className='text-md font-bold'>เรตติ้ง</h1>
                </div>
                <div>
                    <Radio.Group
                        vertical
                        onChange={(e) => onChangeRating(e.target.value)}
                        value={selectedRating}
                        options={[
                            { value: 5, label: '5.0' },
                            { value: 4, label: '4.0+' },
                            { value: 3, label: '3.0+' },
                        ]}
                    />
                </div>
            </div>

            <div>
                <div className='mb-2'>
                    <h1 className='text-md font-bold'>เขต/อำเภอ</h1>
                </div>
                <div>
                    <Checkbox.Group
                        className="flex flex-col gap-2"
                        value={selectedDistrictIds}
                        onChange={(checkedValues) => onChangeDistrict(checkedValues)}
                    >
                        {districts.map((item) => (
                            <Checkbox key={item.value} value={item.value}>
                                {item.label}
                            </Checkbox>
                        ))}
                    </Checkbox.Group>
                </div>
            </div>

        </div>
    )
}

export default FilterCard