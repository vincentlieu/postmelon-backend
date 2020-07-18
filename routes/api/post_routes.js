const express = require('express');
const router = express.Router();
const { getPosts, createPost, getPost, editPost, removePost, removePosts, likePost } = require('../../controllers/post_controller')

router.get('/', getPosts)
router.post('/', createPost)
router.delete('/', removePosts);

router.put('/:id/like', likePost);

router.get('/:id', getPost)
router.put('/:id', editPost)
router.delete('/:id', removePost)

// GET POST BY AUTHOR ID
router.get('/:userId/all', (req, res) => {
  Post.find({ authorId: req.params.userId })
    .then((posts) =>
      posts.length > 0 ? res.json(posts.reverse()) : res.status(204).send())
    .catch((error) =>
      res.status(400).json({
        message: error,
        userId: req.params.userId,
      })
    )
});

module.exports = router;
