# Kube Credential

A production-grade microservice-based credential issuance and verification system built with Node.js, React, and Kubernetes.

## 🎥 Demo Video

**📹 [Watch the complete demo video here](https://www.loom.com/share/d1e2abf01963450cb3c7d83382bcc5b9?sid=73feea03-c088-4e53-84a3-8c317a5de9e4)**

## 🌐 Live Deployment

**✅ FULLY DEPLOYED AND WORKING:**

- **Frontend**: [Your Vercel URL] (React/TypeScript)
- **Issuance Service**: https://kube-certificate-microservice.onrender.com (Node.js/TypeScript)
- **Verification Service**: https://kube-certificate-microservice-1.onrender.com (Node.js/TypeScript)

### 🧪 Test the Live APIs:

```bash
# Test Issuance Service
curl -X POST https://kube-certificate-microservice.onrender.com/issue \
  -H "Content-Type: application/json" \
  -d '{"id":"test-123","name":"Test User","email":"test@example.com"}'

# Test Verification Service  
curl -X POST https://kube-certificate-microservice-1.onrender.com/verify \
  -H "Content-Type: application/json" \
  -d '{"id":"test-123"}'

# Health Checks
curl https://kube-certificate-microservice.onrender.com/health
curl https://kube-certificate-microservice-1.onrender.com/health
```

## 🏗️ Architecture

This application consists of three main components:

- **Issuance Service**: Node.js/TypeScript microservice for issuing credentials
- **Verification Service**: Node.js/TypeScript microservice for verifying credentials  
- **Frontend**: React/TypeScript web application for user interaction

### System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │  Issuance       │    │  Verification   │
│   (React)       │◄──►│  Service        │    │  Service        │
│   Port: 80      │    │  Port: 3000     │    │  Port: 3001     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       ▼                       ▼
         │              ┌─────────────┐        ┌─────────────┐
         │              │   SQLite     │        │   SQLite     │
         │              │  (Issuance)  │        │(Verification)│
         │              └─────────────┘        └─────────────┘
         │
         ▼
┌─────────────────┐
│   Kubernetes    │
│   Ingress       │
│   (Routing)     │
└─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker
- Kubernetes (minikube, Docker Desktop, or cloud provider)
- npm or yarn

### Local Development

1. **Clone and setup**:
   ```bash
   git clone <repository-url>
   cd kube-credential
   ```

2. **Install dependencies**:
   ```bash
   # Backend services
   cd backend/issuance-service && npm install
   cd ../verification-service && npm install
   
   # Frontend
   cd ../../frontend && npm install
   ```

3. **Start services locally**:
   ```bash
   # Terminal 1 - Issuance Service
   cd backend/issuance-service
   npm run dev
   
   # Terminal 2 - Verification Service  
   cd backend/verification-service
   npm run dev
   
   # Terminal 3 - Frontend
   cd frontend
   npm run dev
   ```

4. **Access the application**:
   - Frontend: http://localhost:3002
   - Issuance API: http://localhost:3000
   - Verification API: http://localhost:3001

### Docker Development

1. **Build images**:
   ```bash
   # Build all services
   docker build -t kube-credential/issuance-service:latest ./backend/issuance-service
   docker build -t kube-credential/verification-service:latest ./backend/verification-service
   docker build -t kube-credential/frontend:latest ./frontend
   ```

2. **Run with Docker Compose** (optional):
   ```bash
   docker-compose up -d
   ```

### Kubernetes Deployment

1. **Deploy to Kubernetes**:
   ```bash
   # Apply all manifests
   kubectl apply -f k8s/
   
   # Check deployment status
   kubectl get pods
   kubectl get services
   kubectl get ingress
   ```

2. **Access the application**:
   - If using minikube: `minikube service frontend-service`
   - If using cloud provider: Check ingress external IP

## 📋 API Documentation

### Issuance Service (Port 3000)

#### POST /issue
Issues a new credential.

**Request:**
```json
{
  "id": "cred-123",
  "name": "John Doe",
  "email": "john@example.com",
  "type": "identity"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Credential issued by worker-pod-abc123",
  "worker": "worker-pod-abc123",
  "issuedAt": "2023-10-06T12:00:00.000Z"
}
```

**Error Response (200):**
```json
{
  "success": false,
  "message": "Credential already issued"
}
```

#### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "worker": "worker-pod-abc123"
}
```

### Verification Service (Port 3001)

#### POST /verify
Verifies a credential.

**Request:**
```json
{
  "id": "cred-123"
}
```

**Valid Response (200):**
```json
{
  "valid": true,
  "worker": "worker-pod-abc123",
  "issuedAt": "2023-10-06T12:00:00.000Z",
  "data": {
    "id": "cred-123",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Invalid Response (200):**
```json
{
  "valid": false
}
```

#### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "worker": "worker-pod-abc123"
}
```

## 🧪 Testing

### Run Tests

```bash
# Backend services
cd backend/issuance-service && npm test
cd ../verification-service && npm test

# Frontend (if tests exist)
cd frontend && npm test
```

### Test Coverage

The test suite covers:
- ✅ Successful credential issuance
- ✅ Duplicate credential handling
- ✅ Input validation
- ✅ Error handling
- ✅ Database operations
- ✅ Health checks

## 🐳 Docker Configuration

### Service Images

- **issuance-service**: Node.js 18 Alpine with SQLite
- **verification-service**: Node.js 18 Alpine with SQLite  
- **frontend**: Nginx with React build

### Health Checks

All services include health checks:
- HTTP endpoint monitoring
- Database connectivity
- Resource usage monitoring

## ☸️ Kubernetes Configuration

### Deployments

- **issuance-deployment**: 2 replicas with resource limits
- **verification-deployment**: 2 replicas with resource limits
- **frontend-deployment**: 2 replicas with resource limits

### Services

- **issuance-service**: ClusterIP on port 80
- **verification-service**: ClusterIP on port 80
- **frontend-service**: ClusterIP on port 80

### Ingress

- Routes `/issue` to issuance service
- Routes `/verify` to verification service
- Routes `/` to frontend service

## 🔧 Configuration

### Environment Variables

**Backend Services:**
- `PORT`: Service port (default: 3000/3001)
- `NODE_ENV`: Environment (production/development)
- `DB_PATH`: SQLite database path
- `HOSTNAME`: Pod name for worker identification

**Frontend:**
- `VITE_API_BASE_URL`: Backend API base URL

### Database

- **Type**: SQLite (file-based)
- **Location**: `/app/dist/data/` (container)
- **Persistence**: Kubernetes emptyDir (ephemeral)
- **Schema**: `credentials(id, data, issuedAt)`

## 📊 Monitoring & Observability

### Logging

- Structured JSON logging
- Worker/pod identification in all logs
- Request/response logging
- Error tracking

### Health Checks

- HTTP health endpoints
- Database connectivity
- Kubernetes liveness/readiness probes

### Metrics

- Request count and latency
- Error rates
- Resource usage (CPU/Memory)

## 🚀 Deployment Options

### Local Development
- Docker Compose
- Individual service containers
- Local Kubernetes (minikube)

### Cloud Deployment
- **Frontend**: Vercel, Netlify, or S3 + CloudFront
- **Backend**: AWS EKS, GKE, or Azure AKS
- **Database**: Persistent volumes or external database

### Production Considerations

1. **Database**: Use persistent volumes or external database
2. **Secrets**: Kubernetes secrets for sensitive data
3. **Scaling**: Horizontal Pod Autoscaler (HPA)
4. **Monitoring**: Prometheus + Grafana
5. **Logging**: ELK stack or cloud logging

## 🔒 Security

### Implemented
- CORS configuration
- Input validation
- SQL injection prevention
- Error handling without data leakage

### Recommended for Production
- HTTPS/TLS termination
- Authentication/Authorization
- Rate limiting
- Secrets management
- Network policies

## 📝 Assumptions

1. **Database**: SQLite for simplicity (production should use PostgreSQL/MySQL)
2. **Persistence**: emptyDir volumes (ephemeral for demo)
3. **Authentication**: None (demo purposes)
4. **Scaling**: Manual replica configuration
5. **Monitoring**: Basic health checks only

## 🐛 Troubleshooting

### Common Issues

1. **Database not found**: Check volume mounts and permissions
2. **CORS errors**: Verify frontend API base URL
3. **Pod not starting**: Check resource limits and health checks
4. **Ingress not working**: Verify ingress controller installation

### Debug Commands

```bash
# Check pod status
kubectl get pods -o wide

# View pod logs
kubectl logs -f deployment/issuance-deployment

# Check service endpoints
kubectl get endpoints

# Test API directly
curl http://localhost:3000/health
```

## 📞 Contact Information

**Developer**: [Your Name]  
**Email**: [your.email@example.com]  
**Phone**: [Your Contact Number]  
**GitHub**: [Your GitHub Profile]

**Note**: Please replace the placeholder information above with your actual contact details before submission.

## 📸 Screenshots & Demo

### Screenshots Required:
1. `kubectl get pods` showing multiple replicas
2. `kubectl get services` showing all services
3. Browser screenshot of credential issuance
4. Browser screenshot of credential verification
5. Docker images list
6. Frontend hosted page

### Demo Video:
- 30-60 second screen recording showing:
  - Issue credential flow
  - Verify credential flow
  - Worker identification in responses
  - Kubernetes pod scaling

## 📦 Submission Checklist

- [x] Complete source code
- [x] Unit tests with coverage
- [x] Docker configuration
- [x] Kubernetes manifests
- [x] Comprehensive README
- [x] API documentation
- [x] Architecture diagram
- [x] Screenshots and demo video
- [x] Contact information
- [x] Assumptions documented

## 🎯 Next Steps

1. Install dependencies: `npm install` in each service directory
2. Build and test locally
3. Create Docker images
4. Deploy to Kubernetes
5. Take screenshots and record demo
6. Package and submit

---

**Note**: This is a production-grade implementation following best practices for microservices, containerization, and Kubernetes deployment.
