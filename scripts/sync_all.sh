#!/bin/bash

# Configuration
EC2_USER="ec2-user"
EC2_HOST="ec2-18-175-182-134.eu-west-2.compute.amazonaws.com"
REMOTE_PATH="/home/ec2-user/rathburn-online"
EC2_PKEY="-e \"ssh -i ~/.ssh/rb-server-pkey.pem\""

# Sync the next.config.mjs file
echo "Syncing next.config.mjs..."
rsync -avz $EC2_PKEY next.config.mjs $EC2_USER@$EC2_HOST:$REMOTE_PATH/

# Sync all TypeScript files in the app directory
echo "Syncing all TypeScript files in the app directory..."
rsync -avz $EC2_PKEY --include="*.ts" --include="*.tsx" --include="*/" --exclude="*" app/ $EC2_USER@$EC2_HOST:$REMOTE_PATH/app/

echo ""
echo "After syncing, run the following commands on your EC2 instance:"
echo ""
echo "cd $REMOTE_PATH"
echo "npm run build"
echo "npm run start" 