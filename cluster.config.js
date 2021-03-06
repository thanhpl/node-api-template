module.exports = {
    apps: [
        {
            name: 'node-api-template',
            script: 'npm',
            args: 'start',
            exec_mode: "cluster", // Must be "" character to avoid systax error

            instances: 'max', // Specify a number or 'max' to indicate using maximum of CPUs
            autorestart: true,
            watch: false,
            max_memory_restart: '1G',
            env: {
                NODE_ENV: 'development'
            },
            env_staging: {
                NODE_ENV: 'staging'
            },
            env_production: {
                NODE_ENV: 'production'
            }
        }
    ]
};
