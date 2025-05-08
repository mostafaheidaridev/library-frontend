// Function to get authentication headers for API requests
export function getAuthHeaders() {
    const headers = new Headers();
    const token = sessionStorage.getItem('user_token');
    
    if (token) {
        headers.append('X-Session-Token', token);
    }
    
    return headers;
}