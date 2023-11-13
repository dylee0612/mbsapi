const ibmdb = require('./lib/ibm_db');
const dbConfig = require('./dbConfig.json');

const MUSICDB_CONNECTION_STRING = dbConfig.DB2['MUSICDB'];
const musicdb = ibmdb.connectDB(MUSICDB_CONNECTION_STRING, global.logger);

module.exports = musicdb;
