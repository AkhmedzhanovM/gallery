'use client'

import Image from "next/image"
import { useState } from "react"
import Modal from "./Modal"
import { Heart, HeartOff, Trash } from "lucide-react"
import { deletePicture } from "@/app/actions/delete"
import { addRemoveFavorites } from "@/app/actions/addRemoveFavorites"

export default function Picture({src, alt, width, height, pictureName, isFavorited = false}){
    const [modal, setModal] = useState(false)

    function toggleModal(){
        setModal(!modal)
    }

    return(
        <>
            <div
                className="relative w-auto h-auto shadow-md border border-white border-opacity-80 rounded-lg overflow-hidden cursor-pointer"
                style={{width, height}}
            >
                <form
                    className="absolute bottom-2.5 right-10 z-10"
                    action={deletePicture}
                >
                    <input
                        type="hidden"
                        name="picturePath"
                        value={src}
                    />
                    <button 
                        className="bg-transparent border-none text-white cursor-pointer hover:text-red-500 hover:scale-110 transition duration-300"
                        type="submit"
                    >
                        <Trash />
                    </button>
                </form>

                <form
                    action={addRemoveFavorites}
                    className="absolute bottom-2.5 right-2.5 z-10"
                >
                    <input type="hidden" name="pictureName" value={pictureName} />
                    <input type="hidden" name="isFavorited" value={isFavorited} />
                    <button 
                        type="submit"
                        className="bg-transparent border-none text-white cursor-pointer hover:text-green-500 hover:scale-110 transition-300"
                    >
                        {isFavorited ? <Heart /> : <HeartOff />}
                    </button>
                </form>

                <Image
                    src={src}
                    alt={alt}
                    layout={true}
                    width={width}
                    height={height}
                    style={{objectFit: 'cover', objectPosition: 'center'}}
                    onClick={() => setModal(true)}
                />
            </div>
            {
                modal && <Modal src={src} alt={alt} width={width} height={height} onClose={toggleModal} />
            }
        </>
    )
}