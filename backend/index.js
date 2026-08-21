require('dotenv').config();
const app = require('./src/app');
const logger = require('./src/logger');

let parsedPort = parseInt(process.env.PORT, 10);
if (isNaN(parsedPort) || parsedPort < 0 || parsedPort > 65535) {
  logger.warn(`Invalid PORT ${process.env.PORT}, falling back to 3000`);
  parsedPort = 3000;
}
const PORT = parsedPort;

const server = app.listen(PORT, () => {
  const address = server.address();
  const actualPort = address && typeof address !== 'string' ? address.port : PORT;
  logger.info(`Server is running on port ${actualPort}`);
});
