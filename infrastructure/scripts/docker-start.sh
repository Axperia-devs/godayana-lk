#!/bin/bash

echo "========================================="
echo "GoDayana - Starting All Services in Docker"
echo "========================================="

# Clean and package all services
echo "📦 Building all services..."
./mvnw clean package -DskipTests

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build completed!"

# Stop and remove existing containers
echo "🛑 Stopping existing containers..."
docker-compose down -v

# Build and start all services
echo "🚀 Starting all services..."
docker-compose up -d --build

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 30

# Check service health
echo "🔍 Checking service health..."

# Test OTP Service
echo -n "OTP Service (8090): "
curl -s -o /dev/null -w "%{http_code}" http://localhost:8090/actuator/health

# Test User Service
echo -n " - User Service (8082): "
curl -s -o /dev/null -w "%{http_code}" http://localhost:8082/actuator/health

# Test Notification Service
echo -n " - Notification Service (8089): "
curl -s -o /dev/null -w "%{http_code}" http://localhost:8089/actuator/health

# Test Auth Service
echo -n " - Auth Service (8081): "
curl -s -o /dev/null -w "%{http_code}" http://localhost:8081/actuator/health

# Test API Gateway
echo -n " - API Gateway (8080): "
curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/actuator/health

echo ""
echo "========================================="
echo "✅ All services started successfully!"
echo "========================================="
echo ""
echo "Service URLs:"
echo "  API Gateway:    http://localhost:8080"
echo "  Auth Service:   http://localhost:8081"
echo "  User Service:   http://localhost:8082"
echo "  OTP Service:    http://localhost:8090"
echo "  Notification:   http://localhost:8089"
echo "  Mailhog UI:     http://localhost:8025"
echo ""
echo "View logs: docker-compose logs -f"
echo "Stop all: docker-compose down"
echo "Stop with volumes: docker-compose down -v"