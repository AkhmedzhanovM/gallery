import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Picture from "./Picture";

async function fetchPictures(supabaseServer){

    const folderPath = `gallery_folder/`
    const {data,error} = await supabaseServer.storage
        .from('gallery')
        .list(folderPath)

    if (error){
        console.error('Error fetching photos', error)
        return
    }
    return data;
}

async function getPictureUrls(pictures, supabaseServer){
    return Promise.all(pictures.map(async (picture) => {
        const {data, error} = await supabaseServer.storage
            .from('gallery')
            .createSignedUrl(`gallery_folder/${picture.name}`, 60 * 60)
        if (error){
            console.error('Error generating signed url', error)
            return null
        }
        return {url: data.signedUrl, pictureName: picture.name}
    }))
}

async function fetchFavorites(supabaseServer){
    const {data, error} = await supabaseServer
        .from('favorites')
        .select('picture_name')

    if (error){
        console.error(`Error fetching favorites`, error)
        return []
    }
    return data.map((favorite) => favorite.picture_name)
}

export default async function Gallery({favorites = false}){
    const cookieStore = cookies();

    const supabaseServer = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                get(name){
                    return cookieStore.get(name)?.value
                }
            }
        }
    )


    const pictures = await fetchPictures(supabaseServer)
    const pictureObjects = await getPictureUrls(pictures, supabaseServer);
    const favoritePictureNames = await fetchFavorites(supabaseServer);

    const picturesWithFavorites = pictureObjects.map((picture) => ({
        ...picture,
        isFavorited: favoritePictureNames.includes(picture.pictureName)
    }))

    const displayedPictures = favorites 
        ? picturesWithFavorites.filter(picture => picture.isFavorited)
        : picturesWithFavorites

    return (
        <div className="flex flex-wrap justify-center gap-4">
            {
                displayedPictures.map((picture) => (
                    <Picture
                        key={picture.pictureName}
                        src={picture.url}
                        alt={`Picture ${picture.pictureName}`}
                        width={200}
                        height={200}
                        pictureName={picture.pictureName}
                        isFavorited={picture.isFavorited}
                    />
                ))
            }
        </div>
    )
}