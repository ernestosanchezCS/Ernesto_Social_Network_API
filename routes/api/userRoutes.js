const router = require('express').Router();
const {
    getUsers,
    getSingleUser,
    createUser,
    deleteUser,
    addThought,
    removeThought,
    addFriend,
    deleteFriend,
    updateUser,
} = require('../../controllers/userController');

// /api/users
router.route('/').get(getUsers).post(createUser);

// /api/users/:userId
router.route('/:userId').get(getSingleUser).delete(deleteUser).put(updateUser);

router
    .route('/:userId/editFriends/:friendId')
    .post(addFriend)
    .delete(deleteFriend);

// /api/users/:userId/thoughts
router.route('/:userId/thoughts').post(addThought);

// /api/users/:userId/thoughts/:thoughtId
router.route('/:userId/thoughts/:thoughtId').delete(removeThought);

module.exports = router;
