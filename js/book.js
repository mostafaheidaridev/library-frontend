import { BASE_URL } from "./info.js";
import { getAuthHeaders } from "./auth.js";

const showSingleBook = async () => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('id');

    if (!bookId) {
      throw new Error('No book ID provided');
    }

    const response = await fetch(`${BASE_URL}/books/${bookId}`);
    if (!response.ok) throw new Error('Network response was not ok');
    
    const fetchedBookData = await response.json();
    
    const bookContainer = document.getElementById('book-details');
    const bookTemplate = document.getElementById('book-detail-template').content;
    const bookElement = bookTemplate.cloneNode(true);

    document.title = `${fetchedBookData.title} | Library Frontend`;
    
    bookElement.querySelector('.book-cover-large').src = fetchedBookData.cover || 'images/logo.svg';
    bookElement.querySelector('.book-cover-large').alt = fetchedBookData.title;
    bookElement.querySelector('.book-title').textContent = fetchedBookData.title;
    bookElement.querySelector('.book-author').textContent = fetchedBookData.author;
    bookElement.querySelector('.book-year').textContent = fetchedBookData.publishing_year;
    bookElement.querySelector('.book-publisher').textContent = fetchedBookData.publishing_company;
    
    // Handle loan functionality - only show for logged-in users
    const isLoggedIn = sessionStorage.getItem('user_id') && sessionStorage.getItem('user_token');
    const loanSection = bookElement.querySelector('#loan-section');
    
    if (isLoggedIn) {
      loanSection.classList.remove('hidden');
      const loanButton = bookElement.querySelector('#loan-button');
      const loanMessage = bookElement.querySelector('#loan-message');
      
      loanButton.addEventListener('click', async () => {
try {
  loanButton.disabled = true;
  loanButton.textContent = 'Processing...';
  
  const headers = getAuthHeaders();
  const userId = sessionStorage.getItem('user_id');
  
  const loanResponse = await fetch(`${BASE_URL}/users/${userId}/books/${bookId}`, {
    method: 'POST',
    headers
  });
  
  const result = await loanResponse.json();
  
  if (loanResponse.ok) {
    loanMessage.textContent = 'Success! An access link to this e-book will be sent to your email address.';
    loanMessage.className = 'loan-message success';
    loanButton.style.display = 'none';
  } else {
    const errorMsg = result.error === "This user has still this book on loan" ?
      'You already have a loan for this book.' : 
      result.error || 'An error occurred while processing your loan.';
    
    loanMessage.textContent = errorMsg;
    loanMessage.className = 'loan-message error';
    loanButton.style.display = 'none';
    loanButton.textContent = 'Loan This Book';
  }
} catch (error) {
          loanMessage.textContent = 'An error occurred while processing your loan.';
          loanMessage.className = 'loan-message error';
          loanButton.disabled = true;
          loanButton.textContent = 'Loan This Book';
          console.error('Error creating loan:', error);
        }
      });
    }
    
    bookContainer.innerHTML = '';
    bookContainer.appendChild(bookElement);
    
} catch (error) {
    console.error('Error fetching book details:', error.message);
    
    bookContainer.innerHTML = `
      <div class="error-message" role="alert">
        <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12" y2="16"></line>
        </svg>
        <p>${error.message === 'No book ID provided' ? 
          'No book was selected. Please choose a book from the list.' : 
          'Failed to load book details. The server might be unavailable.'}</p>
        <a href="books.html" aria-label="Return to book list">Return to books list</a>
      </div>
    `;
  }
};

showSingleBook();
