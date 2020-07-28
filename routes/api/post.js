const express = require("express");
const router = express.Router();
const Post = require("../../models/Post");
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");

// GET ALL POST
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// CREATE NEW POST
router.post(
  "/",
  [auth, [check("content", "Text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");
      const newPost = new Post({
        content: req.body.content,
        name: user.name,
        avatar: user.avatar,
        authorId: req.user.id,
        date: new Date(Date.now())
      });

      const post = await newPost.save();
      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// REMOVE POST
router.delete("/:id", async (req, res) => {

  try {
    const user = req.user.id;
    const post = await Post.findById(req.params.id);

    if (user != post.authorId) {
      return res.status(401).json({
        message: "You are not authorized to remove this post.",
        postId: post.id,
      });
    }

    Post.findByIdAndDelete(req.params.id, async () => {}).then(() =>
      res.json({
        message: "Post successfully deleted.",
        postId: req.params.id,
      })
    );
  } catch (error) {
    res.status(400).json({
      message: "Cannot delete a post that does not exist.",
      postId: req.params.id,
    });
  }
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

// LIKE POST
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // CHECK IF POST HAS BEEN LIKED BY THE USER ALREADY.
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      const removeIndex = post.likes
        .map((like) => like.user.toString())
        .indexOf(req.user.id);

      post.likes.splice(removeIndex, 1);
      await post.save();

      return res.status(200).json(post);
    } else {
      post.likes.unshift({ user: req.user.id });
      post.save().then(res.json(post)
      );
    }
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// ADD COMMENT TO POST
router.post("/:id/comments", async (req, res) => {
  
  try {
    const user = await User.findById(req.user.id).select("-password");
    const post = await Post.findById(req.params.id);

    if (!req.body.content) { res.status(400).json({ message: 'Content cannot be empty.' }) }
    
    const newComment = {
      content: req.body.content,
      name: user.name,
      avatar: user.avatar,
      user: req.user.id,
    };

    post.modifiedDate = Date.now()
    post.comments.unshift(newComment);

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// EDIT COMMENT FROM POST
router.put("/:id/comments/:commentId", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const comment = post.comments.find(
      (comment) => comment.id === req.params.commentId
    );

    if (!comment) {
      return res.status(404).json({ message: "Comment does not exist." });
    }

    if (comment.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ message: "You are unauthorized to edit this comment." });
    }

    comment.content = req.body.content;
    comment.modifiedDate = Date.now();
    post.save()
      .then(
      res.status(200).json(
        post
      )
    );
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// REMOVE COMMENT FROM POST
router.delete("/:id/comments/:commentId", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const comment = post.comments.find(
      (comment) => comment.id === req.params.commentId
    );

    if (!comment) {
      return res.status(404).json({ message: "Comment does not exist." });
    }

    if (comment.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ message: "You are unauthorized to remove this comment." });
    }

    post.comments.id(comment).remove()
    post.save()

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
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
router.put("/:id", async (req, res) => {
  try {
    const user = req.user.id;
    const post = await Post.findById(req.params.id);

    if (user != post.authorId) {
      res.status(401).json({ message: "Unauthorized" });
    }

    if (!req.body.content) {
      res.status(400).json({ message: "You must provide content to a post." });
    }

    Post.findByIdAndUpdate(req.params.id, {
      $set: {
        content: req.body.content,
        modifiedDate: new Date(Date.now()),
      },
    }, {new: true}).then((post) =>
      res.json(
        post
      )
    );
  } catch (error) {
    res.status(404).json({
      message: "Cannot update a post that does not exist.",
      postId: req.params.id,
    });
  }
});

// BELOW REMOVES ALL POSTS
router.delete("/", (req, res) => {
  Post.remove({}).then(() => res.json("Removed all posts"));
});

module.exports = router;
