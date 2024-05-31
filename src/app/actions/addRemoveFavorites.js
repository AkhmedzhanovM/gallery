'use server'

import { createServerClient } from "@supabase/ssr";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function addRemoveFavorites(formData){
    const pictureName  = formData.get('pictureName')
    const isFavorited = formData.get('isFavorited')

    const cookieStore = cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                get(name){
                    return cookieStore.get(name)?.value
                },
                set(name){
                    cookieStore.set({name, value, ...options})
                },
                remove(name, options){
                    cookieStore.set({name, value: '', ...options})
                }
            }
        }
    )

    if (isFavorited === 'true'){
        const {error} = await supabase
            .from('favorites')
            .delete()
            .match({picture_name: pictureName})
        if (error){
            return {success: false, error}
        }
    } else {
        const {error} = await supabase
            .from('favorites')
            .insert([{picture_name: pictureName}])
        
        if (error){
                return {success: false, error}
            }
    }
    revalidatePath('/gallery')
    revalidatePath('/favorites')

    return {success: true}
}