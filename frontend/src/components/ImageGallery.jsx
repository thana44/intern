import { Image } from 'antd';
import React from 'react'
import { useNavigate } from 'react-router-dom';

const ImageGallery = ({ images, placeId }) => {
    const count = images?.length;
    const navigate = useNavigate()

    const goToAllPhoto = () => {
        if (placeId) {
            return navigate(`/all-photo/${placeId}`)
        }
    }

    // 1 รูป
    if (count === 1) {
        return (
            <Image
                width={'100%'}
                height={306}
                src={images[0]}
                className="object-cover rounded-xl"
            />
        );
    }

    // 2 รูป
    if (count === 2) {
        return (
            <div className="grid grid-cols-2 gap-2">
                {images.map((img, i) => (
                    <Image
                        width={'100%'}
                        height={306}
                        key={i}
                        src={img}
                        className="h-[300px] w-full object-cover rounded-xl"
                    />
                ))}
            </div>
        );
    }

    // >= 5 รูป (layout แบบตัวอย่าง)
    if (count >= 5) {
        return (
            <div className="grid grid-cols-2">
                {/* รูปใหญ่ซ้าย */}
                <div className='bg-transparent'>
                    <Image className='object-cover rounded-xl' width='100%' height={306} src={images[0]} />
                </div>

                {/* 4 รูปขวา */}
                <div className='bg-transparent grid grid-cols-2'>
                    {images.slice(1, 5).map((img, i) => (
                        <div key={i} className="relative ml-2">
                            <Image
                                width='100%' height={150}
                                src={img}
                                className="h-full w-full object-cover rounded-xl"
                            />

                            {/* overlay +X */}
                            {i === 3 && count > 5 && (
                                <div onClick={goToAllPhoto} className="absolute w-full top-0 h-[150px] bg-black/50 flex items-center justify-center text-white text-2xl font-semibold rounded-xl hover:cursor-pointer">
                                    +{count - 5}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (count === 3) {
        return (
            <div className="grid grid-cols-2">
                <div className='bg-transparent'>
                    <Image className='object-cover rounded-xl' width='100%' height={306} src={images[0]} />
                </div>
                <div className='grid grid-cols-1'>
                    {images.slice(1,).map((img, i) => (
                        <div key={i} className='ml-2'>
                            <Image
                                width={'100%'}
                                height={150}
                                key={i}
                                src={img}
                                className="h-[200px] w-full object-cover rounded-xl"
                            />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // 3–4 รูป
    return (
        <div className="grid grid-cols-2">
            <div className='bg-transparent'>
                <Image className='object-cover rounded-xl' width='100%' height={306} src={images[0]} />
            </div>
            <div className='grid grid-cols-2'>
                {images.slice(1,).map((img, i) => (
                    <div key={i} className='ml-2'>
                        <Image
                            width={'100%'}
                            height={150}
                            key={i}
                            src={img}
                            className="h-[200px] w-full object-cover rounded-xl"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};


export default ImageGallery