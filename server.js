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


let PORT = 8080;
let server = null;

const startServer = (type) => {
  PORT =
    type === process.env.PORT_DEV
      ? process.env.PORT_DEV
      : type === process.env.PORT_PROD
      ? process.env.PORT_PROD
      : 8080;

  server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}.`);
  });

  if (type === process.env.PORT_DEV) {
    process.env.NODE_ENV = 'DEVELOPMENT';
    console.log('Is running server DEVELOPMENT');
  } else if (type === process.env.PORT_PROD) {
    process.env.NODE_ENV = 'PRODUCTION';
    console.log('Is running server PRODUCTION');
  }
};

if (process.argv[4] === '--dev') startServer(process.env.PORT_DEV);
else if (process.argv[4] === '--prod') startServer(process.env.PORT_PROD);

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
