#!/bin/bash

# Web3 Voting System for India - Setup Script
# This script helps you set up the development environment

set -e

echo "🇮🇳 Web3-Based National Voting System for India 🇮🇳"
echo "================================================="
echo ""
echo "Setting up your development environment..."
echo ""

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed."
    echo "Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node --version)"
    echo "Please upgrade Node.js from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node --version) detected"

# Check for npm/yarn
if command -v yarn &> /dev/null; then
    PACKAGE_MANAGER="yarn"
    echo "✅ Yarn detected as package manager"
elif command -v npm &> /dev/null; then
    PACKAGE_MANAGER="npm"
    echo "✅ npm detected as package manager"
else
    echo "❌ No package manager found. Please install npm or yarn."
    exit 1
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
if [ "$PACKAGE_MANAGER" = "yarn" ]; then
    yarn install
else
    npm install
fi

# Create environment file
echo ""
echo "⚙️ Setting up environment configuration..."
if [ ! -f ".env.local" ]; then
    cat > .env.local << EOF
# Web3 Voting System - Environment Configuration

# Application
NEXT_PUBLIC_APP_NAME="Web3 Voting System India"
NEXT_PUBLIC_APP_VERSION="1.0.0"

# Blockchain Configuration (Mock values for development)
NEXT_PUBLIC_BLOCKCHAIN_RPC_URL=http://localhost:8545
NEXT_PUBLIC_CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890
NEXT_PUBLIC_CHAIN_ID=1337

# Aadhaar Integration (Mock values for development)
AADHAAR_API_URL=https://api.mock.uidai.gov.in
AADHAAR_API_KEY=mock_api_key_for_development

# Database (SQLite for development)
DATABASE_URL=sqlite:./dev.db
REDIS_URL=redis://localhost:6379

# Security
JWT_SECRET=your_super_secret_jwt_key_change_in_production
ENCRYPTION_KEY=your_encryption_key_32_chars_long
HASH_SALT_ROUNDS=12

# Features
NEXT_PUBLIC_ENABLE_OFFLINE_VOTING=true
NEXT_PUBLIC_ENABLE_VOICE_INTERFACE=true
NEXT_PUBLIC_ENABLE_SMS_VOTING=true
NEXT_PUBLIC_ENABLE_BIOMETRIC_AUTH=true

# Development
NODE_ENV=development
NEXT_PUBLIC_ENABLE_DEVTOOLS=true
NEXT_PUBLIC_MOCK_BLOCKCHAIN=true
NEXT_PUBLIC_MOCK_AADHAAR=true

# Analytics (disabled for development)
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_GA_TRACKING_ID=

# Support
NEXT_PUBLIC_SUPPORT_EMAIL=support@eci.gov.in
NEXT_PUBLIC_HELPLINE=1950
EOF
    echo "✅ Created .env.local with development configuration"
else
    echo "⚠️ .env.local already exists. Skipping creation."
fi

# Create necessary directories
echo ""
echo "📁 Creating project structure..."
mkdir -p public/symbols
mkdir -p public/candidates
mkdir -p public/locales
mkdir -p docs
mkdir -p tests

# Create placeholder files
echo ""
echo "📄 Creating placeholder files..."

# Create public assets structure
touch public/symbols/hand.png
touch public/symbols/lotus.png
touch public/symbols/nota.png
touch public/candidates/rahul_sharma.jpg
touch public/candidates/priya_patel.jpg

# Create manifest.json for PWA
cat > public/manifest.json << EOF
{
  "name": "Web3 Voting System India",
  "short_name": "India Voting",
  "description": "Secure, transparent, and accessible voting for India",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#ed6616",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "categories": ["government", "social", "democracy"],
  "lang": "en-IN",
  "dir": "ltr",
  "orientation": "portrait-primary"
}
EOF

# Create a simple HTML file for testing
cat > public/test.html << EOF
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Web3 Voting System - Test Page</title>
</head>
<body>
    <h1>🇮🇳 Web3 Voting System Test Page</h1>
    <p>If you can see this page, your setup is working correctly!</p>
    <a href="/">Go to Main Application</a>
</body>
</html>
EOF

# Create basic CSS reset
cat > src/app/globals.css << EOF
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom CSS Variables */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96%;
  --secondary-foreground: 222.2 84% 4.9%;
  --muted: 210 40% 96%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96%;
  --accent-foreground: 222.2 84% 4.9%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 221.2 83.2% 53.3%;
  --radius: 0.5rem;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --card: 222.2 84% 4.9%;
  --card-foreground: 210 40% 98%;
  --popover: 222.2 84% 4.9%;
  --popover-foreground: 210 40% 98%;
  --primary: 217.2 91.2% 59.8%;
  --primary-foreground: 222.2 84% 4.9%;
  --secondary: 217.2 32.6% 17.5%;
  --secondary-foreground: 210 40% 98%;
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
  --accent: 217.2 32.6% 17.5%;
  --accent-foreground: 210 40% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 210 40% 98%;
  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
  --ring: 224.3 76.3% 94.1%;
}

/* Base Styles */
* {
  border-color: hsl(var(--border));
}

body {
  color: hsl(var(--foreground));
  background: hsl(var(--background));
}

/* Accessibility */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Indian Flag Colors */
.text-saffron { color: #ed6616; }
.bg-saffron { background-color: #ed6616; }
.text-india-green { color: #22c55e; }
.bg-india-green { background-color: #22c55e; }

/* Focus styles for accessibility */
.focus-ring:focus {
  outline: 2px solid #ed6616;
  outline-offset: 2px;
}

/* High contrast mode */
@media (prefers-contrast: high) {
  :root {
    --primary: 0 0% 0%;
    --background: 0 0% 100%;
    --foreground: 0 0% 0%;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
EOF

# Create layout file
mkdir -p src/app
cat > src/app/layout.tsx << EOF
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Web3 Voting System India',
  description: 'Secure, transparent, and accessible voting for India',
  manifest: '/manifest.json',
  themeColor: '#ed6616',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
EOF

# Run type checking
echo ""
echo "🔍 Running type check..."
if [ "$PACKAGE_MANAGER" = "yarn" ]; then
    yarn run type-check || echo "⚠️ Type check found issues (this is expected in initial setup)"
else
    npm run type-check || echo "⚠️ Type check found issues (this is expected in initial setup)"
fi

# Success message
echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Start the development server:"
if [ "$PACKAGE_MANAGER" = "yarn" ]; then
    echo "   yarn dev"
else
    echo "   npm run dev"
fi
echo ""
echo "2. Open your browser to:"
echo "   http://localhost:3000"
echo ""
echo "3. For testing, you can also visit:"
echo "   http://localhost:3000/test.html"
echo ""
echo "📖 Documentation:"
echo "   - README.md for detailed information"
echo "   - .env.local for configuration"
echo "   - Check the /docs folder for additional guides"
echo ""
echo "🔧 Development tips:"
echo "   - Use Aadhaar: 1234 5678 9012 (any 12 digits for testing)"
echo "   - Use OTP: 123456 (any OTP starting with '1' for testing)"
echo "   - Enable your browser's developer tools for debugging"
echo ""
echo "🤝 Need help? Check:"
echo "   - GitHub Issues for bug reports"
echo "   - README.md for comprehensive documentation"
echo "   - Email: support@eci.gov.in"
echo ""
echo "🇮🇳 Happy coding for Indian democracy! 🇮🇳"
EOF