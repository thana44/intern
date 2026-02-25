import React, { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import { ExportOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

function MapCard() {

    const mapRef = useRef(null)
    const mapContainerRef = useRef(null)
    const markerRef = useRef(null)

    const reviewData = useSelector((x) => x.review.reviewData)
    const lat = parseFloat(reviewData?.latitude)
    const lng = parseFloat(reviewData?.longitude)

    // console.log(lat, lng)

    const Map = (lat, lng) => {
        try {
            // สร้าง Map
            const map = new mapboxgl.Map({
                language: 'th',
                container: mapContainerRef.current,
                style: 'mapbox://styles/mapbox/streets-v12',
                center: [lng, lat],
                zoom: 12
            })

            mapRef.current = map

            // Marker
            const marker = new mapboxgl.Marker({ draggable: false })
            markerRef.current = marker
            marker.setLngLat([lng, lat]).addTo(map)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        if (lat && lng) {
            Map(lat, lng)
        }
    }, [lat, lng, reviewData])

    const openGoogleMap = () => {
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank')
    }


    return (
        <div className='bg-white py-5 px-3 rounded-lg shadow-md hover:cursor-pointer'>
            <div className='flex items-center justify-between'>
                <h1 className='text-md font-bold mb-2'>ดูเส้นทาง</h1>
                <div onClick={openGoogleMap} className='flex items-center gap-2 duration-200 hover:opacity-60'>
                    <ExportOutlined style={{ color: 'gray' }} />
                    <span className='text-sm text-gray-500'>เปิดบน Google Map</span>
                </div>
            </div>
            <div className='rounded-lg overflow-hidden'>
                {/* <div style={{ marginBottom: 10 }}>
                    <div><b>ที่อยู่:</b> {address}</div>
                    <div><b>Lat:</b> {lat}</div>
                    <div><b>Lng:</b> {lng}</div>
                    <button onClick={''} disabled={!lat}>
                        บันทึกตำแหน่ง
                    </button>
                </div> */}

                <div
                    ref={mapContainerRef}
                    style={{ width: '100%', height: '300px' }}
                />
            </div>
        </div>
    )
}

export default MapCard