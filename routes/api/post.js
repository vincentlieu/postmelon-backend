const express = require("express");
const router = express.Router();
const Post = require("../../models/Post");

// GET ALL POST
router.get("/", (req, res) => {
  Post.find()
    .sort({ createdDate: -1 })
    .then((posts) => (posts.length > 0 ? res.json(posts) : res.status(204)));
});

// CREATE NEW POST
router.post("/", (req, res) => {
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
      res.json({ message: "Successfully created.", createdPost: newPost })
    )
    .catch((error) =>
      res.status(400).json(`ERROR: ${error.errors.description}`)
    );
});

// REMOVE POST
router.delete("/:id", (req, res) => {
  Post.findByIdAndDelete(req.params.id)
    .then(() =>
      res.json({ message: "Post successfully deleted.", postId: req.params.id })
    )
    .catch((err) =>
      res.status(400).json({
        message: "Cannot delete a post that does not exist.",
        postId: req.params.id,
      })
    );
});

// GET POST BY AUTHOR ID
router.get("/all", (req, res) => {
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
router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then((post) => res.json(post))
    .catch((error) =>
      res
        .status(404)
        .json({ message: "Post does not exist.", postId: req.params.id })
    );
});

// UPDATE INDIVIDUAL POST
router.put("/:id", (req, res) => {
  Post.findByIdAndUpdate(req.params.id, {
    $set: {
      content: req.body.content,
      modifiedDate: new Date(Date.now()),
    },
  })
    .then(() =>
      res.json({
        message: "Post successfully updated.",
        postId: req.params.id,
      })
    )
    .catch((error) =>
      res.status(400).json({
        message:
          "Post could not be updated. Please check whether the post exists or content is specified for the post.",
        postId: req.params.id,
      })
    );
});

// BELOW REMOVES ALL POSTS
router.delete("/", (req, res) => {
  Post.remove({}).then(() => res.json("Removed all posts"));
});

////

// @route put api/posts/like/:id
// @desc like a post
// @access Private

router.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    // check if the post has already been liked

    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: "Post already liked" });
    }
    post.likes.unshift({ user: req.user.id });
    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route put api/posts/unlike/:id
// @desc like a post
// @access Private

router.put("/unlike/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    // check if the post has already been liked

    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: "Post has not yet been liked" });
    }

    // get remove index

    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);

    post.likes.splice(removeIndex, 1);
    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// add comment route

// @route POST api/posts/comment/:id
// @desc comment on post
// @access Private
router.post(
  "/comment/:id",
  [auth, [check("text", "Text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");
      const post = await Post.findById(req.params.id);

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };

      post.comments.unshift(newComment);

      await post.save();
      res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// add comment route

// @route Delete api/posts/comment/:id/:comment_id
// @desc delete comment on post
// @access Private

router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    // pull out comment from post

    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );

    // make sure comment exist

    if (!comment) {
      return res.status(404).json({ msg: "Comment does not exist" });
    }

    // check user

    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    // get remove index

    const removeIndex = post.comments
      .map((comment) => comment.user.toString())
      .indexOf(req.user.id);

    post.comments.splice(removeIndex, 1);
    await post.save();

    res.json(post.comments);
  } catch (err) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
