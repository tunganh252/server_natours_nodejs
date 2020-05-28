// const { winston, transports, format, createLogger } = require('winston');

// const options = {
//   transports: [
//     new transports.Console({
//       level: process.env.NODE_ENV === 'DEVELOPMENT' ? 'error' : 'debug',
//       format: format.combine(
//         format.colorize({ all: true }),
//         format.simple(),
//         format.timestamp({
//           format: 'YYYY-MM-DD HH:mm:ss',
//         })
//       ),
//     }),
//     new transports.File({ filename: 'debug.log', level: 'debug' }),
//   ],
//   format: winston.format.combine(
//     format.colorize({ all: true }),
//     format.simple(),
//     format.timestamp({
//       format: 'YYYY-MM-DD HH:mm:ss',
//     })
//   ),
// };
// const logger = createLogger(options);
// const stream = {
//   write: (message) => {
//     logger.info(message);
//   },
// };

// module.exports = { logger, stream };
