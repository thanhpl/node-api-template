const express = require('express');
const app = express();
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const favicon = require('serve-favicon');
const serverConfig = require('./config/server.json');
const packageJson = require('../package.json');
const logger = require('./common/logger')('App');

// Load process.env configs as soon as possible
const dotenv = require('dotenv');
const fileUtil = require('./util/fileUtil');
var envPath = path.resolve(process.cwd(), 'env', '.env');
if (!fileUtil.existsSync(envPath)) {
    console.error(`Not found config file .env in env directory, process exits`);
    process.exit(0);
}
dotenv.config({ path: envPath });

const rateLimitWrapper = require('./middlewares/rateLimitWrapper');
const authAPI = require('./middlewares/authAPI');
const setHeader = require('./middlewares/setHeader');
const cors = require('./middlewares/cors');

const healthRoute = require('./routes/health');
const authRoute = require('./routes/auth');
const usersRoute = require('./routes/users');

console.log(`====== ${packageJson.name} ======`);
logger.info(`====== ${packageJson.name} ======`);
const environment = process.env.NODE_ENV || 'development';
const versionMsg = `Version: ${packageJson.version} (${environment})`;
console.log(versionMsg);
logger.info(versionMsg);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(helmet());
app.use(compression());
app.use(setHeader());
app.use(cors());

/**
 * Register routes of API
 */
app.use('/api/health', rateLimitWrapper(), healthRoute);
app.use('/api/auth', rateLimitWrapper(), authRoute);
app.use('/api/users', authAPI(), usersRoute);

const port = serverConfig.port;
app.listen(port, () => {
    let listenMsg = `Server is listening on port ${port}`;
    console.log(listenMsg);
    logger.info(listenMsg);
});
