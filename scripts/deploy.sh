#!/bin/bash
# deploy.sh - Git-based deployment workflow

# Variables
EC2_USER="ec2-user"
EC2_HOST="ec2-18-175-182-134.eu-west-2.compute.amazonaws.com"
EC2_KEY="rb-server-pkey.pem"
REMOTE_DIR="/home/ec2-user/rathburn-online"
BRANCH="main"

echo "Starting deployment to EC2..."

# Connect to EC2 and perform deployment steps
echo "Connecting to EC2 and pulling latest changes..."
ssh -i "$EC2_KEY" $EC2_USER@$EC2_HOST << 'EOF'
    # Start SSH agent to avoid passphrase prompt
    echo "Starting SSH agent..."
    eval $(ssh-agent -s)
    ssh-add ~/.ssh/rb-server-pkey.pem

    echo "Connected to EC2, navigating to project directory..."
    cd /home/ec2-user/rathburn-online

    git config alias.st status
    git config alias.cm commit
    git config alias.co checkout
    git config alias.br branch
    git config alias.pl pull
    git config alias.ps push
    git config alias.lg log

    echo "Terminating PM2..."
    pm2 stop rathburn-online
    pm2 delete rathburn-online

    echo "Pulling latest changes from Git..."
    git pull origin main

    echo "Installing dependencies..."
    npm install --omit=dev --omit=optional

    echo "Running Prisma db pull and generate..."
    cd database;
    npx prisma db pull;
    npx prisma generate;
    cd ..;

    echo "Building application..."
    npm run build

    echo "Copying .env file to standalone directory...";
    cp .env .next/standalone/;

    echo "Ensuring static assets are properly set up...";
    # Create the static directory in the standalone output;
    mkdir -p .next/standalone/.next/static;
    # Copy all static assets to the correct location;
    cp -r .next/static/* .next/standalone/.next/static/;
    
    # Copy public folder if it exists;
    if [ -d "public" ] then
        echo "Copying public folder to standalone directory..."
        cp -r public .next/standalone/
    fi

    echo "Starting application with PM2 using ecosystem config...";
    pm2 start ecosystem.config.js;
    pm2 save;
EOF

echo "Deployment complete!"