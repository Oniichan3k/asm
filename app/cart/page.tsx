'use client'

import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, getTotal } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)

  const handlePlaceOrder = async () => {
    if (!user) {
      router.push('/login')
      return
    }

    if (items.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    setIsPlacingOrder(true)
    try {
      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          user_id: user.id,
          total_amount: getTotal(),
          status: 'pending'
        }])
        .select()
        .single()

      if (orderError) throw orderError

      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) throw itemsError

      clearCart()
      toast.success('Order placed successfully!')
      router.push('/orders')
    } catch (error) {
      console.error('Error placing order:', error)
      toast.error('Failed to place order')
    } finally {
      setIsPlacingOrder(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingBag className="h-24 w-24 text-gray-400 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">Start shopping to add items to your cart</p>
        <Button onClick={() => router.push('/')}>
          Continue Shopping
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="relative w-20 h-20">
                    <Image
                      src={item.image || 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400'}
                      alt={item.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-gray-600">${item.price}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                      className="w-20 text-center"
                      min="1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${getTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${getTotal().toFixed(2)}</span>
                </div>
              </div>
              <Button
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder}
                className="w-full"
              >
                {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/')}
                className="w-full"
              >
                Continue Shopping
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}