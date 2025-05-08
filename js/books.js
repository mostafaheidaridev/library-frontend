import { BASE_URL } from "./info.js";

const showRandomBooks = async () => {
  const NUMBER_OF_BOOKS = 6;

  try {
    const response = await fetch(`${BASE_URL}/books?n=${NUMBER_OF_BOOKS}`);
    if (!response.ok) throw new Error('Network response was not ok');
    
    const data = await response.json();
    const books = data.books || data.results || data;

    const detailedBooks = await Promise.all(
      books.map(book =>
        fetch(`${BASE_URL}/books/${book.book_id}`)
          .then(res => res.ok ? res.json() : null)
          .then(fetchedBookData => fetchedBookData ? { ...fetchedBookData, book_id: book.book_id } : null)
          .catch(() => null)
      )
    );

    const fragment = document.createDocumentFragment();
    const bookCardTemplate = document.querySelector('.book-card').content;

    detailedBooks.forEach(fetchedBookData => {
      if (!fetchedBookData) return;

      const card = bookCardTemplate.cloneNode(true);
      const bookInfo = card.querySelector('.book-info');

      card.querySelector('h2').textContent = fetchedBookData.title;
      card.querySelector('.author').textContent = fetchedBookData.author;
      card.querySelector('.year').textContent = fetchedBookData.publishing_year;
      card.querySelector('.publisher').textContent = fetchedBookData.publishing_company;

      const coverImg = document.createElement('img');
      coverImg.src = fetchedBookData.cover || 'images/logo.svg';
      coverImg.alt = fetchedBookData.title;
      coverImg.className = 'book-cover';
      bookInfo.insertBefore(coverImg, bookInfo.firstChild);

      // navigate to single book view
      const singleLink = card.querySelector('#single_view_link');
      singleLink.href = `book.html?id=${fetchedBookData.book_id}`;

      fragment.appendChild(card);
    });

    document.getElementById('books-display-section').appendChild(fragment);
  } catch (error) {
    console.error('Error fetching books:', error.message);
    document.getElementById('books-display-section').innerHTML = 
      '<p class="error-message">Failed to load books. Please try again later.</p>';
  }
};

showRandomBooks();

