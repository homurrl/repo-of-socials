const { User, Thought } = require('../models');

const UserController = {
  async getAllUsers(req, res) {
    try {
      const users = await User.find({}).populate('thoughts').populate('friends');
      res.json(users);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  },
  async getUserById(req, res) {
    try {
      const user = await User.findById(req.params.id).populate('thoughts').populate('friends');
      if (!user) {
        res.status(404).json({ message: 'No user found with this id!' });
        return;
      }
      res.json(user);
    } catch (err) {
      res.status(400).json(err);
    }
  },
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.json(user);
    } catch (err) {
      res.status(400).json(err);
    }
  },
  async updateUser(req, res) {
    try {
      const user = await User.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      });
      if (!user) {
        res.status(404).json({ message: 'No user found with this id!' });
        return;
      }
      res.json(user);
    } catch (err) {
      res.status(400).json(err);
    }
  },

  // Delete a user by id
  async deleteUser(req, res) {
    try {
      const user = await User.findOneAndDelete({ _id: req.params.id });
      if (!user) {
        res.status(404).json({ message: 'No user found with this id!' });
        return;
      }
    } catch (err) {

    }
  },
  async addFriend(req, res) {
    try {
      const user = await User.findByIdAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.params.friendId } },
        { new: true }
      );
      if (!user) {
        res.status(404).json({ message: 'Invalid' });
        return;
      }
      res.json(user);
    } catch (err) {
      res.status(400).json(err);
    }
  },
  async deleteFriend(req, res) {
    try {
      const user = await User.findByIdAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId } },
        { new: true }
      );
      if (!user) {
        res.status(404).json({ message: 'Invalid' });
        return;
      }
      res.json(user);
    } catch (err) {
      res.status(400).json(err);
    }
  },
};

module.exports = UserController;
