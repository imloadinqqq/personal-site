const express = require("express");
const router = express.Router();
const { getData, getPool } = require("../db.js");


router.get("/posts", async (req, res) => {
  try {
    const query = `
      SELECT
    p.postId,
    p.title,
    p.author,
    p.content,
    p.dateCreated,
    COALESCE(GROUP_CONCAT(DISTINCT t.tagName ORDER BY t.tagName SEPARATOR ', '), '') AS Tags
FROM Post p
LEFT JOIN TagPost tp ON p.postId = tp.postId
LEFT JOIN Tag t ON tp.tagId = t.tagId
GROUP BY p.postId
ORDER BY p.postId;
    `;

    const results = await getData(query);

    const formattedResults = results.map(post => ({
      ...post,
      Tags: post.Tags ? post.Tags.split(', '): []
    }));

    res.json(formattedResults);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve data", details: error.message });
  }
});

router.post("/posts", async (req, res) => {
  const { title, author, content, tags = [] } = req.body;
  const connectionPool = getPool();

  if (!title || !author || !content) {
    return res.status(400).json({ error: "Title, author, and content are required." });
  }

  const connection = await connectionPool.getConnection();
  try {
    await connection.beginTransaction();

    // Post handling
    const [postResult] = await connection.execute(
      `INSERT INTO Post (title, author, content, dateCreated) VALUES (?, ?, ?, NOW())`,
      [title, author, content]
    );

    const postId = postResult.insertId;

    // Tag handling
    for (const tagName of tags) {
      let [rows] = await connection.execute(
        `SELECT tagId FROM Tag WHERE tagName = ?`,
        [tagName]
      );

      let tagId;
      if (rows.length > 0) {
        tagId = rows[0].tagId;
      } else {
        const [tagInsertResult] = await connection.execute(
          `INSERT INTO Tag (tagName) VALUES (?)`,
          [tagName]
        );
        tagId = tagInsertResult.insertId;
      }

      await connection.execute(
        `INSERT INTO TagPost (postId, tagId) VALUES (?, ?)`,
        [postId, tagId]
      );
    }

    await connection.commit();
    res.status(201).json({ message: "Post created successfully", postId });
  } catch (error) {
    await connection.rollback();
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Failed to create post", details: error.message });
  } finally {
    connection.release();
  }
});

router.delete("/posts/:id", async (req, res) => {
  const connectionPool = getPool();
  const connection = await connectionPool.getConnection();
  const id = parseInt(req.params.id);

  try {
    await connection.beginTransaction();

    await connection.execute(`DELETE FROM TagPost WHERE postId = ?`, [id]);

    const query = `DELETE FROM Post WHERE postId = ?`;
    const [deleteResult] = await connection.execute(query, [id]);

    await connection.commit();

    if (deleteResult.affectedRows === 0) {
      res.status(404).json({ message: "Post not found" });
    } else {
      res.status(200).json({ message: "Post deleted successfully", deletedId: id });
    }
  } catch (error) {
    await connection.rollback();
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Failed to delete post", details: error.message });
  } finally {
    connection.release();
  }
});


module.exports = router;