#!/usr/bin/env pwsh

cd D:\Work\Godayana.lk\godayana-lk\backend

Write-Host "Building JAR with Maven..." -ForegroundColor Green
mvn clean package -DskipTests -pl services/auth-service -am

if ($LASTEXITCODE -ne 0) {
    Write-Host "Maven build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "Building Docker image..." -ForegroundColor Green
docker build -t auth-service:local -f services/auth-service/Dockerfile services/auth-service

Write-Host "Starting services..." -ForegroundColor Green
docker compose -p backend up -d auth-service

Write-Host "Done! Check logs with: docker compose logs -f auth-service" -ForegroundColor Green