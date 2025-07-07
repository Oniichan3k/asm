import ProductForm from '@/components/ProductForm'
import { redirect } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

export async function generateStaticParams() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { data, error } = await supabase.from('products').select('id')
  if (error) throw error
  return data.map((product: { id: string }) => ({ id: product.id }))
}

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !product) redirect('/')

  return (
    <div className="max-w-4xl mx-auto">
      <ProductForm product={product} isEdit />
    </div>
  )
}
