# Preffy 🎥

A modern **video presentation analysis platform** built with **Spring Boot** and **React**, designed to help users analyze and improve their video presentations through AI-powered feedback. The platform features cloud-native architecture with automated deployment, persistent storage, and scalable infrastructure.

## Live Production System

### 🔗 **Deployed Services**
- **Frontend**: [https://preffy-video-c76b5.web.app](https://preffy-video-c76b5.web.app) *(Firebase Hosting)*
- **Backend API**: [https://preffy-backend-q7d754niaq-uc.a.run.app](https://preffy-backend-q7d754niaq-uc.a.run.app) *(Google Cloud Run)*
- **API Health**: [https://preffy-backend-q7d754niaq-uc.a.run.app/api/health](https://preffy-backend-q7d754niaq-uc.a.run.app/api/health)
- **API Documentation**: [Swagger/OpenAPI Spec](./swagger.yaml)

### 🚀 **Production Features**
- ✅ **User Registration & Authentication** (JWT-based)
- ✅ **Video Upload & Storage** (Google Cloud Storage)
- ✅ **Project Management** (Persistent Cloud SQL database)
- ✅ **Multi-user Support** (Isolated user data)
- ✅ **Auto-scaling Infrastructure** (Google Cloud Run)
- ✅ **Automated CI/CD Deployment** (GitHub Actions)

---

## �🏗️ **Architecture Overview**

### **Backend (Spring Boot + Google Cloud)**
- **Framework**: Spring Boot 3.x with Java 22
- **Database**: Google Cloud SQL (MySQL) for production
- **Storage**: Google Cloud Storage for video files
- **Authentication**: JWT with Spring Security
- **Deployment**: Google Cloud Run (containerized, auto-scaling)
- **Build**: Gradle with Docker containerization

### **Frontend (React + Firebase)**
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development
- **UI**: Shadcn/ui components with Tailwind CSS
- **State**: React Context API for authentication
- **Hosting**: Firebase Hosting with global CDN
- **API Integration**: Axios HTTP client

### **Cloud Infrastructure**
- **Compute**: Google Cloud Run (serverless containers)
- **Database**: Google Cloud SQL (managed MySQL)
- **Storage**: Google Cloud Storage (object storage)
- **CI/CD**: GitHub Actions with automated deployment
- **Monitoring**: Google Cloud Logging and Monitoring

---

## 📋 **Quick Start Guide**

### **Prerequisites**
- Java 22+
- Node.js 18+
- Google Cloud CLI (`gcloud`)
- Docker (for containerization)
- Git

### **1. Clone Repository**
```bash
git clone https://github.com/your-username/preffy-video-flow.git
cd preffy-video-flow
```

### **2. Backend Development**
```bash
cd backend
./gradlew bootRun
# Server starts at http://localhost:8080
```

### **3. Frontend Development**
```bash
cd frontend
npm install
npm run dev
# Development server at http://localhost:8081
```

### **4. Full Stack Development**
```bash
# From project root
npm run dev  # Starts both backend and frontend
```

---

## 🌐 **API Documentation**

### **Core Endpoints**

#### **Authentication**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

#### **Projects**
- `GET /api/projects` - List user projects
- `POST /api/projects` - Create new project
- `GET /api/projects/{id}` - Get project details
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project

#### **Videos**
- `POST /api/videos/upload` - Upload video file
- `GET /api/videos/project/{id}` - Get project videos
- `GET /api/videos/{id}` - Get video details

#### **Analysis & Feedback**
- `GET /api/projects/{id}/script-segments` - Speech analysis
- `GET /api/projects/{id}/posture-events` - Posture analysis
- `GET /api/projects/{id}/suggestions` - AI suggestions

### **Complete API Reference**
📖 **[View Full OpenAPI/Swagger Specification](./swagger.yaml)**

--

## 🎯 **Key Features**

### **User Management**
- ✅ Secure user registration and authentication
- ✅ JWT-based session management
- ✅ Profile management and user isolation
- ✅ Multi-user support with data separation

### **Video Processing**
- ✅ Direct video upload to cloud storage
- ✅ Multiple video format support
- ✅ Secure file access with signed URLs
- ✅ Metadata extraction and storage

### **Project Management**
- ✅ Create and manage video projects
- ✅ Project status tracking and updates
- ✅ Persistent data storage in cloud database
- ✅ User-specific project isolation

### **Analysis & Feedback**
- 🔄 Script segment analysis (framework ready)
- 🔄 Posture and behavior detection (framework ready)
- 🔄 AI-powered improvement suggestions (framework ready)
- 🔄 Interactive feedback interface (framework ready)

### **Infrastructure**
- ✅ Cloud-native architecture
- ✅ Auto-scaling and high availability
- ✅ Automated deployment pipeline
- ✅ Monitoring and logging
- ✅ Security best practices
- ✅ **Comprehensive test configuration** (H2 in-memory DB, no cloud dependencies)

---

## 🧪 **Testing & CI/CD**

### **Test Environment**
- **Local Testing**: H2 in-memory database, no cloud credentials required
- **CI/CD Testing**: Automated tests run on every push, isolated from production
- **Configuration**: Separate test profile with mock services and local storage
- **Coverage**: Context loading tests, authentication, and API endpoints

### **GitHub Actions Workflow**
```yaml
# Automated on every push to main/develop
1. Run Tests (./gradlew test -Dspring.profiles.active=test)
2. Build Application (./gradlew build -x test)
3. Deploy to Cloud Run (production environment)
```

### **Test Configuration Details**
See [TEST_CONFIGURATION_COMPLETE.md](./TEST_CONFIGURATION_COMPLETE.md) for detailed test setup and resolution of Google Cloud authentication issues.

---

## 🤝 **Contributing**

### **Development Workflow**
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test locally
4. Commit: `git commit -m 'Add amazing feature'`
5. Push: `git push origin feature/amazing-feature`
6. Open a Pull Request

### **Code Standards**
- Follow existing code style and patterns
- Add tests for new functionality
- Update documentation as needed
- Ensure CI/CD pipeline passes


---
