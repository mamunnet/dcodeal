# E-Commerce Progressive Web App

A modern e-commerce Progressive Web App (PWA) built with React, TypeScript, and Firebase.

## Features

- 🛍️ Product browsing and searching
- 🛒 Shopping cart functionality
- 📱 Mobile-first design
- 🔐 User authentication (Phone & Email)
- 👤 User profile management
- 📦 Order tracking
- 🎨 Category management
- 📊 Admin dashboard
- 🔥 Real-time updates with Firebase

## Security Features

- 🔒 Environment variable protection
- 🛡️ Strict Firestore security rules
- 🔑 Role-based access control
- 📝 Input validation and sanitization
- 🚫 Rate limiting
- 🔐 Password strength requirements
- 🔄 Session management
- 📱 Phone number verification
- 🚧 XSS protection
- 🛑 CSRF prevention

## Tech Stack

- React + TypeScript
- Vite
- Firebase (Auth, Firestore, Storage)
- TailwindCSS
- React Router
- Framer Motion

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account

## Security Setup

1. Create a Firebase project with enhanced security:
   - Enable Email/Password and Phone authentication
   - Set up proper security rules
   - Configure proper OAuth settings

2. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Update with your secure configuration.

3. Configure Firebase Security Rules:
   ```bash
   firebase deploy --only firestore:rules
   ```

4. Set up admin access:
   - Create an admin configuration in Firestore
   - Set up admin email in environment variables

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ecompwa.git
   cd ecompwa
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Update environment variables:
   - Copy `.env.example` to `.env`
   - Update with your secure Firebase configuration
   - Set proper security parameters

4. Deploy Firestore rules:
   ```bash
   firebase deploy --only firestore:rules
   ```

5. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Security Best Practices

1. Environment Variables:
   - Never commit `.env` files
   - Use `.env.example` as a template
   - Rotate API keys regularly

2. Authentication:
   - Implement rate limiting for login attempts
   - Use secure password requirements
   - Implement phone verification properly

3. Data Access:
   - Use proper role-based access control
   - Validate all inputs server-side
   - Implement proper error handling

4. API Security:
   - Use HTTPS only
   - Implement proper CORS policies
   - Rate limit API endpoints

## Project Structure

```
src/
├── admin/           # Admin panel components
├── components/      # Shared components
├── contexts/        # React contexts
├── lib/            # Utilities and services
├── pages/          # Page components
└── types/          # TypeScript types
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Security Reporting

If you discover any security issues, please email security@example.com instead of using the issue tracker.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
