-- Enable Row Level Security
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  brand TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  image_url TEXT,
  retailer TEXT NOT NULL,
  category TEXT,
  description TEXT,
  sizes TEXT[], -- Array of available sizes
  colors TEXT[], -- Array of available colors
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  in_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wishlist table
CREATE TABLE wishlists (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  date_added TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Shopping cart table
CREATE TABLE cart_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1 CHECK (quantity > 0),
  size TEXT,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id, size, color)
);

-- Orders table
CREATE TABLE orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  shipping_address JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price DECIMAL(10,2) NOT NULL,
  size TEXT,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Search history table
CREATE TABLE search_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  results_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security Policies

-- Profiles policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Wishlists policies
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own wishlist" ON wishlists FOR ALL USING (auth.uid() = user_id);

-- Cart items policies
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own cart" ON cart_items FOR ALL USING (auth.uid() = user_id);

-- Orders policies
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Order items policies
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own order items" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);

-- Search history policies
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own search history" ON search_history FOR ALL USING (auth.uid() = user_id);

-- Products are public (read-only for users)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view products" ON products FOR SELECT USING (true);

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Insert sample products
INSERT INTO products (title, brand, price, original_price, image_url, retailer, category, description, sizes, colors, rating, review_count) VALUES
('Silk Midi Dress', 'Everlane', 128.00, 160.00, '/hero-fashion.jpg.png', 'Everlane', 'Dresses', 'Elegant silk midi dress perfect for any occasion', ARRAY['XS', 'S', 'M', 'L', 'XL'], ARRAY['Black', 'Navy', 'Cream'], 4.5, 342),
('Classic White Shirt', 'COS', 89.00, NULL, '/woman-cardigan.jpg.png', 'COS', 'Tops', 'Timeless white cotton shirt', ARRAY['XS', 'S', 'M', 'L'], ARRAY['White'], 4.3, 156),
('Wool Coat', 'Acne Studios', 450.00, 520.00, '/man-beige-coat.jpg.png', 'Acne Studios', 'Outerwear', 'Premium wool coat with minimalist design', ARRAY['S', 'M', 'L', 'XL'], ARRAY['Beige', 'Black', 'Navy'], 4.7, 89),
('Leather Ankle Boots', 'Ganni', 295.00, NULL, '/woman-sunglasses.jpg.png', 'Ganni', 'Shoes', 'Stylish leather ankle boots', ARRAY['36', '37', '38', '39', '40', '41'], ARRAY['Black', 'Brown'], 4.4, 203),
('Cashmere Sweater', 'Arket', 149.00, NULL, '/hero-fashion.jpg.png', 'Arket', 'Knitwear', 'Luxurious cashmere sweater', ARRAY['XS', 'S', 'M', 'L'], ARRAY['Cream', 'Grey', 'Navy'], 4.6, 278),
('Tailored Trousers', 'Toteme', 320.00, 380.00, '/woman-cardigan.jpg.png', 'Toteme', 'Bottoms', 'Perfectly tailored wide-leg trousers', ARRAY['34', '36', '38', '40', '42'], ARRAY['Black', 'Grey'], 4.5, 167),
('Structured Blazer', 'The Frankie Shop', 275.00, NULL, '/man-beige-coat.jpg.png', 'The Frankie Shop', 'Outerwear', 'Oversized structured blazer', ARRAY['XS', 'S', 'M', 'L'], ARRAY['Black', 'Beige'], 4.3, 134),
('Platform Sandals', 'Ganni', 245.00, 295.00, '/woman-sunglasses.jpg.png', 'Ganni', 'Shoes', 'Trendy platform sandals', ARRAY['36', '37', '38', '39', '40'], ARRAY['Black', 'Tan'], 4.2, 192);
