import { BASE_URL } from './info.js';
import { getAuthHeaders } from './auth.js';

export async function addNewAuthorAdmin() {
    const authorSection = document.getElementById('author-section');
    const template = document.getElementById('Add-new-author-template');

    if (!authorSection || !template) {
        console.error('Required elements not found');
        return;
    }

    const fragment = document.createDocumentFragment();
    const authorNode = template.content.cloneNode(true);
    
    const form = authorNode.querySelector('#author-form');
    const messageContainer = authorNode.querySelector('#author-added-message');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        messageContainer.innerHTML = '';

        const formData = new FormData(form);
        const firstName = formData.get('first_name')?.trim();
        const lastName = formData.get('last_name')?.trim();
        
        const data = new URLSearchParams();
        data.append('first_name', firstName);
        data.append('last_name', lastName);

        if (!firstName || !lastName) {
            messageContainer.innerHTML = '<p class="error-message">First name and last name are required</p>';
            return;
        }

        try {
            const headers = getAuthHeaders();
            
            const response = await fetch(`${BASE_URL}/admin/2679/authors`, {
                method: 'POST',
                headers,
                body: data
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to add author');
            }

            messageContainer.innerHTML = `<p class="success-message">Author "${firstName} ${lastName}" added successfully!</p>`;
            form.reset();

        } catch (error) {
            messageContainer.innerHTML = `<p class="error-message">${error.message}</p>`;
            console.error('Error adding author:', error);
        }
    });

    fragment.appendChild(authorNode);
    authorSection.appendChild(fragment);
}

addNewAuthorAdmin();