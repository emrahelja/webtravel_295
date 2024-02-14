const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

/**
 HOME
 */
router.get("", async (req, res) => {
  try {
    const locals = {
      title: "NodeJs Blog",
      description: "Simple Blog created with NodeJs, Express & MongoDb.",
    };

    let perPage = 10;
    let page = req.query.page || 1;

    const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();
    const count = await Post.countDocuments({});
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    res.render("index", {
      locals,
      data,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
      currentRoute: "/",
    });
  } catch (error) {
    console.log(error);
  }
});

/**
 Post :id
 */
router.get("/post/:id", async (req, res) => {
  try {
    let slug = req.params.id;

    const data = await Post.findById({ _id: slug });

    const locals = {
      title: data.title,
      description: "Simple Blog created with NodeJs, Express & MongoDb.",
      image: data.image,
    };

    res.render("post", {
      locals,
      data,
      currentRoute: `/post/${slug}`,
    });
  } catch (error) {
    console.log(error);
  }
});
router.get("/userPage", async (req, res) => {
  try {
    const locals = {
      title: "User Page",
      description: "User Page Description",
    };
    const data = await Post.find();
    res.render("userPage", { locals, data });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

/**
Post - searchTerm
 */
router.post("/search", async (req, res) => {
  try {
    const locals = {
      title: "Seach",
      description: "Simple Blog created with NodeJs, Express & MongoDb.",
    };

    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

    const data = await Post.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChar, "i") } },
        { body: { $regex: new RegExp(searchNoSpecialChar, "i") } },
      ],
    });

    res.render("search", {
      data,
      locals,
      currentRoute: "/",
    });
  } catch (error) {
    console.log(error);
  }
});
router.post("/posts/:postId/comments", async (req, res) => {
  try {
    const postId = req.params.postId;
    const { commentText, author } = req.body;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const newComment = {
      text: commentText,
      author: author,
    };

    post.comments.push(newComment);

    try {
      await post.save();
      res.status(201).json({ message: "Comment added successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/*
 * GET /
 * About
 */
router.get("/login", (req, res) => {
  res.render("login", {
    currentRoute: "/login",
  });
});
router.get("/add-user", (req, res) => {
  res.render("add-user", {
    currentRoute: "/add-user",
  });
});
router.get("/userPage", (req, res) => {
  res.render("userPage", { title: "User Page" });
});

router.get("/admin", (req, res) => {
  res.render("admin", {
    currentRoute: "/admin",
  });
});
router.get("/loginAdmin", (req, res) => {
  res.render("loginAdmin", { currentRoute: "/loginAdmin" });
});
router.get("/add-user", (req, res) => {
  res.render("add-user", { currentRoute: "/add-user" });
});
router.get("/add-post", (req, res) => {
  res.render("add-post", { currentRoute: "/add-post" });
});

router.get("/edit-user", (req, res) => {
  res.render("edit-user", { currentRoute: "/edit-user" });
});

router.get("/apply", (req, res) => {
  res.render("apply", { currentRoute: "/apply" });
});
router.get("/applied-trips", (req, res) => {
  res.render("applied-trips", { currentRoute: "/applied-trips" });
});

module.exports = router;
