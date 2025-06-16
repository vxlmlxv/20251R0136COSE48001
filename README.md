# Preffy Video Flow

A modern video feedback platform built with **Spring Boot** and **React**, designed to help users analyze and improve their video presentations through AI-powered feedback.

## 🏗️ Architecture

### Backend (Spring Boot)
- **Framework**: Spring Boot 3.5.0 with Java 22
- **Database**: H2 in-memory database (development) / PostgreSQL (production)
- **Authentication**: JWT-based authentication with Spring Security
- **API**: RESTful API with comprehensive endpoints
- **Build Tool**: Gradle

### Frontend (React)
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Components**: Shadcn/ui with Tailwind CSS
- **State Management**: React Context API
- **HTTP Client**: Axios

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Node.js 18+ 
- npm
- Firebase CLI (for deployment)

### Development Setup

1. **Install frontend dependencies**:
```bash
npm run install:all
```

2. **Start both servers**:
```bash
npm run dev
```

This will start:
- Backend server at `http://localhost:8080`
- Frontend server at `http://localhost:8081`

## 🌐 Live Demo

The application is deployed and accessible at:  
**🔗 [https://preffy-video-c76b5.web.app](https://preffy-video-c76b5.web.app)**

## 📦 Deployment

### Firebase Hosting

Deploy the frontend to Firebase hosting:

```bash
# Build and deploy
npm run deploy

# Deploy hosting only
npm run deploy:hosting

# Test locally before deployment
npm run firebase:serve
```

**Note**: The frontend is configured to connect to a backend API. Update the `VITE_API_URL` in `.env.production` to point to your deployed backend when ready.

### Manual Setup

**Backend only**:
```bash
cd backend
npm install
npm run start:dev
```

**Frontend only**:
```bash
cd frontend
npm install
npm run dev
```

## 📡 API Endpoints

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PATCH /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Projects
- `GET /api/projects` - Get projects (optional ?userId filter)
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects` - Create new project
- `PATCH /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Project Data
- `GET /api/projects/:id/videos` - Get project videos
- `GET /api/projects/:id/script-segments` - Get script segments
- `GET /api/projects/:id/behavior-events` - Get behavior events
- `GET /api/projects/:id/badge-scores` - Get badge scores
- `GET /api/projects/:id/suggestions` - Get improvement suggestions

## 🎯 Features

### Body Feedback
- **Gesture Analysis**: Tracks hand movements, pointing, fidgeting
- **Posture Monitoring**: Detects slouching, head tilts, positioning
- **Facial Expression**: Analyzes smiles, eye contact, expressions
- **Visual Timeline**: Interactive timeline showing behavior events
- **Badge System**: Star ratings for different presentation aspects

### Script Feedback
- **Content Analysis**: Structure and content suggestions
- **Speech Patterns**: Filler word detection and timing
- **Improvement Suggestions**: AI-generated recommendations
- **Text Timeline**: Synchronized script segments with timing

### Interactive Interface
- **Tabbed Navigation**: Organized feedback categories
- **Thumbnail Grid**: Video segment previews with icons
- **Responsive Design**: Works on desktop and mobile
- **Real-time Updates**: Live feedback as analysis completes

## 🔧 Development Scripts

### Root Level
- `npm run dev` - Start both frontend and backend
- `npm run build` - Build both applications
- `npm run install:all` - Install all dependencies

### Backend Specific
- `npm run start:dev` - Development server with hot reload
- `npm run build` - Build for production
- `npm run start:prod` - Production server

### Frontend Specific
- `npm run dev` - Development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🐳 Deployment

### Using Docker Compose
```bash
docker-compose up --build
```

This will:
- Build and start the backend on port 3002
- Build and start the frontend on port 80
- Set up networking between services

### Manual Deployment

**Backend**:
```bash
cd backend
npm install
npm run build
npm run start:prod
```

**Frontend**:
```bash
cd frontend
npm install
npm run build
# Serve the dist/ folder with your preferred web server
```

## 🛠️ Technology Stack

### Backend
- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe JavaScript
- **Class-validator** - Request validation
- **Class-transformer** - Data transformation

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS
- **shadcn/ui** - Modern UI components
- **React Router** - Client-side routing
- **React Query** - Server state management
- **Lucide React** - Icon library

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Concurrently** - Run multiple scripts

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/     # API controllers
│   ├── services/        # Business logic
│   ├── dto/            # Data transfer objects
│   ├── interfaces/     # TypeScript interfaces
│   ├── data/           # Mock data
│   └── main.ts         # Application entry point
├── Dockerfile
└── package.json

frontend/
├── src/
│   ├── components/     # React components
│   ├── pages/          # Page components
│   ├── services/       # API service layer
│   ├── lib/            # Utilities and types
│   ├── hooks/          # Custom React hooks
│   └── contexts/       # React contexts
├── public/             # Static assets
├── Dockerfile
├── nginx.conf
└── package.json
```

## 🔒 Environment Variables

### Backend
- `PORT` - Server port (default: 3002)
- `NODE_ENV` - Environment mode

### Frontend
- `VITE_API_URL` - Backend API URL (default: http://localhost:3002/api)

## 🧪 Testing

```bash
# Backend tests
cd backend
npm run test

# Frontend tests (if configured)
cd frontend
npm run test
```

## 📈 Future Enhancements

- [ ] Real video upload and processing
- [ ] AI/ML integration for actual behavior analysis
- [ ] User authentication and authorization
- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] Real-time collaboration features
- [ ] Export reports functionality
- [ ] Advanced analytics dashboard

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Note**: This is currently a demonstration platform with mock data. For production use, integrate with actual video processing and AI analysis services.
