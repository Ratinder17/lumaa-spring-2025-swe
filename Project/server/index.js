const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const { registerUser, loginUser } = require("./authController");
const authenticate = require("./authMiddleware");

app.use(cors());
app.use(express.json());

app.post("/auth/register", registerUser);
app.post("/auth/login", loginUser);

app.post("/tasks", authenticate, async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user.userId;

    const newTask = await pool.query(
      "INSERT INTO tasks (title, description, userid) VALUES($1, $2, $3) RETURNING *",
      [title, description, userId]
    );

    res.json(newTask.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/tasks", authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;
    const allTasks = await pool.query("SELECT * FROM tasks WHERE userid = $1", [
      userId,
    ]);
    res.json(allTasks.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/tasks/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const task = await pool.query(
      "SELECT * FROM tasks WHERE id = $1 AND userid = $2",
      [id, userId]
    );

    if (task.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Task not found or unauthorized" });
    }

    res.json(task.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/tasks/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { iscomplete } = req.body;
    const userId = req.user.userId;

    const updateTask = await pool.query(
      "UPDATE tasks SET iscomplete = $1 WHERE id = $2 AND userid = $3 RETURNING id, title, description, iscomplete, userid",
      [iscomplete, id, userId]
    );

    if (updateTask.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Task not found or unauthorized" });
    }

    res.json(updateTask.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/tasks/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const deleteTask = await pool.query(
      "DELETE FROM tasks WHERE id = $1 AND userid = $2 RETURNING *",
      [id, userId]
    );

    if (deleteTask.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Task not found or unauthorized" });
    }

    res.json({ message: "Task Deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(3000, () => {
  console.log("Server has started on port 3000");
});
