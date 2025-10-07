# 🚀 Kube Credential - Complete Deployment Guide

## 📋 **DEPLOYMENT OPTIONS**

### **Option 1: Local Development (Recommended for Testing)**
```bash
# Terminal 1 - Issuance Service
cd backend/issuance-service && npm run dev

# Terminal 2 - Verification Service  
cd backend/verification-service && npm run dev

# Terminal 3 - Frontend
cd frontend && npm run dev
```

**Access URLs:**
- Frontend: http://localhost:5173
- Issuance API: http://localhost:3000
- Verification API: http://localhost:3001

### **Option 2: Docker (If Network Issues Resolved)**
```bash
# Build images (when Docker network is working)
docker build -t kube-credential/issuance-service:latest ./backend/issuance-service
docker build -t kube-credential/verification-service:latest ./backend/verification-service
docker build -t kube-credential/frontend:latest ./frontend

# Run containers
docker run -d -p 3000:3000 --name issuance kube-credential/issuance-service:latest
docker run -d -p 3001:3001 --name verification kube-credential/verification-service:latest
docker run -d -p 80:80 --name frontend kube-credential/frontend:latest
```

### **Option 3: Kubernetes (Local)**
```bash
# Enable Kubernetes in Docker Desktop OR install minikube
minikube start

# Deploy to Kubernetes
kubectl apply -f k8s/

# Check status
kubectl get pods
kubectl get services
kubectl get ingress

# Get service URLs
kubectl get services -o wide
```

### **Option 4: Cloud Deployment (Production)**

#### **🌐 Render (Backend Services)**

**Issuance Service:**
1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect GitHub repository
4. Configure:
   - **Name**: `kube-credential-issuance`
   - **Environment**: Docker
   - **Dockerfile Path**: `backend/issuance-service/Dockerfile`
   - **Port**: `3000`
5. Environment Variables:
   ```
   NODE_ENV=production
   PORT=3000
   HOSTNAME=render-issuance
   ```
6. Click "Create Web Service"

**Verification Service:**
1. Click "New +" → "Web Service"
2. Configure:
   - **Name**: `kube-credential-verification`
   - **Environment**: Docker
   - **Dockerfile Path**: `backend/verification-service/Dockerfile`
   - **Port**: `3001`
3. Environment Variables:
   ```
   NODE_ENV=production
   PORT=3001
   HOSTNAME=render-verification
   VERIFICATION_SERVICE_URL=https://kube-credential-issuance.onrender.com
   ```
4. Click "Create Web Service"

#### **🌐 Vercel (Frontend)**

1. Go to https://vercel.com
2. Import project from GitHub
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Environment Variables:
   ```
   VITE_ISSUANCE_SERVICE_URL=https://kube-credential-issuance.onrender.com
   VITE_VERIFICATION_SERVICE_URL=https://kube-credential-verification.onrender.com
   ```
5. Deploy

## 🧪 **TESTING DEPLOYMENT**

### **Test Backend APIs:**
```bash
# Test issuance
curl -X POST https://kube-credential-issuance.onrender.com/issue \
  -H "Content-Type: application/json" \
  -d '{"id":"test-123","name":"Test User","email":"test@example.com"}'

# Test verification
curl -X POST https://kube-credential-verification.onrender.com/verify \
  -H "Content-Type: application/json" \
  -d '{"id":"test-123"}'

# Test health
curl https://kube-credential-issuance.onrender.com/health
curl https://kube-credential-verification.onrender.com/health
```

### **Test Frontend:**
1. Open your Vercel URL
2. Go to "Issue Credential" page
3. Enter test data and submit
4. Go to "Verify Credential" page
5. Enter the same ID and verify

## 📸 **REQUIRED SCREENSHOTS**

1. **Kubernetes Deployment:**
   ```bash
   kubectl get pods
   kubectl get services
   kubectl get ingress
   ```

2. **Docker Images:**
   ```bash
   docker images | grep kube-credential
   ```

3. **Browser Screenshots:**
   - Issue credential page with success response
   - Verify credential page with valid response
   - Worker identification in responses

4. **API Testing:**
   - curl commands showing successful issuance
   - curl commands showing successful verification

## 📦 **SUBMISSION PACKAGE**

### **Create Submission Zip:**
```bash
# Create zip excluding unnecessary files
zip -r kube-credential-submission.zip . \
  -x 'node_modules/*' '*.db' 'dist/*' '.git/*' 'screenshots/*' '*.log'

# Upload to Google Drive
# Email to hrfs@zupple.technology
```

### **Submission Checklist:**
- [ ] All source code included
- [ ] Docker images built successfully
- [ ] Kubernetes manifests created
- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to Render
- [ ] Screenshots taken
- [ ] Demo video recorded (30-60 seconds)
- [ ] README.md updated with contact info
- [ ] All tests passing
- [ ] Zip file uploaded to Google Drive
- [ ] Email sent to hrfs@zupple.technology

## 🎯 **FINAL URLS**

After deployment, you'll have:
- **Frontend**: `https://your-app.vercel.app`
- **Issuance API**: `https://kube-credential-issuance.onrender.com`
- **Verification API**: `https://kube-credential-verification.onrender.com`

## 🆘 **TROUBLESHOOTING**

### **Docker Network Issues:**
```bash
# Restart Docker Desktop
# Or use different DNS
echo "nameserver 8.8.8.8" | sudo tee /etc/resolv.conf
```

### **SQLite3 Issues:**
- Use the updated Dockerfiles with build dependencies
- Or deploy directly to cloud without local Docker

### **Frontend Build Issues:**
- Fixed TypeScript errors in `src/api.ts`
- Environment variables properly configured

## ✅ **SUCCESS CRITERIA**

Your deployment is successful when:
1. ✅ Frontend loads and shows both pages
2. ✅ Issue credential works and shows worker ID
3. ✅ Verify credential works and shows valid status
4. ✅ All services return proper worker identification
5. ✅ Screenshots and video demonstrate complete flow
6. ✅ All tests pass
7. ✅ README includes contact information
