const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException', (error) => {
  console.log('UNCAUGHT EXCEPTION SHUTTING DOWN SERVER.....');
  console.log(error);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const port = process.env.PORT || 3000;

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    // console.log(con.connections);
    console.log('DB connection established');
  });

const server = app.listen(port, () => {
  console.log(`app running on port no ${port}`);
});

process.on('unhandledRejection', (error) => {
  console.log('UNHANDLED REJECTION SHUTTING DOWN SERVER.....');
  console.log(error);
  server.close(() => {
    process.exit(1);
  });
});
