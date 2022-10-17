import type { Document } from 'mongodb';
import { connectMongo, disconnectMongo } from './utils';


export type BaseMongoOperationConfig = [dbName: string, collectionName: string];
export const visaMongoConfig: BaseMongoOperationConfig = ['xtravel', 'visa'];
export const flightMongoConfig: BaseMongoOperationConfig = ['xtravel', 'flight'];

export const getFromMongo = (dbName: string, collectionName: string) => {
  return connectMongo().then((mongoClient) => {
    const db = mongoClient.db(dbName);
    const collection = db.collection(collectionName);

    const allItems = collection.find();

    return allItems
      .toArray()
      .then((items) => disconnectMongo()?.then(() => items));
  });
};

export const putToMongo = <T extends Document>(
  dbName: string,
  collectionName: string,

  data: T[],
) => {
  return connectMongo().then((mongoClient) => {
    const db = mongoClient.db(dbName);
    const collection = db.collection(collectionName);

    return collection
      .insertMany(data, { ordered: true })
      .then(() => {
        return disconnectMongo();
      });
  });
};

export const dropMongo = (
  dbName: string,
  collectionName: string,
) => {
  return connectMongo().then((mongoClient) => {
    const db = mongoClient.db(dbName);
    const collection = db.collection(collectionName);

    return collection
      .deleteMany({})
      .then(() => disconnectMongo());
  });
};
