    import axios from 'axios';

    const refreshToken = async () => {
        let jwtToken = localStorage.getItem('jwtToken');
        let refreshToken = localStorage.getItem('refreshToken');
        console.log("Refresh Token: ", refreshToken);

        try {
            const response = await axios.post('https://localhost:7224/api/Account/RefreshToken', refreshToken, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                console.log("JWT Token new: ",response.data );
                jwtToken = response.data; // Assuming the new token is returned directly
                localStorage.setItem('jwtToken', jwtToken);
                console.log("JWT Token is refreshed");
                return true; // Token refreshed successfully
            }
        } catch (error) {
            console.error('Error refreshing token:', error.message);
            console.error('Error response:', error.response);
        }

        console.log("Refresh and JWT not working");
        return false; // Token could not be refreshed or is invalid
    };

    const makeAuthorizedRequest = async () => {
        const jwtToken = localStorage.getItem('jwtToken');
        console.log("JWT Token: ", localStorage.getItem('jwtToken'));

        try {
            const response = await axios.get('https://localhost:7224/api/Account/test', {
                headers: {
                    Authorization: `Bearer ${jwtToken}`
                }
            });

            if (response.status === 200) {
                console.log("JWT is working");
                return true; // Token is valid
            }
        } catch (error) {
            console.error('Error in authorized request:', error.message);
            console.error('Error response:', error.response);

            if (error.response.status === 401) {
                console.log("Trying to refresh token");
                const tokenRefreshed = await refreshToken();

                if (tokenRefreshed) {

                    console.log("Refreshed token success");
                    const retryResponse = await axios.get('https://localhost:7224/api/Account/test', {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
                        }
                    });

                    if (retryResponse.status === 200) {
                        console.log("Refreshed token is working");
                        return true;
                    }
                }
            }
        }

        console.log("Not working");
        return false;
    };

    export default makeAuthorizedRequest;
