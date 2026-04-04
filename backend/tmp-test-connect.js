const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const mongoose = require('mongoose');
const uri = 'mongodb+srv://taimour448_db_user:taimour448@cluster0.ueyzhsi.mongodb.net/wiserconsulting?retryWrites=true&w=majority';

mongoose.connect(uri, {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
})
  .then(() => {
    console.log('CONNECTED');
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
