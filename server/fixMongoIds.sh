#!/bin/bash

# Script to remove parseInt() calls for MongoDB ObjectId compatibility

echo "Fixing MongoDB ObjectId compatibility in controllers..."
echo ""

# Fix authController.js
echo "Fixing authController.js..."
sed -i 's/parseInt(userId)/userId/g' controllers/authController.js
sed -i 's/parseInt(id)/id/g' controllers/authController.js

# Fix taskController.js
echo "Fixing taskController.js..."
sed -i 's/parseInt(userId)/userId/g' controllers/taskController.js
sed -i 's/parseInt(requestUserId)/requestUserId/g' controllers/taskController.js
sed -i 's/parseInt(projectId)/projectId/g' controllers/taskController.js
sed -i 's/parseInt(managerId)/managerId/g' controllers/taskController.js
sed -i 's/parseInt(parentTaskId)/parentTaskId/g' controllers/taskController.js
sed -i 's/parseInt(newUserId)/newUserId/g' controllers/taskController.js
sed -i 's/parseInt(targetUserId)/targetUserId/g' controllers/taskController.js

# Fix userController.js
echo "Fixing userController.js..."
sed -i 's/parseInt(id)/id/g' controllers/userController.js
sed -i 's/parseInt(userId)/userId/g' controllers/userController.js
sed -i 's/parseInt(requestUserId)/requestUserId/g' controllers/userController.js
sed -i 's/parseInt(managerId)/managerId/g' controllers/userController.js
sed -i 's/parseInt(projectId)/projectId/g' controllers/userController.js

# Fix messageController.js
echo "Fixing messageController.js..."
sed -i 's/parseInt(req\.user\.userId)/req.user.userId/g' controllers/messageController.js
sed -i 's/parseInt(otherUserId)/otherUserId/g' controllers/messageController.js
sed -i 's/parseInt(receiverId)/receiverId/g' controllers/messageController.js
sed -i 's/parseInt(senderId)/senderId/g' controllers/messageController.js

# Fix projectController.js
echo "Fixing projectController.js..."
sed -i 's/parseInt(userId)/userId/g' controllers/projectController.js
sed -i 's/parseInt(projectId)/projectId/g' controllers/projectController.js
sed -i 's/parseInt(removedById)/removedById/g' controllers/projectController.js

echo ""
echo "✅ All controllers fixed for MongoDB ObjectId compatibility!"
echo ""
echo "Please restart your server for changes to take effect."
