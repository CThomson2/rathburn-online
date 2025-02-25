module.exports = {
  apps: [
    {
      name: "dashboard-app",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: "3000",
        DATABASE_URL: process.env.DATABASE_URL,
      },
    },
  ],
};
