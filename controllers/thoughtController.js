const { Thought, User } = require('../models');

module.exports = {
  // Get all thoughts
  getThoughts(req, res) {
    Thought.find()
      .then((thoughts) => res.status(200).json(thoughts))
      .catch((err) => res.status(500).json(err));
  },
  // Get a thought
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .select('-__v')
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with this ID!' })
          : res.status(200).json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Create a thought
  createThought(req, res) {
    Thought.create(req.body)
    .then((thought) =>
    !thought
      ? res.status(404).json({ message: "No thought with this id!" })
      : User.findByIdAndUpdate(
          req.body.userId,
          //add thought id created to 'thought' array when user info is pulled
          { $push: { thoughts: thought._id }},
          { runValidators: true, new: true }
        )
  .then(() => res.status(200).json({ message: 'Thought created!' }))
  .catch((err) => res.status(500).json(err)))
  },
  // Delete a thought
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with this ID!' })
          : User.deleteMany({ _id: { $in: thought.users } })
      )
      .then(() => res.status(200).json({ message: 'Thought deleted!' }))
      .catch((err) => res.status(500).json(err));
  },
  // Update a thought
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with this ID!!' })
          : res.status(200).json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
  //post reaction
  createReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $push: {reactions: req.body} },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        ! thought
          ? res.status(404).json({ message: 'No thought with this ID!!' })
          : res.status(200).json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
  deleteReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: {reactionId: req.params.reactionId}}},
      { runValidators: true, new: true }
    )
      .then((reaction) =>
        !reaction
          ? res
              .status(404)
              .json({ message: 'No reaction found with that ID!!' })
          : res.status(200).json(reaction)
      )
      .catch((err) => res.status(500).json(err));
  },
};