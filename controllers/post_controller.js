const {
  getAllPosts,
  addPost,
  getPostById,
  updatePost,
  deletePost,
  deleteAllPosts,
  incrementLike,
} = require('../utils/utilities');

const getPosts = (req, res) => {
  getAllPosts()
    .sort({ createdDate: -1 })
    .then((posts) => (posts.length > 0 ? res.json(posts) : res.status(204)));
};

const createPost = (req, res) => {
  addPost(req)
    .save()
    .then((post) =>
      res.json({ message: 'Successfully created.', createdPost: post })
    )
    .catch((error) => res.status(400).json({ message: error.message }));
};

const getPost = (req, res) => {
  const id = req.params.id;
  getPostById(id)
    .then((post) => res.json(post))
    .catch((error) =>
      res
        .status(404)
        .json({ message: 'Post does not exist.', postId: req.params.id })
    );
};

const editPost = (req, res) => {
  updatePost(req)
    .then((post) =>
      res.json({
        message: 'Post successfully updated.',
        postId: post.id,
      })
    )
    .catch((error) =>
      res.status(400).json({
        message:
          'Post could not be updated. Please check whether the post exists or content is specified for the post.',
        postId: req.params.id,
      })
    );
};

const removePost = (req, res) => {
  deletePost(req.params.id)
    .then(() =>
      res.json({
        message: 'Post successfully deleted.',
        postId: req.params.id,
      })
    )
    .catch((err) =>
      res.status(400).json({
        message: 'Cannot delete a post that does not exist.',
        postId: req.params.id,
      })
    );
};

const removePosts = (req, res) => {
  deleteAllPosts().then(() => res.json('Removed all posts'));
};

const likePost = (req, res) => {
  incrementLike(req).then((post) =>
    res.json({ message: 'Likes incremented', postId: post.id })
  );
};

module.exports = {
  getPosts,
  createPost,
  getPost,
  editPost,
  removePost,
  removePosts,
  likePost,
};
