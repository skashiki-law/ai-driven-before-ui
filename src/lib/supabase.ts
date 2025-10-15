import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.warn('Supabase環境変数が設定されていません。.env.localファイルにNEXT_PUBLIC_SUPABASE_URLとNEXT_PUBLIC_SUPABASE_ANON_KEYを設定してください。')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 画像アップロード用の関数
export const uploadImage = async (file: File, path: string) => {
  const { data, error } = await supabase.storage
    .from('images')
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) {
    throw error
  }

  return data
}

// 画像URL取得用の関数
export const getImageUrl = (path: string) => {
  const { data } = supabase.storage
    .from('images')
    .getPublicUrl(path)

  return data.publicUrl
}

// 画像削除用の関数
export const deleteImage = async (path: string) => {
  const { error } = await supabase.storage
    .from('images')
    .remove([path])

  if (error) {
    throw error
  }
}
