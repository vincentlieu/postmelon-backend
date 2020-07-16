const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');

// GET ALL POSTS
router.get('/', (req, res) => {
  Post.find().then((posts) => res.json(posts));
});

// CREATE NEW POST
router.post('/', (req, res) => {
  const date = new Date(Date.now());
  const content = req.body.content;
  const createdDate = date;
  const modifiedDate = date;

  const newPost = new Post({
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
});

// GET INDIVIDUAL POST
router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
    .then((post) => res.json(post))
    .catch((error) =>
      res
        .status(404)
        .json({ message: 'Post does not exist.', postId: req.params.id })
    );
});


module.exports = router;
