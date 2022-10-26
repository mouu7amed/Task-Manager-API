const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
const Task = require("../models/task");

router.post("/tasks", auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });
  try {
    const response = await task.save();
    res.status(201).send(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /tasks?completed=boolean
// GET /tasks?limit=10&skip=0
// GET /tasks?sortBy=createdAt:desc
router.get("/tasks", auth, async (req, res) => {
  const match = {};
  const sort = {};

  if (req.query.completed) {
    match.completed = req.query.completed === "true";
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }

  try {
    await req.user.populate({
      path: "tasks",
      match,
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort,
      },
    });
    res.status(200).json(req.user.tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/tasks/:taskId", auth, async (req, res) => {
  const taskId = req.params.taskId;
  try {
    const task = await Task.findOne({ _id: taskId, owner: req.user._id });
    if (!task) return res.status(404).send("404 - TASK NOT FOUND!");
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/tasks/:taskId", auth, async (req, res) => {
  const taskId = req.params.taskId;
  const body = req.body;
  const updates = Object.keys(body);
  const allowedUpdates = ["description", "completed"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation)
    return res.status(400).send({ error: "Invalid Updates" });
  try {
    const task = await Task.findOne({ _id: taskId, owner: req.user._id });
    if (!task) return res.status(404).send("404 - TASK NOT FOUND!");
    updates.forEach((update) => (task[update] = body[update]));
    await task.save();
    res.status(200).send(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/tasks/:taskId", auth, async (req, res) => {
  const taskId = req.params.taskId;
  try {
    const task = await Task.findOneAndDelete({
      _id: taskId,
      owner: req.user._id,
    });
    if (!task) return res.status(404).send("404 - TASK NOT FOUND!");
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
