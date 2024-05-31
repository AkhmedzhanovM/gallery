'use client'

import Image from "next/image"

export default function Modal({src, width, height, alt, onClose}){
    if(!src) return null

    return(
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
            <div className="bg-gray-800 p-4 rounded-lg relative border border-gray-600">
                <button
                    className="text-gray-300 hover:text-white mb-2"
                    onClick={onClose}
                >
                    Close
                </button>
                <div className="relative w-[80vw] h-[80vh]">
                    <Image
                        className="rounded-lg"
                        src={src}
                        width={width}
                        height={height}
                        alt={alt}
                        style={{objectFit: 'cover', objectPosition: 'center'}}
                    />
                </div>
            </div>
        </div>
    )
}