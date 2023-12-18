import {useEffect, useState} from "react";
import refreshToken from "../../../Helpers/refreshToken";
import axios from "axios";
import {jwtDecode} from "jwt-decode";

const Requests = ()=>
{
    const [isAuthorized, setIsAuthorized] = useState(false);
    let decoded = jwtDecode(localStorage.getItem("jwtToken"))
    let userid= decoded.Id;
    useEffect(() => {
        const fetchData = async () => {
            try {
                const authorized = await refreshToken();
                setIsAuthorized(authorized);

                if (authorized) {
                    const response = await axios.get(`https://localhost:7224/api/Friends/Recieved/${userid}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
                        }
                    });
                    if (response.status === 200) {
                      console.log(response);
                    }
                }
            } catch (error) {
                console.error('Error during data fetching:', error);
            }
        };

        fetchData();
    }, []);
    return(
<div></div>
    )
}

export  default  Requests
