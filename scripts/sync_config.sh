#!/bin/bash

# Configuration
EC2_USER="ec2-user"
EC2_HOST="3.8.53.147"  # Using the IP from your .env file
REMOTE_PATH="/home/ec2-user/rathburn-online"

# Files to sync
FILES=(
  "next.config.mjs"
)

# Create rsync command
RSYNC_CMD="rsync -avz"

# Add each file to the rsync command
for file in "${FILES[@]}"; do
  RSYNC_CMD+=" $file"
done

# Add the destination
RSYNC_CMD+=" $EC2_USER@$EC2_HOST:$REMOTE_PATH/"

# Display the command
echo "Running the following command to sync the config file:"
echo ""
echo "$RSYNC_CMD"
echo ""

# Execute the command
eval "$RSYNC_CMD"

echo ""
echo "After syncing, run the following commands on your EC2 instance:"
echo ""
echo "cd $REMOTE_PATH"
echo "npm run build"
echo "npm run start" 