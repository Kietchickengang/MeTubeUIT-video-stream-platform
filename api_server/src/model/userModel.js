import { client } from '../config/db.js';
import { ObjectId } from 'mongodb';

const getCollection = () => {
  const db = client.db('Metube');
  return db.collection('userCollections');
};

export const UserModel = {
  async create(data) {
    const users = getCollection();
    return users.insertOne(data);
  },

  async findByEmail(email) {
    const users = getCollection();
    return users.findOne({ email });
  },

  async findById(id) {
    const users = getCollection();
    return users.findOne({ _id: new ObjectId(id) });
  },

  async updatePasswordById(id, hashedPassword) {
    const users = getCollection();
    return users.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: { passwordHash: hashedPassword, updatedAt: new Date() },
      }
    );
  },

  async updateAvatarById(id, avatarURL) {
    const users = getCollection();
    return users.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: { avatarUrl: avatarURL, avatar: avatarURL, updatedAt: new Date() },
      }
    );
  }

,

  async subscribe(userId, channelId) {
    const users = getCollection();
    return users.updateOne(
      { _id: new ObjectId(userId) },
      { $addToSet: { subscriptions: channelId } }
    );
  },

  async unsubscribe(userId, channelId) {
    const users = getCollection();
    return users.updateOne(
      { _id: new ObjectId(userId) },
      { $pull: { subscriptions: channelId } }
    );
  },
};
