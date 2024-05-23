    import axios from 'axios';

   

    const makeAuthorizedRequest = async () => {
        const jwtToken = localStorage.getItem('jwtToken');
        console.log("JWT Token: ", localStorage.getItem('jwtToken'));

        try {
            const response = await axios.get('https://localhost:7068/test', {
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
            
        }

        console.log("Not working");
        return false;
    };

    export default makeAuthorizedRequest;
