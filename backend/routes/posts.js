const express = require("express");
const { getData } = require("../db");
const router = express.Router();

const timeLog = (req, res, next) => {
  console.log('Time: ', Date.now());
  next();
}
router.use(timeLog);


router.get('/posts', async (req, res) => {
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

    const posts = results.map(post => ({
      ...post,
      Tags: post.Tags
        ? post.Tags.split(',').map(tag => tag.trim())
        : []
    }));

    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve data", details: err.message });
  }
});

router.get('/posts/:id', async (req, res) => {
  const postId = req.params.id;

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
      WHERE p.postId = ?
      GROUP BY p.postId;
    `;

    const results = await getData(query, [postId]);

    if (results.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const post = results[0];
    post.Tags = post.Tags ? post.Tags.split(',').map(tag => tag.trim()) : [];

    res.json(post);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve post', details: err.message });
  }
});

router.post('/posts', async (req, res) => {
  const { title, author, content, tags = [] } = req.body;

  try {
    const insertPostQuery = `
      INSERT INTO Post (title, author, content, dateCreated)
      VALUES (?, ?, ?, NOW());
    `;
    const result = await runQuery(insertPostQuery, [title, author, content]);
    const postId = result.insertId;

    for (const tagName of tags) {
      const [tag] = await getData(`SELECT tagId FROM Tag WHERE tagName = ?`, [tagName]);
      let tagId = tag?.tagId;

      if (!tagId) {
        const tagResult = await runQuery(`INSERT INTO Tag (tagName) VALUES (?)`, [tagName]);
        tagId = tagResult.insertId;
      }

      await runQuery(`INSERT INTO TagPost (postId, tagId) VALUES (?, ?)`, [postId, tagId]);
    }

    res.status(201).json({ message: 'Post created', postId });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create post', details: err.message });
  }
});

router.put('/posts/:id', async (req, res) => {
  const postId = req.params.id;
  const { title, author, content, tags = [] } = req.body;

  try {
    await runQuery(
      `UPDATE Post SET title = ?, author = ?, content = ? WHERE postId = ?`,
      [title, author, content, postId]
    );

    await runQuery(`DELETE FROM TagPost WHERE postId = ?`, [postId]);

    for (const tagName of tags) {
      const [tag] = await getData(`SELECT tagId FROM Tag WHERE tagName = ?`, [tagName]);
      let tagId = tag?.tagId;

      if (!tagId) {
        const tagResult = await runQuery(`INSERT INTO Tag (tagName) VALUES (?)`, [tagName]);
        tagId = tagResult.insertId;
      }

      await runQuery(`INSERT INTO TagPost (postId, tagId) VALUES (?, ?)`, [postId, tagId]);
    }

    res.json({ message: 'Post updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update post', details: err.message });
  }
});

router.delete('/posts/:id', async (req, res) => {
  const postId = req.params.id;

  try {
    await runQuery(`DELETE FROM TagPost WHERE postId = ?`, [postId]);
    await runQuery(`DELETE FROM Post WHERE postId = ?`, [postId]);

    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete post', details: err.message });
  }
});

module.exports = router;