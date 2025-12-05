module.exports = {
  apps: [
    {
      name: 'nextjs-app',
      script: 'npm',
      args: 'start',
      cwd: process.cwd(),
      instances: 2,
      exec_mode: 'cluster',
      interpreter: 'none',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: './logs/nextjs-error.log',
      out_file: './logs/nextjs-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_memory_restart: '1G',
      max_restarts: 10,
      min_uptime: '10s'
    },
    {
      name: 'socket-server',
      script: 'node',
      args: 'server.js',
      cwd: process.cwd(),
      instances: 1,
      env: {
        NODE_ENV: 'production'
      },
      error_file: './logs/socket-error.log',
      out_file: './logs/socket-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      autorestart: true,
      max_memory_restart: '500M',
      max_restarts: 10,
      min_uptime: '10s'
    }
  ]
}
