# 🛍️ E-Commerce Mobile Application

A full-stack e-commerce mobile application built with React Native (Expo) and Node.js, featuring real-time inventory management, secure authentication, and cross-platform compatibility.

![React Native](https://img.shields.io/badge/React_Native-0.81.5-blue.svg)
![Expo](https://img.shields.io/badge/Expo-~54.0.33-black.svg)
![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)
![Supabase](https://img.shields.io/badge/Supabase-2.45.4-orange.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [📱 Screenshots](#-screenshots)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Quick Start](#-quick-start)
- [📋 Prerequisites](#-prerequisites)
- [⚙️ Installation](#️-installation)
- [🏃‍♂️ Running the Application](#️-running-the-application)
- [🧪 Testing](#-testing)
- [🚀 Deployment](#-deployment)
- [📚 Documentation](#-documentation)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [🙋‍♂️ Support](#️-support)

---

## ✨ Features

### 🛒 Core E-Commerce Features

- ✅ **Product Catalog** - Browse products by category with search functionality
- ✅ **Shopping Cart** - Add/remove items with persistent offline storage
- ✅ **User Authentication** - Secure login/signup with JWT tokens
- ✅ **Order Management** - Complete checkout process and order tracking
- ✅ **Admin Dashboard** - Product and order management interface
- ✅ **Real-time Updates** - Live inventory and order status synchronization

### 📱 Mobile Experience

- ✅ **Cross-Platform** - iOS and Android compatibility
- ✅ **Offline Support** - Basic functionality without internet connection
- ✅ **Push Notifications** - Order updates and promotional alerts
- ✅ **Responsive Design** - Optimized for various screen sizes
- ✅ **Dark Mode Ready** - Theme support for better UX

### 🔒 Security & Performance

- ✅ **Row-Level Security** - Database-level access control
- ✅ **JWT Authentication** - Secure token-based auth system
- ✅ **Input Validation** - Server-side validation for all inputs
- ✅ **Rate Limiting** - Protection against abuse
- ✅ **Performance Optimized** - Fast loading and smooth interactions

---

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Native  │    │   Node.js API   │    │   Supabase      │
│   Mobile App    │◄──►│   (Express)     │◄──►│   PostgreSQL    │
│   (Expo)        │    │                 │    │   Database      │
│                 │    │ • REST API      │    │ • Real-time     │
│ • Zustand       │    │ • JWT Auth      │    │ • Auth Service  │
│ • Navigation    │    │ • Validation    │    │ • Storage       │
│ • Components    │    │ • CORS          │    │ • RLS Policies  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Data Flow

1. **Mobile App** → Makes API calls to backend
2. **Backend API** → Validates requests and communicates with Supabase
3. **Supabase** → Handles database operations and real-time subscriptions
4. **Real-time Updates** → Push changes back to mobile app via WebSocket

---

## 📱 Screenshots

| Login Screen                                                           | Product Catalog                                                              | Shopping Cart                                                        | Admin Dashboard                                                        |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| ![Login](https://via.placeholder.com/200x300/4A90E2/FFFFFF?text=Login) | ![Products](https://via.placeholder.com/200x300/50E3C2/FFFFFF?text=Products) | ![Cart](https://via.placeholder.com/200x300/F5A623/FFFFFF?text=Cart) | ![Admin](https://via.placeholder.com/200x300/D0021B/FFFFFF?text=Admin) |

---

## 🛠️ Tech Stack

### Frontend (Mobile App)

- **Framework:** React Native 0.81.5
- **Platform:** Expo SDK 54+
- **Language:** TypeScript
- **State Management:** Zustand
- **Navigation:** Expo Router (File-based routing)
- **Styling:** NativeWind (Tailwind CSS)
- **HTTP Client:** Axios
- **Storage:** AsyncStorage
- **Icons:** Lucide React Native

### Backend (API Server)

- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Language:** JavaScript
- **Authentication:** JWT (jsonwebtoken)
- **Validation:** Express Validator
- **Security:** bcryptjs, CORS
- **Database Client:** Supabase JS

### Database & Services

- **Primary Database:** Supabase PostgreSQL
- **Authentication:** Supabase Auth
- **File Storage:** Supabase Storage
- **Real-time:** Supabase Realtime
- **Hosting:** Railway/Render/Vercel (API), Supabase (Database)

### Development Tools

- **Code Quality:** ESLint, Prettier
- **Testing:** Jest, React Testing Library, Detox
- **Version Control:** Git
- **CI/CD:** GitHub Actions
- **Documentation:** Markdown, Mermaid diagrams

---

## 📁 Project Structure

```
ecommerce-mobile-app/
├── 📱 mobile/                    # React Native (Expo) App
│   ├── app/                      # App screens (file-based routing)
│   │   ├── (tabs)/              # Main app tabs
│   │   │   ├── index.tsx        # Home/Product catalog
│   │   │   ├── cart.tsx         # Shopping cart
│   │   │   └── profile.tsx      # User profile
│   │   ├── (auth)/              # Authentication screens
│   │   │   ├── login.tsx        # Login screen
│   │   │   └── signup.tsx       # Signup screen
│   │   └── admin/               # Admin screens
│   │       └── index.tsx        # Admin dashboard
│   ├── components/              # Reusable UI components
│   │   ├── ui/                  # Base UI components
│   │   └── ...                  # Feature components
│   ├── constants/               # App constants
│   ├── hooks/                   # Custom React hooks
│   ├── services/                # API services
│   ├── store/                   # Zustand stores
│   ├── assets/                  # Images, fonts, etc.
│   └── package.json
│
├── 🖥️ backend/                   # Node.js API Server
│   ├── src/
│   │   ├── index.js             # Main server file
│   │   ├── middleware/          # Express middleware
│   │   ├── routes/              # API route handlers
│   │   └── services/            # Business logic
│   ├── package.json
│   └── .env                     # Environment variables
│
├── 🗄️ supabase_setup.sql         # Database schema & policies
├── 📚 docs/                      # Additional documentation
└── 📋 SDLC_Documentation_Final/  # Complete SDLC documentation
    ├── README.md                 # Project overview
    ├── CONTRIBUTING.md          # Contribution guidelines
    ├── DEPLOYMENT_GUIDE.md      # Deployment procedures
    ├── TROUBLESHOOTING.md       # Issue resolution
    ├── CHANGELOG.md             # Version history
    ├── LICENSE.md               # MIT license
    └── diagrams/                # System architecture diagrams
```

---

## 🚀 Quick Start

> **⚡ Want to get started immediately?**

```bash
# 1. Clone the repository
git clone https://github.com/your-org/ecommerce-mobile-app.git
cd ecommerce-mobile-app

# 2. Set up environment variables
cp backend/.env.example backend/.env
cp mobile/.env.example mobile/.env
# Edit .env files with your Supabase credentials

# 3. Install dependencies
cd backend && npm install
cd ../mobile && npm install

# 4. Set up database
# Run supabase_setup.sql in your Supabase project

# 5. Start development servers
cd backend && npm run dev    # Terminal 1
cd mobile && npx expo start  # Terminal 2

# 6. Open the app
# Scan QR code with Expo Go or use emulator
```

**That's it!** 🎉 Your e-commerce app should now be running locally.

---

## 📋 Prerequisites

Before running this application, make sure you have:

### System Requirements

- **Node.js** 18.0 or higher
- **npm** or **yarn** package manager
- **Git** for version control

### Mobile Development

- **Expo CLI** (installed globally)
- **iOS Simulator** (macOS only) or **Android Emulator**
- **Expo Go** app on your phone (for testing)

### External Services

- **Supabase Account** - For database and authentication
  - Create a new project at [supabase.com](https://supabase.com)
  - Get your project URL and API keys

### Optional (Recommended)

- **VS Code** with React Native extensions
- **Android Studio** (for Android development)
- **Xcode** (for iOS development on macOS)

---

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/ecommerce-mobile-app.git
cd ecommerce-mobile-app
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your Supabase credentials
# SUPABASE_URL=your-supabase-project-url
# SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
# JWT_SECRET=your-jwt-secret-key
```

### 3. Mobile App Setup

```bash
cd ../mobile

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your Supabase credentials
# SUPABASE_URL=your-supabase-project-url
# SUPABASE_ANON_KEY=your-anon-key
```

### 4. Database Setup

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Wait for setup to complete

2. **Run Database Schema**
   - Open Supabase SQL Editor
   - Copy and paste contents of `supabase_setup.sql`
   - Execute the SQL script

3. **Configure Authentication**
   - Go to Authentication > Settings
   - Configure site URL and redirect URLs
   - Set up email templates (optional)

### 5. Environment Variables

#### Backend (.env)

```bash
# Server Configuration
NODE_ENV=development
PORT=3000

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:8081
```

#### Mobile (.env)

```bash
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key

# App Configuration
APP_ENV=development
API_BASE_URL=http://localhost:3000
```

---

## 🏃‍♂️ Running the Application

### Development Mode

#### Start Backend API

```bash
cd backend
npm run dev
```

- Server starts on `http://localhost:3000`
- Auto-reloads on file changes
- Console logs API requests

#### Start Mobile App

```bash
cd mobile
npx expo start
```

**Available Options:**

- **iOS Simulator:** Press `i` (macOS only)
- **Android Emulator:** Press `a`
- **Web Browser:** Press `w`
- **Expo Go:** Scan QR code with phone
- **Development Build:** Press `shift + r` for refresh

### Production Mode

#### Backend

```bash
cd backend
npm start
```

#### Mobile App

```bash
cd mobile

# Build for production
npx expo build:android  # or :ios

# Or run in production mode
npx expo start --no-dev
```

### Testing Endpoints

Once both servers are running, test the API:

```bash
# Health check
curl http://localhost:3000/health

# Get products
curl http://localhost:3000/api/products

# Test with authentication
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:3000/api/profile
```

---

## 🧪 Testing

### Backend Testing

```bash
cd backend

# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- tests/auth.test.js
```

### Mobile App Testing

```bash
cd mobile

# Unit tests
npm test

# Integration tests
npm run test:integration

# E2E tests (requires Detox setup)
npm run test:e2e
```

### Manual Testing Checklist

- [ ] User registration and login
- [ ] Product browsing and search
- [ ] Add to cart functionality
- [ ] Checkout process
- [ ] Order history
- [ ] Admin panel access
- [ ] Offline mode functionality

---

## 🚀 Deployment

### Backend Deployment

#### Option 1: Railway (Recommended)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and create project
railway login
railway create ecommerce-api

# Set environment variables
railway variables set NODE_ENV=production
railway variables set SUPABASE_URL=your-prod-url
# ... set other variables

# Deploy
railway up
```

#### Option 2: Render

1. Connect GitHub repository
2. Choose "Web Service"
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables

#### Option 3: Manual Server

```bash
# On your server
git clone your-repo-url
cd ecommerce-mobile-app/backend
npm ci --production
npm start
```

### Mobile App Deployment

#### iOS App Store

```bash
# Install EAS CLI
npm install -g @expo/cli

# Configure EAS
npx eas build:configure

# Build for iOS
npx eas build --platform ios --profile production

# Submit to App Store
npx eas submit --platform ios
```

#### Google Play Store

```bash
# Build for Android
npx eas build --platform android --profile production

# Upload to Play Console
# Follow Google Play publishing steps
```

### Environment Setup

#### Production Environment Variables

```bash
# Backend
NODE_ENV=production
SUPABASE_URL=https://your-prod-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=prod-service-key
JWT_SECRET=prod-jwt-secret

# Mobile App
SUPABASE_URL=https://your-prod-project.supabase.co
SUPABASE_ANON_KEY=prod-anon-key
API_BASE_URL=https://your-api-domain.com
```

---

## 📚 Documentation

### 📋 SDLC Documentation

Complete Software Development Life Cycle documentation is available in [`SDLC_Documentation_Final/`](SDLC_Documentation_Final/):

- **[📋 Analysis & Requirements](SDLC_Documentation_Final/docs/01_Analysis_Requirements.md)** - Business requirements and user personas
- **[🏗️ System Design](SDLC_Documentation_Final/docs/02_System_Design.md)** - Architecture and database design
- **[💻 Implementation](SDLC_Documentation_Final/docs/03_Implementation_Overview.md)** - Development setup and guidelines
- **[🧪 Testing](SDLC_Documentation_Final/docs/04_Testing_Documentation.md)** - Testing strategies and procedures
- **[📊 Presentations](SDLC_Documentation_Final/docs/05_Presentation_Materials.md)** - Demo scripts and presentations

### 🛠️ Operational Guides

- **[🚀 Deployment Guide](SDLC_Documentation_Final/DEPLOYMENT_GUIDE.md)** - Production deployment procedures
- **[🔧 Troubleshooting](SDLC_Documentation_Final/TROUBLESHOOTING.md)** - Issue resolution and diagnostics
- **[🤝 Contributing](SDLC_Documentation_Final/CONTRIBUTING.md)** - Development and contribution guidelines

### 📖 API Documentation

- **REST API Endpoints:** See backend route files
- **Database Schema:** Refer to `supabase_setup.sql`
- **Authentication Flow:** JWT-based with Supabase integration

### 🏗️ Architecture Diagrams

Visual diagrams are available in [`SDLC_Documentation_Final/diagrams/`](SDLC_Documentation_Final/diagrams/):

- System Architecture
- Database ERD
- UML Diagrams (Use Case, Activity, Sequence)

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](SDLC_Documentation_Final/CONTRIBUTING.md) for details.

### Quick Contribution Steps

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write tests for new features
- Update documentation as needed
- Ensure all tests pass
- Follow conventional commit messages

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](SDLC_Documentation_Final/LICENSE.md) file for details.

### Third-Party Licenses

This project uses the following open-source libraries:

- React Native (MIT)
- Expo (MIT)
- Supabase (MIT)
- Express.js (MIT)
- Zustand (MIT)

---

## 🙋‍♂️ Support

### Getting Help

- 📧 **Email:** support@company.com
- 💬 **Slack:** #ecommerce-app channel
- 🐛 **Issues:** [GitHub Issues](https://github.com/your-org/ecommerce-mobile-app/issues)
- 📖 **Documentation:** [SDLC Docs](SDLC_Documentation_Final/)

### Community

- 🌟 **GitHub:** Star this repository
- 🔄 **Fork:** Contribute improvements
- 📢 **Share:** Tell others about the project

### Professional Support

For enterprise support, custom development, or consulting:

- 📧 Contact: enterprise@company.com
- 📞 Phone: +1 (555) 123-4567
- 🌐 Website: https://company.com/support

---

## 🙏 Acknowledgments

- **React Native Community** - For the amazing framework
- **Expo Team** - For simplifying React Native development
- **Supabase Team** - For the excellent backend-as-a-service
- **Open Source Contributors** - For the libraries we depend on

---

## 📈 Roadmap

### Upcoming Features

- [ ] **Wishlist functionality**
- [ ] **Product reviews and ratings**
- [ ] **Push notifications**
- [ ] **Multi-language support**
- [ ] **Advanced search filters**
- [ ] **Order tracking with maps**
- [ ] **Social login integration**
- [ ] **Payment gateway integration**

### Version History

See [CHANGELOG](SDLC_Documentation_Final/CHANGELOG.md) for detailed version history.

---

_Built with ❤️ using React Native, Expo, and Supabase_

---

**Happy coding!** 🚀✨</content>
<parameter name="filePath">c:\Users\LENOVO\Desktop\app\README.md
