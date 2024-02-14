const express = require("express");
const Post = require("../models/Post");
const Comment = require("../models/Comments");
const router = new express.Router();

router.get("/post/:id/comment", (req, res) => {
  res.render("post-comment", { title: "Post a comment" });
});
router.post("/post/:id/comment", async (req, res) => {
  const id = req.params.id;
  const comment = new Comment({
    text: req.body.comment,
    post: id,
  });
  await comment.save();
  const postRelated = await Post.findById(id);
  postRelated.comments.push(comment);
  await postRelated.save(function (err) {
    if (err) {
      console.log(err);
    }
    res.redirect("/");
  });
});

router.post("/post/:id/comment", async (req, res) => {
  const id = req.params.id;
  const comment = new Comment({
    text: req.body.comment,
    post: id,
  });
  // save comment
  await comment.save();
  const postRelated = await Post.findById(id);
  postRelated.comments.push(comment);
  await postRelated.save(function (err) {
    if (err) {
      console.log(err);
    }
    res.redirect("/");
  });
});
router.get("/new", (req, res) => {
  res.render("create-post", { title: "Create a post" });
});
router.post("/new", (req, res) => {
  const post = new Post({
    title: req.body.title,
    text: req.body.text,
  });
  post.save(function (err) {
    if (err) {
      console.log(err);
    }
    res.redirect("/");
  });
});
router.get("/", (req, res) => {
  Post.find().exec(function (err, results) {
    if (err) {
      console.log(err);
    }
    res.render("posts", { title: "All Posts", posts: results });
  });
});
module.exports = router;
