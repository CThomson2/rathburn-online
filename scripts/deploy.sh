#!/bin/bash
# deploy.sh - Git-based deployment workflow

# Variables
EC2_USER="ec2-user"
EC2_HOST="ec2-18-175-182-134.eu-west-2.compute.amazonaws.com"
EC2_KEY="rb-server-pkey.pem"
REMOTE_DIR="/home/ec2-user/rathburn-online"
BRANCH="main"

echo "Starting deployment to EC2..."

# Start SSH agent to avoid passphrase prompt
echo "Starting SSH agent..."
eval $(ssh-agent -s)
ssh-add ~/.ssh/$EC2_KEY

# Connect to EC2 and perform deployment steps
echo "Connecting to EC2 and pulling latest changes..."
ssh -i "$EC2_KEY" $EC2_USER@$EC2_HOST << 'EOF'
    echo "Connected to EC2, navigating to project directory..."
    cd /home/ec2-user/rathburn-online

    echo "Terminating PM2...";
    pm2 stop db-app;
    pm2 delete db-app;
    
    echo "Pulling latest changes from Git..."
    git pull origin main
    
    echo "Installing dependencies..."
    npm install --omit=dev --omit=optional
    
    echo "Building application..."
    npm run build
    
    echo "Copying .env file to standalone directory..."
    cp .env .next/standalone/
    
    echo "Starting application with PM2 using ecosystem config..."
    pm2 start ecosystem.config.js
    pm2 save
EOF

echo "Deployment complete!"