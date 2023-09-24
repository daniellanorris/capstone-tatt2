import mongoose from 'mongoose'

const connection = {};

async function dbConnect() {
     if(connection.isConnected) {
         return;
     }

     async function connectToDatabase() {
        try {
          await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
          console.log('Connected to MongoDB');
        } catch (error) {
          console.error('MongoDB connection error:', error);
        }
      }

      connectToDatabase();
}


export default dbConnect;