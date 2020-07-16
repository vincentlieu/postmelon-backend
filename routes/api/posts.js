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

// EDIT INDIVIDUAL POST
router.put('/:id', (req, res) => {
    Post.findByIdAndUpdate(req.params.id, {
      $set: {
        content: req.body.content,
        modifiedDate: new Date(Date.now())
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
          message: 'Post could not be updated. Please check whether the post exists or content is specified for the post.',
          postId: req.params.id,
        })
      );
});

// DELETE INDIVIDUAL POST
router.delete('/:id', (req, res) => {
  Post.findByIdAndDelete(req.params.id)
    .then(() =>
      res.json({ message: 'Post successfully deleted.', postId: req.params.id })
    )
    .catch((err) =>
      res
        .status(400)
        .json({
          message: 'Cannot delete a post that does not exist.',
          postId: req.params.id,
        })
    );
});

// BELOW REMOVES ALL POSTS
// router.delete('/', (req, res) => {
//   Post.remove({}).then(()=> res.json("Removed all posts"))
// })

module.exports = router;
