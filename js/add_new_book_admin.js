import { BASE_URL } from './info.js';
import { getAuthHeaders } from './auth.js';

function initializeSearchableSelect(inputElement, items) {
    const searchInput = inputElement;
    const hiddenInput = searchInput.parentElement.querySelector('input[type="hidden"]');
    const resultsDiv = searchInput.parentElement.querySelector('.search-results');
    
    // Store original options
    const allOptions = [...items];
    
    const toggleAddNewButton = (isAuthorField, enabled) => {
        const elementId = isAuthorField ? 'toggle-new-author' : 'toggle-new-publisher';
        const fieldsId = isAuthorField ? 'new-author-fields' : 'new-publisher-fields';
        
        const toggleButton = document.getElementById(elementId);
        const newFields = document.getElementById(fieldsId);
            
        if (toggleButton && newFields) {
            toggleButton.disabled = !enabled;
            toggleButton.style.opacity = enabled ? '1' : '0.5';
            toggleButton.title = enabled ? '' : 
                `Cannot add new ${isAuthorField ? 'author' : 'publisher'} when existing one is selected`;
            
            if (!enabled) {
                newFields.classList.add('hidden');
            }
        }
    };
    
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const isAuthorField = searchInput.name === 'author_search';
        
    
        if (searchTerm === '') {
            hiddenInput.value = '';
            toggleAddNewButton(isAuthorField, true);
        }
        
        const filteredOptions = allOptions.filter(item => 
            item.text.toLowerCase().includes(searchTerm)
        );
        
        // Clear and populate results
        resultsDiv.innerHTML = '';
        filteredOptions.forEach(option => {
            const div = document.createElement('div');
            div.className = 'search-result-item';
            div.textContent = option.text;
            div.addEventListener('click', () => {
                searchInput.value = option.text;
                hiddenInput.value = option.value;
                resultsDiv.classList.remove('active');
                // Disable "Add New" button when item is selected
                toggleAddNewButton(isAuthorField, false);
            });
            resultsDiv.appendChild(div);
        });
        
        resultsDiv.classList.add('active');
    });

    
    searchInput.addEventListener('focus', () => {
        if (allOptions.length > 0) {
            resultsDiv.classList.add('active');
        }
    });

    
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !resultsDiv.contains(e.target)) {
            resultsDiv.classList.remove('active');
        }
    });
}

export async function addNewBookAdmin() {
    const bookSection = document.getElementById('book-section');
    const template = document.getElementById('Add-new-book-template');

    if (!bookSection || !template) {
        console.error('Required elements not found');
        return;
    }

    const fragment = document.createDocumentFragment();
    const bookNode = template.content.cloneNode(true);
    
    const form = bookNode.querySelector('#book-form');
    const newAuthorFields = form.querySelector('#new-author-fields');
    const newPublisherFields = form.querySelector('#new-publisher-fields');
    const yearInput = form.querySelector('input[name="publishing_year"]');
    const messageContainer = bookNode.querySelector('#book-added-message');

    
    const currentYear = new Date().getFullYear();
    yearInput.max = currentYear;
    yearInput.value = currentYear;

    await loadAuthors();
    await loadPublishers();

    form.querySelector('#toggle-new-author').addEventListener('click', () => {
        newAuthorFields.classList.toggle('hidden');
        form.querySelector('input[name="author_id"]').required = 
            newAuthorFields.classList.contains('hidden');
    });

    form.querySelector('#toggle-new-publisher').addEventListener('click', () => {
        newPublisherFields.classList.toggle('hidden');
        form.querySelector('input[name="publisher_id"]').required = 
            newPublisherFields.classList.contains('hidden');
    });

    async function loadAuthors() {
        try {
            const response = await fetch(`${BASE_URL}/authors`);
            const authors = await response.json();
            
            const authorInput = form.querySelector('input[name="author_search"]');
            const authorOptions = authors.map(author => ({
                text: author.author_name,
                value: author.author_id
            }));
            
            initializeSearchableSelect(authorInput, authorOptions);
        } catch (error) {
            console.error('Error loading authors:', error);
        }
    }

    async function loadPublishers() {
        try {
            const response = await fetch(`${BASE_URL}/publishers`);
            const publishers = await response.json();
            
            const publisherInput = form.querySelector('input[name="publisher_search"]');
            const publisherOptions = publishers.map(publisher => ({
                text: publisher.publisher_name,
                value: publisher.publisher_id
            }));
            
            initializeSearchableSelect(publisherInput, publisherOptions);
        } catch (error) {
            console.error('Error loading publishers:', error);
        }
    }

    async function addNewAuthor(firstName, lastName) {
        const data = new URLSearchParams();
        data.append('first_name', firstName);
        data.append('last_name', lastName);

        const response = await fetch(`${BASE_URL}/admin/2679/authors`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: data
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.error);
        return result.author_id;
    }

    async function addNewPublisher(name) {
        const data = new URLSearchParams();
        data.append('name', name);

        const response = await fetch(`${BASE_URL}/admin/2679/publishers`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: data
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.error);
        return result.publisher_id;
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        messageContainer.innerHTML = '';

        try {
            let authorId = form.author_id.value;
            let publisherId = form.publisher_id.value;


            if (!newAuthorFields.classList.contains('hidden')) {
                const firstName = form.author_first_name.value.trim();
                const lastName = form.author_last_name.value.trim();
                if (firstName && lastName) {
                    authorId = await addNewAuthor(firstName, lastName);
                }
            }


            if (!newPublisherFields.classList.contains('hidden')) {
                const publisherName = form.publisher_name.value.trim();
                if (publisherName) {
                    publisherId = await addNewPublisher(publisherName);
                }
            }

            const bookData = new URLSearchParams();
            bookData.append('title', form.title.value.trim());
            bookData.append('author_id', authorId);
            bookData.append('publisher_id', publisherId);
            bookData.append('publishing_year', form.publishing_year.value);

            const response = await fetch(`${BASE_URL}/admin/2679/books`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: bookData
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to add book');
            }
            console.log(`New book added with ID: ${result.book_id}`);
            messageContainer.innerHTML = `<p class="success-message">Book "${form.title.value}" added successfully!</p>`;
            form.reset();
            yearInput.value = currentYear;

        } catch (error) {
            messageContainer.innerHTML = `<p class="error-message">${error.message}: Make sure you have filled out the form correctly!</p>`;
            console.error('Error adding book:', error);
        }
    });

    fragment.appendChild(bookNode);
    bookSection.appendChild(fragment);
}

addNewBookAdmin();