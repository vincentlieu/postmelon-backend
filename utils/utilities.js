const Post = require('../models/post');
const { post } = require('request');

const getAllPosts = () => {
  return Post.find();
};

const addPost = (req) => {
  const date = Date.now();
  req.body.authorId = '5f1131a075c3cf75c746402a';
  req.body.createdDate = date;
  req.body.modifiedDate = date;
  req.body.likes = 0;
  return new Post(req.body);
};

const getPostById = (id) => {
  return Post.findById(id);
};

const updatePost = (req) => {
  return Post.findByIdAndUpdate(req.params.id, {
    $set: {
      content: req.body.content,
      modifiedDate: Date.now(),
    },
  });
};

const deletePost = (id) => {
  return Post.findByIdAndDelete(id);
};

const deleteAllPosts = () => {
  return Post.remove({});
};

const incrementLike = (req) => {
  return Post.findByIdAndUpdate(req.params.id, {
    $inc: {
      likes: 1,
    },
  });
};

module.exports = {
  getAllPosts,
  addPost,
  getPostById,
  updatePost,
  deletePost,
  deleteAllPosts,
  incrementLike,
};
