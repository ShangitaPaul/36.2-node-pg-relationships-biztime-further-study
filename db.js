// /** Database setup for BizTime. */
// const { Client } = require("pg");
// const client = new Client({
//   connectionString: "postgresql:///biztime"
// });
// client.connect();
// module.exports = client;

const { Pool } = require('pg');

// Create a new Pool instance; the Pool object comes from a pg library
const pool = new Pool({
  user: 'shangita',
  host: '/var/run/postgresql/',
  database: 'biztime_db',
  port: 5432,
});

// Export the pool
  // The Pool instance is stored in the pool variable, and then exported so that it can be used in other files.
module.exports = pool;

// The Pool object is used to create a pool of connections to the database.


/* Further Study: Many to Many Relationships*/


