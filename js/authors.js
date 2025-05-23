import { BASE_URL } from './info.js';

const showAllAuthors = async () => {
    try {
        const response = await fetch(`${BASE_URL}/authors`);
        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        allAuthors = data.authors || data.results || data;

        
        allAuthors.sort((a, b) => a.author_name.localeCompare(b.author_name));

        
        const authorsByLetter = {};
        allAuthors.forEach(author => {
            const firstLetter = author.author_name.charAt(0).toUpperCase();
            if (!authorsByLetter[firstLetter]) {
                authorsByLetter[firstLetter] = [];
            }
            authorsByLetter[firstLetter].push(author);
        });

        const fragment = document.createDocumentFragment();
        const authorCardTemplate = document.querySelector('.author-card');

        
        Object.keys(authorsByLetter).sort().forEach(letter => {
           
            const letterSection = document.createElement('div');
            letterSection.className = 'letter-section';
            
            const letterHeading = document.createElement('h3');
            letterHeading.className = 'letter-heading';
            letterHeading.textContent = letter;
            letterSection.appendChild(letterHeading);

            
            const authorGrid = document.createElement('div');
            authorGrid.className = 'author-grid';

            
            authorsByLetter[letter].forEach(author => {
                const card = authorCardTemplate.content.cloneNode(true);
                const authorSpan = card.querySelector('.author');
                authorSpan.textContent = author.author_name;

                const link = card.querySelector('.link');
                link.title = author.author_name; // Tooltip ved hover
                link.setAttribute('aria-label', author.author_name); // For skærmlæsere
                link.addEventListener('click', async (e) => {
                    e.preventDefault();
                    await showBooksModal(author.author_id, author.author_name);
                });


                authorGrid.appendChild(card);
            });

            letterSection.appendChild(authorGrid);
            fragment.appendChild(letterSection);
        });

        document.getElementById('author-display-section').appendChild(fragment);
    } catch (error) {
        document.getElementById('author-display-section').innerHTML =
            '<p class="error-message">Failed to load authors. Please try again later.</p>';
        console.error('Error fetching authors:', error.message);
    }
};

let allAuthors = [];

const searchInput = document.querySelector('.search-input');
const searchResults = document.querySelector('.search-results');

searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    
    if (searchTerm.length < 1) {
        searchResults.innerHTML = '';
        searchResults.classList.remove('active');
        return;
    }

    const filteredAuthors = allAuthors.filter(author => 
        author.author_name.toLowerCase().includes(searchTerm)
    );

    displaySearchResults(filteredAuthors);
});

function displaySearchResults(authors) {
    searchResults.innerHTML = '';
    
    if (authors.length === 0) {
        searchResults.innerHTML = '<div class="search-result-item">No authors found</div>';
        searchResults.classList.add('active');
        return;
    }

    authors.forEach(author => {
        const div = document.createElement('div');
        div.className = 'search-result-item';
        div.textContent = author.author_name;
        div.addEventListener('click', () => {
            showBooksModal(author.author_id, author.author_name);
            searchInput.value = author.author_name;
            searchResults.classList.remove('active');
        });
        searchResults.appendChild(div);
    });

    searchResults.classList.add('active');
}

async function showBooksModal(authorId, authorName) {
    const modal = document.getElementById('author-books-display-modal');
    const modalTitle = document.getElementById('modal-title');
    const booksList = document.getElementById('modal-books-list');
    const closeBtn = document.getElementById('close-modal-btn');

    // Show loading state immediately
    modal.style.display = 'block';
    modalTitle.textContent = `Loading books by ${authorName}...`;
    closeBtn.focus(); // Sørg for at luk-knappen får fokus

    document.addEventListener('keydown', escKeyHandler);

    function escKeyHandler(event) {
    if (event.key === 'Escape') {
        modal.style.display = 'none';
        document.removeEventListener('keydown', escKeyHandler);
    }
    }
    
    booksList.innerHTML = `
        <div class="loading-state">
            <p>Loading books...</p>
            <div class="loading-spinner"></div>
        </div>
    `;

    try {
        // Fetch books and template in parallel
        const [booksResponse, bookCardTemplate] = await Promise.all([
            fetch(`${BASE_URL}/books?a=${authorId}`),
            document.querySelector('.book-card')
        ]);

        const books = await booksResponse.json();

        modalTitle.textContent = `Books by ${authorName}`;
        booksList.innerHTML = '';
        
        if (Array.isArray(books) && books.length > 0) {
            // Keep loading state while fetching detailed books
            booksList.innerHTML = `
                <div class="loading-state">
                    <p>Loading book details...</p>
                    <div class="loading-spinner"></div>
                </div>
            `;

            const detailedBooks = await Promise.all(
                books.map(book =>
                    fetch(`${BASE_URL}/books/${book.book_id}`)
                        .then(res => res.ok ? res.json() : null)
                        .catch(() => null)
                )
            );

            // Clear loading state before adding books
            booksList.innerHTML = '';

            detailedBooks.forEach(fetchedBookData => {
                if (!fetchedBookData) return;
                const card = bookCardTemplate.content.cloneNode(true);
                const bookInfo = card.querySelector('.book-info');

                card.querySelector('h2').textContent = fetchedBookData.title;
                card.querySelector('.author').textContent = authorName;
                card.querySelector('.year').textContent = fetchedBookData.publishing_year || '';
                card.querySelector('.publisher').textContent = fetchedBookData.publishing_company || '';

                
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
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };

    closeBtn.onclick = () => {
        modal.style.display = 'none';
    };
}

showAllAuthors();