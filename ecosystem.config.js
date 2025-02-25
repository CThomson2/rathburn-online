module.exports = {
  apps: [
    {
      name: "rathburn-online",
      script: ".next/standalone/server.js",
      args: "-p 3000",
      cwd: "/home/ec2-user/rathburn-online",
      watch: false,
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: "3000",
        // Use file-based environment variables instead of hardcoding
      },
      // This ensures environment variables from .env are loaded
      env_file: ".next/standalone/.env",
    },
  ],
};
