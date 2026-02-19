const bookForm = document.getElementById('book-form');
const bookList = document.getElementById('book-list');
const feedback = document.getElementById('api-feedback');

const chatForm = document.getElementById('chat-form');
const chatMessages = document.getElementById('chat-messages');

const socket = io();

/**
 * Render the full list of books.
 * @param {Array<{id:number,title:string,author:string,year:number|null}>} books
 */
function renderBooks(books) {
  bookList.innerHTML = '';

  if (!books.length) {
    bookList.innerHTML = '<p>No books yet. Add your first one.</p>';
    return;
  }

  books.forEach((book) => {
    const item = document.createElement('article');
    item.className = 'book-item';
    item.innerHTML = `
      <div>
        <strong>${book.title}</strong>
        <p>by ${book.author}${book.year ? ` (${book.year})` : ''}</p>
      </div>
      <button class="delete-btn" data-id="${book.id}">Delete</button>
    `;
    bookList.appendChild(item);
  });
}

/**
 * Fetch all books from the API.
 */
async function loadBooks() {
  try {
    const response = await fetch('/books');

    if (!response.ok) {
      throw new Error(`Failed to load books. Status: ${response.status}`);
    }

    const books = await response.json();
    renderBooks(books);
  } catch (error) {
    feedback.textContent = `Error: ${error.message}`;
  }
}

bookForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const title = document.getElementById('title').value.trim();
  const author = document.getElementById('author').value.trim();
  const year = document.getElementById('year').value;

  if (!title || !author) {
    feedback.textContent = 'Title and author are required.';
    return;
  }

  try {
    const response = await fetch('/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, author, year: year ? Number(year) : null })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Could not add book.');
    }

    bookForm.reset();
    feedback.textContent = 'Book added successfully.';
    await loadBooks();
  } catch (error) {
    feedback.textContent = `Error: ${error.message}`;
  }
});

bookList.addEventListener('click', async (event) => {
  const target = event.target;

  if (!target.classList.contains('delete-btn')) return;

  const id = target.dataset.id;

  try {
    const response = await fetch(`/books/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Could not delete book.');
    }

    feedback.textContent = 'Book deleted successfully.';
    await loadBooks();
  } catch (error) {
    feedback.textContent = `Error: ${error.message}`;
  }
});

/**
 * Render one chat message.
 * @param {{user:string,message:string,time:string}} payload
 */
function appendChatMessage(payload) {
  const item = document.createElement('p');
  item.className = 'chat-message';
  item.textContent = `[${payload.time || 'System'}] ${payload.user || 'System'}: ${payload.message}`;
  chatMessages.appendChild(item);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

chatForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const user = document.getElementById('chat-user').value.trim();
  const message = document.getElementById('chat-input').value.trim();

  if (!user || !message) {
    return;
  }

  socket.emit('chat message', { user, message });
  document.getElementById('chat-input').value = '';
});

socket.on('system message', (message) => {
  appendChatMessage({ user: 'System', message, time: new Date().toLocaleTimeString() });
});

socket.on('chat message', (payload) => {
  appendChatMessage(payload);
});

loadBooks();
