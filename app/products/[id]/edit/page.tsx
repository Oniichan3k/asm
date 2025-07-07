import ProductForm from '@/components/ProductForm'
import { supabase } from '@/lib/supabase'
import { redirect } from 'next/navigation'

export async function generateStaticParams() {
  const { createClient } = await import('@supabase/supabase-js')
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  const { data, error } = await supabase.from('products').select('id')
  if (error) throw error
  return data.map((product: { id: string }) => ({ id: product.id }))
}

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !product) {
    redirect('/')
  }

  return (
    <div className="max-w-4xl mx-auto">
      <ProductForm product={product} isEdit={true} />
    </div>
  )
}