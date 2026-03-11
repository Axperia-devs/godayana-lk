# Godayana.lk - Sri Lanka's Premier Job Portal

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Railway](https://img.shields.io/badge/deployed%20on-Railway-blueviolet)](https://railway.app)

## 🚀 Overview

Godayana.lk connects Sri Lankan job seekers with employers. Built with microservices architecture for scalability and reliability.

## 📋 Services

| Service | Port | Description |
|---------|------|-------------|
| Frontend | 3000 | Next.js web application |
| API Gateway | 8080 | Spring Cloud Gateway |
| Auth Service | 8081 | Authentication & OTP |
| User Service | 8082 | User profile management |
| Company Service | 8083 | Company management |
| Job Service | 8084 | Job postings & applications |
| Payment Service | 8085 | Payment processing |
| Content Service | 8086 | Courses, visa, stories |
| Notification Service | 8087 | Emails, SMS, WhatsApp |
| Search Service | 8088 | Elasticsearch integration |

## 🏗️ Architecture

- **Frontend**: Next.js 14 (App Router)
- **Backend**: Spring Boot 3.1+ Microservices
- **Database**: PostgreSQL per service
- **Cache**: Redis
- **Message Queue**: RabbitMQ
- **Search**: Elasticsearch
- **Storage**: MinIO (S3-compatible)
- **Deployment**: Railway

## 🛠️ Tech Stack

See [Technology Stack](./docs/architecture/tech-stack.md) for details.

## 🚦 Getting Started

### Prerequisites
- Node.js 18+
- Java 17+
- Docker & Docker Compose
- Railway CLI

### Local Development
```bash
# Clone repository
git clone https://github.com/yourorg/godayana-lk.git
cd godayana-lk

# Start infrastructure
docker-compose -f infrastructure/docker/docker-compose.local.yml up -d

# Build shared libraries
cd shared/common-dtos && mvn clean install
cd ../common-utils && mvn clean install

# Start services (each in new terminal)
cd services/auth-service && ./mvnw spring-boot:run
cd services/user-service && ./mvnw spring-boot:run
cd frontend && npm run dev
```

## 📚 Documentation

- System Architecture
- API Documentation
- Database Schema
- Deployment Guide

## 🚢 Deployment
Each service is independently deployable to Railway:

```bash
# Deploy specific service
cd services/auth-service
railway up --service auth-service
```

## 📊 Monitoring

- Metrics: Prometheus + Grafana
- Logs: ELK Stack
- Tracing: Jaeger
- Health: Spring Boot Actuator

## 🤝 Contributing

See CONTRIBUTING.md for guidelines.

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

- Project Lead
- Backend Team
- Frontend Team
- DevOps Team

## 📞 Contact

Website: [axperia.vercel.app](https://axperia.vercel.app/)

Email: ask.axperia@gmail.com
