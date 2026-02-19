 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/server.js b/server.js
new file mode 100644
index 0000000000000000000000000000000000000000..6afd7be77c89e040ef44f6f66a81c3af078d09cb
--- /dev/null
+++ b/server.js
@@ -0,0 +1,122 @@
+const express = require('express');
+const http = require('http');
+const path = require('path');
+const { Server } = require('socket.io');
+
+const app = express();
+const server = http.createServer(app);
+const io = new Server(server);
+
+const PORT = process.env.PORT || 3000;
+
+// In-memory data storage for books.
+const books = [];
+let nextBookId = 1;
+
+app.use(express.json());
+app.use(express.static(path.join(__dirname, 'public')));
+
+/**
+ * Add a new book.
+ * Body: { title: string, author: string, year?: number }
+ */
+app.post('/books', (req, res) => {
+  try {
+    const { title, author, year } = req.body;
+
+    if (!title || !author) {
+      return res.status(400).json({ message: 'Title and author are required.' });
+    }
+
+    const newBook = {
+      id: nextBookId++,
+      title: title.trim(),
+      author: author.trim(),
+      year: year ? Number(year) : null
+    };
+
+    books.push(newBook);
+    return res.status(201).json(newBook);
+  } catch (error) {
+    return res.status(500).json({ message: 'Failed to add book.', error: error.message });
+  }
+});
+
+/**
+ * Get all books.
+ */
+app.get('/books', (req, res) => {
+  return res.status(200).json(books);
+});
+
+/**
+ * Update a book by id.
+ * Body can include: { title, author, year }
+ */
+app.put('/books/:id', (req, res) => {
+  try {
+    const id = Number(req.params.id);
+    const bookIndex = books.findIndex((book) => book.id === id);
+
+    if (bookIndex === -1) {
+      return res.status(404).json({ message: 'Book not found.' });
+    }
+
+    const { title, author, year } = req.body;
+
+    if (title !== undefined) {
+      books[bookIndex].title = String(title).trim();
+    }
+
+    if (author !== undefined) {
+      books[bookIndex].author = String(author).trim();
+    }
+
+    if (year !== undefined) {
+      books[bookIndex].year = year ? Number(year) : null;
+    }
+
+    return res.status(200).json(books[bookIndex]);
+  } catch (error) {
+    return res.status(500).json({ message: 'Failed to update book.', error: error.message });
+  }
+});
+
+/**
+ * Delete a book by id.
+ */
+app.delete('/books/:id', (req, res) => {
+  try {
+    const id = Number(req.params.id);
+    const bookIndex = books.findIndex((book) => book.id === id);
+
+    if (bookIndex === -1) {
+      return res.status(404).json({ message: 'Book not found.' });
+    }
+
+    const [deletedBook] = books.splice(bookIndex, 1);
+    return res.status(200).json({ message: 'Book deleted successfully.', deletedBook });
+  } catch (error) {
+    return res.status(500).json({ message: 'Failed to delete book.', error: error.message });
+  }
+});
+
+// Socket.io real-time chat setup.
+io.on('connection', (socket) => {
+  socket.emit('system message', 'Connected to Internship Project chat.');
+
+  socket.on('chat message', (messagePayload) => {
+    const payload = {
+      id: Date.now(),
+      user: messagePayload.user || 'Anonymous',
+      message: messagePayload.message || '',
+      time: new Date().toLocaleTimeString()
+    };
+
+    io.emit('chat message', payload);
+  });
+});
+
+server.listen(PORT, () => {
+  console.log(`Server running on port ${PORT}`);
+});
 
EOF
)
