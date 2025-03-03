#!/bin/bash

# Configuration
EC2_USER="ec2-user"
EC2_HOST="your-ec2-instance-ip"
REMOTE_PATH="/home/ec2-user/rathburn-online"

# Files to sync
FILES=(
  "next.config.mjs"
  "app/api/route.ts"
  "app/api/orders/route.ts"
  "app/api/debug/route.ts"
  "app/api/barcodes/scan/drum/route.ts"
  "app/api/inventory/activity/[id]/route.ts"
  "app/api/inventory/drums/[id]/route.ts"
  "app/api/dashboard/stock-changes/route.ts"
  "app/api/dashboard/current-stock/route.ts"
  "app/api/products/fetch/route.ts"
  "app/layout.tsx"
  "app/page.tsx"
  "app/not-found.tsx"
  "app/dashboard/page.tsx"
  "app/dashboard/_components/content.tsx"
  "app/(routes)/inventory/page.tsx"
  "app/(routes)/inventory/activity/page.tsx"
  "app/(routes)/inventory/orders/page.tsx"
  "app/(routes)/inventory/orders/new/page.tsx"
)

# Create rsync command
RSYNC_CMD="rsync -avz"

# Add each file to the rsync command
for file in "${FILES[@]}"; do
  # Handle files with parentheses by escaping them
  if [[ $file == *"("* ]]; then
    RSYNC_CMD+=" \"$file\""
  else
    RSYNC_CMD+=" $file"
  fi
done

# Add the destination
RSYNC_CMD+=" $EC2_USER@$EC2_HOST:$REMOTE_PATH/"

# Display the command
echo "Please run the following command to sync the files:"
echo ""
echo "$RSYNC_CMD"
echo ""
echo "Make sure to replace 'your-ec2-instance-ip' with your actual EC2 instance IP address."
echo "You may also need to adjust the remote path if it's different from '$REMOTE_PATH'." 