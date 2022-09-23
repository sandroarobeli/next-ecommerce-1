// Mongoose is MongoDB's Object modeling tool. A good definition!
import mongoose from "mongoose";

const connection = {};

// Connecting function
async function connect() {
  if (connection.isConnected) {
    return console.log(
      process.env.MONGODB.toUpperCase() + " is already connected..."
    );
  }
  if (mongoose.connections.length > 0) {
    // Code 1 means "connecting". If so, disconnect right away. No need for two connections..
    connection.isConnected = mongoose.connections[0].readyState;
    if (connection.isConnected === 1) {
      return console.log(
        "Maintaining previous connection. Connection already established..."
      );
    }
    await mongoose.disconnect();
  }
  // Establish actual connection to the database
  const db = await mongoose.connect(
    process.env.MONGODB_URI,
    {
      useNewUrlParser: true,
      autoIndex: true,
      useUnifiedTopology: true,
    },
    (error) => {
      if (error) {
        return console.log("Unable to connect to database:\n" + error.message);
      }
      console.log(
        `Connection to ${process.env.MONGODB.toUpperCase()} database successful`
      );
    }
  );
  // Current connection state
  console.log(mongoose.STATES[mongoose.connection.readyState] + "...");
  connection.isConnected = mongoose.connections[0].readyState; //db.connection.readyState; //  .connections[0].readyState;
  console.log("readyState: ", connection.isConnected); // test
}

// Disconnecting function
async function disconnect() {
  if (connection.isConnected) {
    if (process.env.NODE_ENV === "production") {
      await mongoose.disconnect();
      connection.isConnected = false;
    } else {
      console.log(
        "Development mode. No need to connect & disconnect repeatedly."
      );
    }
  }
}

const db = { connect, disconnect };
export default db;
