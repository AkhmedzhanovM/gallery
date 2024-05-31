import { supabaseServer } from "@/app/utils/supabaseServerClient";
import Picture from "./Picture";


async function fetchPictures(){
    const folderPath = `gallery_folder/`
    const {data, error} = await supabaseServer.storage.from('gallery').list(folderPath)

    if(error){
        console.error(`Error fetching pictures`, error)
        return
    }
    return data
}

async function getPictureUrls(pictures){
    return Promise.all(pictures.map(async(picture) => {
        const {data, error} = await supabaseServer.storage.from('gallery').createSignedUrl(`gallery_folder/${picture.name}`, 60 * 60)
        if(error){
            console.error('Error generating signed url', error)
            return null
        }
        return {url: data.signedUrl, pictureName: picture.name}
    }))
}

async function fetchFavoritePictures(){
    const {data, error} = await supabaseServer
        .from('favorites')
        .select('picture_name')
    if(error){
        console.error('Error fetching favorites', error)
        return []
    }
    return data.map((favorite) => favorite.picture_name)
}

export default async function Gallery({favorites = false}){
    const pictures = await fetchPictures()
    const pictureObjects = await getPictureUrls(pictures)
    const favoritePictureNames = await fetchFavoritePictures()

    const picturesWithFavorites = pictureObjects.map((picture) => ({
        ...picture,
        isFavorited: favoritePictureNames.includes(picture.pictureName)
    }))

    const displayedPictures = favorites ? picturesWithFavorites.filter(picture => picture.isFavorited)
                                        : picturesWithFavorites

    return(
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