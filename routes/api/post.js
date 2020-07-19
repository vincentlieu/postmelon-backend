const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');

// GET ALL POST
router.get('/', (req, res) => {
  Post.find()
    .sort({ createdDate: -1 })
    .then((posts) => (posts.length > 0 ? res.json(posts) : res.status(204)));
});

// CREATE NEW POST
router.post('/', (req, res) => {
  const date = new Date(Date.now());
  const authorId = req.user.id;
  const content = req.body.content;
  const createdDate = date;
  const modifiedDate = date;

  const newPost = new Post({
    authorId,
    content,
    createdDate,
    modifiedDate,
  });

  newPost
    .save()
    .then(() =>
      res.json({ message: 'Successfully created.', createdPost: newPost })
    )
    .catch((error) =>
      res.status(400).json(`ERROR: ${error.errors.description}`)
    );
})

// REMOVE POST
router.delete('/:id', (req, res) => {
  Post.findByIdAndDelete(req.params.id)
    .then(() =>
      res.json({ message: 'Post successfully deleted.', postId: req.params.id })
    )
    .catch((err) =>
      res.status(400).json({
        message: 'Cannot delete a post that does not exist.',
        postId: req.params.id,
      })
    );
});

// GET POST BY AUTHOR ID
router.get('/all', (req, res) => {
  Post.find({ authorId: req.user.id })
    .sort({ createdDate: -1 })
    .then((posts) =>
      posts.length > 0 ? res.json(posts) : res.status(204).send()
    )
    .catch((error) =>
      res.status(400).json({
        message: error,
        userId: req.user.id,
      })
    );
});

// SHOW INDIVIDUAL POST
router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
    .then((post) => res.json(post))
    .catch((error) =>
      res
        .status(404)
        .json({ message: 'Post does not exist.', postId: req.params.id })
    );
});

// UPDATE INDIVIDUAL POST
router.put('/:id', (req, res) => {
  Post.findByIdAndUpdate(req.params.id, {
    $set: {
      content: req.body.content,
      modifiedDate: new Date(Date.now()),
    },
  })
    .then(() =>
      res.json({
        message: 'Post successfully updated.',
        postId: req.params.id,
      })
    )
    .catch((error) =>
      res.status(400).json({
        message:
          'Post could not be updated. Please check whether the post exists or content is specified for the post.',
        postId: req.params.id,
      })
    );
});

// BELOW REMOVES ALL POSTS
router.delete('/', (req, res) => {
  Post.remove({}).then(()=> res.json("Removed all posts"))
})

module.exports = router;
