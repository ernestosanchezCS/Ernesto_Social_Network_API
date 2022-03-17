const { Thought, User } = require('../models');

module.exports = {
    // Get all thoughts
    getThoughts(req, res) {
        Thought.find()
            .then((thoughts) => res.json(thoughts))
            .catch((err) => res.status(500).json(err));
    },
    // Get a course
    getSingleThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
            .select('-__v')
            .then((thought) =>
                !thought
                    ? res
                          .status(404)
                          .json({ message: 'No thought with that ID' })
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },
    //we make all our thoughts through user controller since only user can create a thought
    createThought(req, res) {
        Thought.create(req.body)
            .then((thought) => {
                return User.findOneAndUpdate(
                    { _id: req.body.userId },
                    { $addToSet: { thoughts: thought._id } },
                    { new: true }
                );
            })
            .then((user) =>
                !user
                    ? res.status(404).json({
                          message:
                              'Thought created but found no User found with that ID',
                      })
                    : res.json('Created the thought.')
            )
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },
    //Delete a course also we applied this in user routes to keep it associated and managed relative to a user every thought must have one user creator
    deleteThought(req, res) {
        Thought.findOneAndDelete({ _id: req.params.thoughtId })
            .then((thought) =>
                !thought
                    ? res
                          .status(404)
                          .json({ message: 'No thought with that ID' })
                    : res.status(404).json({ message: 'Deleted thought.' })
            )
            .then(() => res.json({ message: 'Thought deleted!' }))
            .catch((err) => res.status(500).json(err));
    },
    // Adds a reaction to a thought. This method is unique in that we add the entire body of the tag rather than the ID with the mongodb $addToSet operator.
    createReaction(req, res) {
        Thought.findByIdAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body } },
            { runValidators: true, new: true }
        )
            .then((thought) =>
                !thought
                    ? res.status(404).json({
                          message:
                              'Reaction created, but found no thought with that ID',
                      })
                    : res.json('Created the reaction 🎉')
            )
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },
    //delete a reaction
    deleteReaction(req, res) {
        Thought.findByIdAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { _id: req.params.reactionId } } },
            { runValidators: true, new: true }
        )
            .then((thought) =>
                !thought
                    ? res.status(404).json({
                          message: 'No reaction with that ID',
                      })
                    : res.json('Deleted the reaction 🎉')
            )
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },
    // Update a thought we can add a with auth middlware file to ensure session id matches thought user id so only creator can edit the thought
    updateThought(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { runValidators: true, new: true }
        )
            .then((thought) =>
                !thought
                    ? res
                          .status(404)
                          .json({ message: 'No thought with this id!' })
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },
};
