async function apiGet(url, headers) {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: headers,
        });

        if (!response.ok) {
            throw new Error('API GET request failed');
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        throw new Error('API GET request failed');
    }
}

async function apiPost(url, headers, body) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error('API POST request failed');
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        throw new Error('API POST request failed');
    }
}


async function apiDelete(url, headers) {
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: headers,
        });

        if (!response.ok) {
            throw new Error('API DELETE request failed');
        }

        // No response body for a successful DELETE request with 204 status
        return null;
    } catch (error) {
        console.error(error);
        throw new Error('API DELETE request failed');
    }
}