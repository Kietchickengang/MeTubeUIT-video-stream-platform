import { client } from '../config/db.js';
import { ObjectId } from 'mongodb';

const getCollection = () => client.db('Metube').collection('notifications');

export const NotificationModel = {
  async create(data) {
    const coll = getCollection();
    return coll.insertOne(data);
  },

  async findByUserId(userId, limit = 50) {
    const coll = getCollection();
    return coll.find({ userId: new ObjectId(userId) }).sort({ createdAt: -1 }).limit(limit).toArray();
  },

  async markRead(notificationId) {
    const coll = getCollection();
    return coll.updateOne({ _id: new ObjectId(notificationId) }, { $set: { read: true } });
  }
};
