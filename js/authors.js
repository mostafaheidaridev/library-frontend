import { BASE_URL } from './info.js';

const showAllAuthors = async () => {
    try {
        const response = await fetch(`${BASE_URL}/authors`);
        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        const authors = data.authors || data.results || data;

        const fragment = document.createDocumentFragment();
        const authorCardTemplate = document.querySelector('.author-card');

        authors.forEach(author => {
            const card = authorCardTemplate.content.cloneNode(true);
            const authorSpan = card.querySelector('.author');
            authorSpan.textContent = author.author_name;

            const link = card.querySelector('.link');
            link.addEventListener('click', async (e) => {
                e.preventDefault();
                await showBooksModal(author.author_id, author.author_name);
            });

            fragment.appendChild(card);
        });

        document.getElementById('author-display-section').appendChild(fragment);
    } catch (error) {
        document.getElementById('author-display-section').innerHTML =
            '<p class="error-message">Failed to load authors. Please try again later.</p>';
        // eslint-disable-next-line no-console
        console.error('Error fetching authors:', error.message);
    }
};

async function showBooksModal(authorId, authorName) {
    const modal = document.getElementById('author-books-display-modal');
    const modalTitle = document.getElementById('modal-title');
    const booksList = document.getElementById('modal-books-list');
    const closeBtn = document.getElementById('close-modal-btn');

    modalTitle.textContent = `Books by ${authorName}`;
    booksList.innerHTML = '<p>Loading...</p>';
    modal.style.display = 'block';

    try {
        const booksResponse = await fetch(`${BASE_URL}/books?a=${authorId}`);
        const books = await booksResponse.json();
        const bookCardTemplate = document.querySelector('.book-card');

        booksList.innerHTML = '';
        if (Array.isArray(books) && books.length > 0) {
            const detailedBooks = await Promise.all(
                books.map(book =>
                    fetch(`${BASE_URL}/books/${book.book_id}`)
                        .then(res => res.ok ? res.json() : null)
                        .catch(() => null)
                )
            );

            detailedBooks.forEach(fetchedBookData => {
                if (!fetchedBookData) return;
                const card = bookCardTemplate.content.cloneNode(true);
                const bookInfo = card.querySelector('.book-info');

                card.querySelector('h2').textContent = fetchedBookData.title;
                card.querySelector('.author').textContent = authorName;
                card.querySelector('.year').textContent = fetchedBookData.publishing_year || '';
                card.querySelector('.publisher').textContent = fetchedBookData.publishing_company || '';

                // Add cover image
                const coverImg = document.createElement('img');
                coverImg.src = fetchedBookData.cover || 'images/logo.svg';
                coverImg.alt = fetchedBookData.title;
                coverImg.className = 'book-cover';
                bookInfo.insertBefore(coverImg, bookInfo.firstChild);

                booksList.appendChild(card);
            });
        } else {
            booksList.innerHTML = '<p>No books found for this author.</p>';
        }
    // eslint-disable-next-line no-unused-vars
    } catch (er) {
        booksList.innerHTML = '<p class="error-message">Failed to load books.</p>';
    }

    closeBtn.onclick = () => {
        modal.style.display = 'none';
    };
}

showAllAuthors();