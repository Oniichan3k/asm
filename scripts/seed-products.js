const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

// Use environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  console.error('Please check your .env.local file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const templateProducts = [
  {
    name: "Classic White T-Shirt",
    description: "Premium cotton blend t-shirt with a comfortable fit. Perfect for everyday wear or layering. Made from 100% organic cotton with a soft, breathable fabric.",
    price: 29.99,
    image: "https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    name: "Denim Jacket",
    description: "Vintage-style denim jacket with classic button closure. Features multiple pockets and a timeless design that never goes out of style.",
    price: 89.99,
    image: "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    name: "Black Leather Boots",
    description: "Genuine leather ankle boots with durable construction. Perfect for both casual and formal occasions. Water-resistant and comfortable for all-day wear.",
    price: 149.99,
    image: "https://images.pexels.com/photos/336372/pexels-photo-336372.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    name: "Striped Long Sleeve Shirt",
    description: "Casual striped shirt with long sleeves. Made from soft cotton blend fabric. Great for layering or wearing on its own.",
    price: 45.99,
    image: "https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    name: "Blue Skinny Jeans",
    description: "Modern skinny fit jeans in classic blue wash. Comfortable stretch denim with a flattering silhouette. Perfect for everyday wear.",
    price: 79.99,
    image: "https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    name: "Wool Sweater",
    description: "Cozy wool blend sweater with ribbed cuffs and hem. Soft and warm, perfect for cooler weather. Available in multiple colors.",
    price: 95.99,
    image: "https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    name: "Summer Dress",
    description: "Lightweight floral summer dress with a flowing silhouette. Perfect for warm weather occasions. Made from breathable cotton fabric.",
    price: 65.99,
    image: "https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    name: "Athletic Sneakers",
    description: "Comfortable athletic sneakers with cushioned sole. Great for workouts, running, or casual wear. Breathable mesh upper for comfort.",
    price: 119.99,
    image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    name: "Formal Blazer",
    description: "Tailored blazer perfect for business or formal occasions. Classic cut with modern styling. Made from premium fabric blend.",
    price: 159.99,
    image: "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    name: "Casual Hoodie",
    description: "Comfortable pullover hoodie with kangaroo pocket. Soft fleece interior for warmth. Perfect for casual outings or lounging.",
    price: 55.99,
    image: "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    name: "Silk Scarf",
    description: "Elegant silk scarf with beautiful pattern. Versatile accessory that can be worn multiple ways. Adds sophistication to any outfit.",
    price: 39.99,
    image: "https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    name: "Cargo Pants",
    description: "Utility-style cargo pants with multiple pockets. Durable fabric with comfortable fit. Great for outdoor activities or casual wear.",
    price: 69.99,
    image: "https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=800"
  }
]

async function seedProducts() {
  try {
    console.log('Starting to seed products...')
    
    // Check if products already exist
    const { data: existingProducts, error: checkError } = await supabase
      .from('products')
      .select('id')
      .limit(1)

    if (checkError) {
      console.error('Error checking existing products:', checkError)
      return
    }

    if (existingProducts && existingProducts.length > 0) {
      console.log('Products already exist in the database. Skipping seed.')
      return
    }
    
    // Insert products
    const { data, error } = await supabase
      .from('products')
      .insert(templateProducts)
      .select()

    if (error) {
      console.error('Error inserting products:', error)
      return
    }

    console.log(`Successfully added ${data.length} products:`)
    data.forEach(product => {
      console.log(`- ${product.name} ($${product.price})`)
    })
    
  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

seedProducts()