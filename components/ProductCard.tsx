'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Edit, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string | null
  created_at: string
}

interface ProductCardProps {
  product: Product
  onDelete?: (id: string) => void
}

export default function ProductCard({ product, onDelete }: ProductCardProps) {
  const { user } = useAuth()
  const { addItem } = useCart()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    })
    toast.success('Added to cart!')
  }

  const handleDelete = async () => {
    if (!user) return
    
    setIsDeleting(true)
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', product.id)

      if (error) throw error

      toast.success('Product deleted successfully')
      onDelete?.(product.id)
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('Failed to delete product')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="aspect-square relative overflow-hidden">
        <Image
          src={product.image || 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400'}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Badge variant="secondary" className="bg-white/90">
            ${product.price}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-blue-600">${product.price}</span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button onClick={handleAddToCart} className="flex-1">
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
        
        {user && (
          <>
            <Link href={`/products/${product.id}/edit`}>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4" />
              </Button>
            </Link>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  )
}