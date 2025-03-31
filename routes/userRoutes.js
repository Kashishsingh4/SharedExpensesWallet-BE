
const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/", async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) return res.status(400).json({ error: "Username is required" });
    let user = await User.findOne({ username });

    if (!user) {
      user = new User({ username });
      await user.save();
    }
    res.status(201).json({ message: "Username saved", user });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;