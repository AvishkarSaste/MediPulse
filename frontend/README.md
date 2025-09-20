# MediPulse Frontend

A modern, responsive healthcare management system frontend built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Modern UI/UX**: Clean, professional design with healthcare-focused color scheme
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Role-Based Navigation**: Different views for Admin, Doctor, and Patient roles
- **Component Library**: Reusable UI components for consistent design
- **TypeScript**: Full type safety and better development experience

## 🛠️ Technology Stack

- **React 19** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Heroicons** for icons
- **Axios** for API calls

## 📦 Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy environment variables:
   ```bash
   cp env.example .env
   ```

3. Update `.env` with your configuration:
   - Backend API URL
   - Firebase credentials (optional)
   - OpenAI API key (optional)

## 🚀 Development

Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

## 🏗️ Build

Create a production build:
```bash
npm run build
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout/         # Layout components (Header, Sidebar)
│   └── UI/            # Basic UI components (Button, Card, Input, Modal)
├── pages/             # Page components
│   ├── Dashboard.tsx
│   ├── Login.tsx
│   ├── Patients.tsx
│   └── Emergencies.tsx
├── App.tsx            # Main app component
└── index.css          # Global styles and Tailwind imports
```

## 🎨 Design System

### Colors
- **Primary**: Blue tones for main actions and branding
- **Success**: Green for positive actions and status
- **Warning**: Orange for caution and pending states
- **Danger**: Red for errors and critical actions
- **Secondary**: Gray tones for neutral elements

### Components
- **Button**: Multiple variants (primary, secondary, success, danger, warning, outline)
- **Card**: Flexible container with different padding and shadow options
- **Input**: Form inputs with label, error, and helper text support
- **Modal**: Overlay dialogs for important actions

## 🔐 Authentication

The app currently uses mock authentication. To see the login page, change `isAuthenticated` to `false` in `App.tsx`.

Demo credentials:
- **Admin**: admin@medipulse.com / admin123
- **Doctor**: doctor@medipulse.com / doctor123
- **Patient**: patient@medipulse.com / patient123

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🚀 Deployment

The app can be deployed to any static hosting service:

1. Build the app: `npm run build`
2. Deploy the `build` folder to your hosting service
3. Update environment variables for production

## 🤝 Contributing

1. Follow the existing code style
2. Use TypeScript for all new components
3. Follow the component naming conventions
4. Test your changes thoroughly

## 📄 License

This project is part of the MediPulse Healthcare Management System.