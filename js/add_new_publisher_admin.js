import { BASE_URL } from './info.js';
import { getAuthHeaders } from './auth.js';

export async function addNewPublisherAdmin() {
    const publisherSection = document.getElementById('publisher-section');
    const template = document.getElementById('Add-new-publisher-template');

    if (!publisherSection || !template) {
        console.error('Required elements not found');
        return;
    }

    const fragment = document.createDocumentFragment();
    const publisherNode = template.content.cloneNode(true);
    

    const form = publisherNode.getElementById('publisher-form');
    const messageContainer = publisherNode.getElementById('publisher-added-message');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        messageContainer.innerHTML = '';

        const formData = new FormData(form);
        const data = new URLSearchParams();
        data.append('name', formData.get('publisher_name')?.trim());

        if (!formData.get('publisher_name')) {
            messageContainer.innerHTML = '<p class="error-message">Publisher name is required</p>';
            return;
        }

        try {
            const publisherName = formData.get('publisher_name')?.trim();
            const headers = getAuthHeaders();
            
            const response = await fetch(`${BASE_URL}/admin/2679/publishers`, {
                method: 'POST',
                headers,
                body: data
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to add publisher');
            }

            messageContainer.innerHTML = `<p class="success-message">Publisher "${publisherName}" added successfully!</p>`;
            form.reset();

        } catch (error) {
            messageContainer.innerHTML = `<p class="error-message">${error.message}</p>`;
            console.error('Error adding publisher:', error);
        }
    });

    fragment.appendChild(publisherNode);
    publisherSection.appendChild(fragment);
}

addNewPublisherAdmin();