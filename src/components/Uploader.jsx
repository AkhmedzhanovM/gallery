'use client'

import { supabase } from "@/app/utils/supabaseClient"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Uploader(){
    const [uploading, setUploading] = useState(false)
    const router = useRouter()

    async function handleUpload(e){
        try{
            setUploading(true)
            const file = e.target.files[0]
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `gallery_folder/${fileName}`
            const {err} = await supabase.storage.from('gallery').upload(filePath, file)
            if(err){
                throw err
            }

            await fetch('/api/revalidate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({path: '/pictures'})
            })
            
            router.refresh()
        }catch(err){
            console.error(err)
        }finally{
            setUploading(false)
        }
    }

    return(
        <label
            className=""
            htmlFor="uploader"
        >
            {uploading ? 'Uploading...' : 'Upload photo'}
            <input
                className=""
                type="file"
                id="uploader"
                onChange={handleUpload}
                disabled={uploading}
            />
        </label>
    )
}