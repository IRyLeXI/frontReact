import axios from "axios";

const refreshToken = async () => {
    let jwtToken = localStorage.getItem('jwtToken');
    let refreshToken = localStorage.getItem('refreshToken');

    try {
        const response = await axios.post('https://localhost:7224/api/Account/RefreshToken', {
            refreshToken: refreshToken
        });

        if (response.status === 200) {
            jwtToken = response.data.jwtToken; // Assuming the new token is returned directly
            localStorage.setItem('jwtToken', jwtToken);
            return true; // Token refreshed successfully
        }
    } catch (error) {
        console.error('Error refreshing token:', error.message);
    }

    // If the token could not be refreshed or the refresh token is invalid
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('refreshToken');
    return false; // Token could not be refreshed or is invalid
};



const makeAuthorizedRequest = async () => {
    const jwtToken = localStorage.getItem('jwtToken');

    try {
        // Try using the token for the initial request
        const response = await axios.get('https://localhost:7224/api/Account/test', {
            headers: {
                Authorization: `Bearer ${jwtToken}`
            }
        });

        if (response.status === 200) {
            return true; // Token is valid
        }
    } catch (error) {
        if (error.response.status === 401) {
            const tokenRefreshed = await refreshToken();

            if (tokenRefreshed) {
                const retryResponse = await axios.get('https://localhost:7224/api/Account/test', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
                    }
                });

                if (retryResponse.status === 200) {
                    return true;
                }
            }
        }
    }

    return false;
};

export default makeAuthorizedRequest;