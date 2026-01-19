# Commerce Brain

A full-stack e-commerce application built with Next.js, featuring user authentication, product management, shopping cart, secure checkout with Stripe, and an admin dashboard.

## 🚀 Features

- **User Authentication**: Secure login/registration with NextAuth
- **Product Management**: Browse, search, and view detailed product information
- **Shopping Cart**: Add/remove items, persistent cart storage
- **Secure Checkout**: Integrated Stripe payment processing
- **Order Management**: Track orders and order history
- **Admin Dashboard**: Manage products, orders, and users
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **TypeScript**: Full type safety throughout the application
- **MongoDB**: NoSQL database for scalable data storage

## 🛠 Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Backend**: Next.js API routes
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **Payments**: Stripe
- **State Management**: React hooks, Context API

## 📋 Prerequisites

- Node.js 18+
- MongoDB database (local or cloud like MongoDB Atlas)
- Stripe account for payment processing
- npm or pnpm package manager

## 🔧 Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd commerce_brain
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory:
   ```env
   # MongoDB
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/commerce_brain?retryWrites=true&w=majority

   # NextAuth
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here

   # Stripe
   STRIPE_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_... (optional, for webhooks)
   ```

4. **Initialize the database:**
   ```bash
   node scripts/init-db.js
   ```
   This creates the necessary collections, indexes, and sample data including an admin user.

## 🚀 Usage

1. **Start the development server:**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

2. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

3. **Admin Access:**
   - Email: `admin@example.com`
   - Password: `admin123`

## 📜 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## 📁 Project Structure

```
commerce_brain/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── cart/              # Shopping cart page
│   ├── checkout/          # Checkout flow
│   ├── orders/            # Order management
│   └── products/          # Product pages
├── components/            # Reusable React components
│   ├── ui/               # UI components (Radix UI)
│   └── ...               # Custom components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and configurations
├── public/               # Static assets
├── scripts/              # Database initialization scripts
└── styles/               # Global styles
```

## 🔐 Authentication

The app uses NextAuth.js with multiple providers. Currently configured for credentials-based authentication with MongoDB storage.

## 💳 Payment Integration

Stripe is integrated for secure payment processing. The checkout flow includes:
- Cart review
- Shipping information
- Payment processing
- Order confirmation

## 📊 Admin Features

- Product CRUD operations
- Order management and tracking
- User management
- Analytics dashboard

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Payments powered by [Stripe](https://stripe.com/)
