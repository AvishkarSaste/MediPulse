# MediPulse - Healthcare Management System

A comprehensive full-stack healthcare application built with React, Node.js, MongoDB, and AI integration.

## 🏥 Features

### Core Features
- **Role-Based Access Control**: Admin, Doctor, and Patient dashboards
- **Digital Health ID System**: Unique patient identification
- **Patient Management**: Complete patient profiles with medical history
- **Emergency Response System**: Real-time emergency request handling
- **AI-Powered Medical Assistance**: Report summarization, term explanation, and FAQ
- **Search & Filter**: Advanced patient search by location and category
- **Medical Records**: Comprehensive record keeping and management

### AI Capabilities
- **Report Summarization**: AI-powered medical report analysis
- **Medical Term Explanation**: Patient-friendly explanations
- **FAQ Chat**: Interactive AI assistant for patient questions
- **Predictive Analytics**: Future health trend predictions (roadmap)

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- Firebase project
- OpenAI API key (optional, for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mediPulse
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   npm run seed  # Creates demo data
   npm run dev   # Starts server on port 5000
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   cp env.example .env
   # Edit .env with your Firebase config and API URL
   npm start     # Starts React app on port 3000
   ```

### Environment Variables

#### Backend (.env)
```
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
AI_PROVIDER=openai
AI_API_KEY=your_openai_api_key
```

#### Frontend (.env)
```
REACT_APP_BACKEND_API_URL=http://localhost:5000/api
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_firebase_app_id
```

## 🔐 Demo Credentials

- **Admin**: admin@medipulse.com / admin123
- **Doctor**: doctor@medipulse.com / doctor123
- **Patient**: patient@medipulse.com / patient123

## 📁 Project Structure

```
mediPulse/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Authentication & authorization
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── scripts/         # Database seeding
│   └── server.js        # Main server file
├── frontend/
│   ├── public/          # Static assets
│   └── src/
│       ├── api/         # API client configuration
│       ├── components/  # Reusable UI components
│       ├── context/     # React Context providers
│       ├── pages/       # Page components
│       ├── types/       # TypeScript type definitions
│       └── App.tsx      # Main app component
└── README.md
```

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **TailwindCSS** for styling
- **shadcn/ui** for UI components
- **Firebase Authentication**
- **React Router v6** for navigation
- **Axios** for API calls

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **OpenAI API** for AI features

## 📚 API Documentation

See `API_DOCUMENTATION.md` for detailed API endpoint documentation.

## 🤖 AI Features

### Report Summarization
- Upload medical reports (PDF, text, images)
- AI generates patient-friendly summaries
- Medical term explanations included

### FAQ Chat
- Interactive AI assistant
- Context-aware responses
- Medical guidance and support

### Future Roadmap
- Predictive health analytics
- Medication interaction warnings
- Health trend analysis

## 🔒 Security Features

- JWT-based authentication
- Role-based access control
- Password hashing with bcrypt
- CORS protection
- Input validation and sanitization

## 🚨 Emergency System

- Real-time emergency requests
- Location-based emergency routing
- Priority-based response system
- Status tracking and updates

## 📱 Responsive Design

- Mobile-first approach
- Cross-platform compatibility
- Accessible UI components
- Modern, clean interface

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 🚀 Deployment

### Backend Deployment
1. Deploy to Heroku, Railway, or similar
2. Set environment variables
3. Connect to MongoDB Atlas

### Frontend Deployment
1. Build the React app
2. Deploy to Netlify, Vercel, or similar
3. Update API URLs in environment variables

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📞 Support

For support and questions, please contact the development team.

---

**MediPulse** - Revolutionizing healthcare management with AI-powered solutions.
