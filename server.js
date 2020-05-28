const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app');

/**
 * @description: uncaught exception
 */
process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception! 💥 Shutting down...');
  console.log(`${err.name}: ${err.message}`);
  process.exit(1);
});

dotenv.config({ path: './config.env' });

/**
 * @description: 2 option: connect cloud db || connect local db
 */

const DB_CLOUD = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

const startTime = new Date();

mongoose
  .connect(DB_CLOUD, {
  // .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(
      'connect database successfully',
      `----- Time Finish ${new Date() - startTime}ms`
    );
  });

/**
 * @enum: 2 option: start server dev || start server prod
 */

const startServerDev = () => {
  process.env.NODE_ENV = 'DEVELOPMENT';
  console.log('Is running server DEVELOPMENT');
};

const startServerProd = () => {
  console.log('Is running server PRODUCTION');
  process.env.NODE_ENV = 'PRODUCTION';
};

if (process.argv[4] === '--dev') startServerDev();
else if (process.argv[4] === '--prod') startServerProd();

/**
 * @description: Start Server with port 8080
 */
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`);
});

/**
 * @description: unhandle rejection
 */
process.on('unhandledRejection', (err) => {
  console.log('Unhandled Rejection! 💥 Shutting down...');
  console.log(`${err.name}: ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});
