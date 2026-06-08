#!/bin/bash

echo "⚠️  This will delete all containers, volumes, and data!"
read -p "Are you sure? (y/N): " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🛑 Stopping and removing all containers..."
    docker-compose down -v
    
    echo "🗑️  Removing all GoDayana images..."
    docker rmi $(docker images -q 'godayana-*') 2>/dev/null || true
    
    echo "🧹 Cleaning up..."
    docker system prune -f
    
    echo "✅ Reset complete! Run ./docker-start.sh to start fresh"
else
    echo "❌ Cancelled"
fi