import mysql from 'mysql2/promise';

const retryInterval = 5000; // 5 seconds
const maxRetries = 15000; // Maximum number of retries before giving up
let retryCount = 0;

const connection = mysql.createPool({
  host: 'bag9t4bopwek2ep4zjwf-mysql.services.clever-cloud.com',
  port: 21685,
  user: 'uibryapw4ksisrop',
  password: 'WOmFKva4mezfWbZCE5b',
  database: 'bag9t4bopwek2ep4zjwf'
});

// Function to attempt connection
async function connectWithRetry() {
  try {
    // Attempt to get a connection from the pool
    const conn = await connection.getConnection();
    console.log('Connected as id ' + conn.threadId);
    conn.release(); // Release the connection after testing
    retryCount = 0; // Reset retry count after successful connection
  } catch (err) {
    console.error('Error connecting: ' + err.stack);
    retryCount++;
    
    if (retryCount < maxRetries) {
      console.log(`Retrying in ${retryInterval / 1000} seconds... (Attempt ${retryCount}/${maxRetries})`);
      setTimeout(connectWithRetry, retryInterval); // Retry after a delay
    } else {
      console.error('Maximum retry attempts reached. Could not connect to the database.');
      process.exit(1); // Exit the process after max retries
    }
  }
}

// Start the connection process
connectWithRetry();

export default connection;
