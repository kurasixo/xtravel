import { mongoLog } from '../utils/log';
import { MongoClient, ServerApiVersion } from 'mongodb';


const getUtilsForMongoConnection = () => {
  const uri = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@xtravel-mongodb.fttbyce.mongodb.net/?retryWrites=true&w=majority`;
  let mongoConnection: Promise<MongoClient> | null = null;

  const connectMongo = () => {
    if (mongoConnection !== null) {
      mongoLog('mongo is already connected');
      return mongoConnection;
    }

    mongoLog('trying connect to mongo');
    const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });

    const connectionPromise = client.connect().then((connection) => {
      mongoLog('connected to mongo');
      mongoConnection = connectionPromise;
      return connection;
    });

    return connectionPromise;
  };

  const disconnectMongo = () => {
    if (mongoConnection === null) {
      mongoLog('mongo is not connected');
      return;
    }

    return mongoConnection.then((mongoClient) => {
      return mongoClient.close()
        .then(() => {
          mongoConnection = null;
          mongoLog('disconnected to mongo');
        });
    });
  };

  return { connectMongo, disconnectMongo };
};

export const { connectMongo, disconnectMongo } = getUtilsForMongoConnection();
