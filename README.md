# StyleLink - Fashion Deal Comparison Platform

**Your ultimate destination for comparing fashion deals from stores nationwide**

StyleLink is a modern, responsive web application that allows users to search, compare, and find the best deals on fashion items from various retailers across the country. Built with Next.js 16, TypeScript, and Tailwind CSS, featuring a sophisticated dark and smokey design with elegant cream accents.

## 🌟 Features

### Core Functionality
- **Smart Search**: Search for fashion items across multiple stores
- **Price Comparison**: Compare prices, discounts, and deals side-by-side
- **Real-time Updates**: Live pricing and availability information
- **Advanced Filtering**: Filter by category, price range, brand, and more
- **Wishlist & Alerts**: Save favorite items and get price drop notifications

### User Experience
- **Dark & Smokey Theme**: Sophisticated design with cream accents
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Interactive Interface**: Smooth animations and transitions
- **Accessibility**: Built with accessibility best practices

### Store Integration
- Support for 200+ partner stores
- Real-time inventory tracking
- Direct links to purchase
- Rating and review aggregation

## 🛠️ Technology Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React & Heroicons
- **Font**: Inter (body) & Playfair Display (headings)
- **Build Tool**: Turbopack (Next.js default)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Dpippin09/StyleLink.git
   cd StyleLink
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
StyleLink/
├── src/
│   ├── app/                    # App Router pages
│   │   ├── compare/           # Price comparison page
│   │   ├── globals.css        # Global styles & theme
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Homepage
│   └── components/
│       └── ui/                # Reusable UI components
│           ├── button.tsx
│           ├── card.tsx
│           └── input.tsx
├── public/                     # Static assets
├── tailwind.config.ts         # Tailwind configuration
├── next.config.ts             # Next.js configuration
└── package.json
```

## 🎨 Design System

### Color Palette
- **Background**: Deep black (#0a0a0a)
- **Cards**: Smokey dark (#1a1a1a)
- **Secondary**: Medium smoke (#2a2a2a)
- **Accent**: Cream (#f5f5f0)
- **Borders**: Light smoke (#3a3a3a)

### Typography
- **Headings**: Playfair Display (elegant serif)
- **Body**: Inter (clean sans-serif)

### Components
All components follow a consistent design system with:
- Rounded corners (8px radius)
- Smooth transitions (150ms)
- Hover states and focus indicators
- Dark theme optimization

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Key Features Implementation

#### Search & Filtering
```typescript
// Real-time search with category filtering
const filteredDeals = mockDeals.filter(deal => {
  const matchesSearch = deal.title.toLowerCase().includes(searchTerm.toLowerCase());
  const matchesCategory = selectedCategory === "All" || 
                         deal.category.toLowerCase() === selectedCategory.toLowerCase();
  return matchesSearch && matchesCategory;
});
```

#### Price Comparison
- Side-by-side store comparison
- Savings calculations
- Best deal highlighting
- Price history tracking

#### Responsive Design
- Mobile-first approach
- Flexible grid layouts
- Touch-friendly interactions

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- Heroku
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Future Enhancements

- [ ] User authentication & profiles
- [ ] Advanced price alerts
- [ ] Mobile app development
- [ ] AI-powered recommendations
- [ ] Social sharing features
- [ ] Price prediction algorithms
- [ ] Store partnership API integrations
- [ ] Advanced analytics dashboard

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

Created with ❤️ by the StyleLink team for fashion enthusiasts everywhere.

---

**StyleLink** - *Discover. Compare. Save.*
