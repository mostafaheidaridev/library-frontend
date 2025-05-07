import { BASE_URL } from './info.js';

const form = document.getElementById('search-form');
const input = document.getElementById('search-input');
const resultsContainer = document.getElementById('books-display-section');
const bookCardTemplate = document.querySelector('.book-card').content;

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const query = input.value.trim();

  if (query.length < 2) return;

  try {
    const res = await fetch(`${BASE_URL}/books?s=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error('Search failed');

    const books = await res.json();

    // ryd tidligere resultater
    resultsContainer.innerHTML = '';

    const fragment = document.createDocumentFragment();

    for (const book of books) {
      const bookDetailRes = await fetch(`${BASE_URL}/books/${book.book_id}`);
      if (!bookDetailRes.ok) continue;
      const fullBook = await bookDetailRes.json();

      const card = bookCardTemplate.cloneNode(true);
      const bookInfo = card.querySelector('.book-info');

      card.querySelector('h2').textContent = fullBook.title;
      card.querySelector('.author').textContent = fullBook.author;
      card.querySelector('.year').textContent = fullBook.publishing_year;
      card.querySelector('.publisher').textContent = fullBook.publishing_company;

      const coverImg = document.createElement('img');
      coverImg.src = fullBook.cover || 'images/logo.svg';
      coverImg.alt = fullBook.title;
      coverImg.className = 'book-cover';
      bookInfo.insertBefore(coverImg, bookInfo.firstChild);

      fragment.appendChild(card);
    }

    if (fragment.children.length === 0) {
      resultsContainer.innerHTML = '<p>No books found.</p>';
    } else {
      resultsContainer.appendChild(fragment);
    }

  } catch (err) {
    console.error(err);
    resultsContainer.innerHTML = '<p>Something went wrong. Try again later.</p>';
  }
});
