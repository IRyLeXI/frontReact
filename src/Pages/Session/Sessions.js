import {useEffect, useState} from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import refreshToken from "../../Helpers/refreshToken";

const Sessions=()=>
{
    const [sessions, setSessions] = useState();
    useEffect( () => {


        const fetchData=async () => {
            let decoded = jwtDecode(localStorage.getItem("jwtToken"));
            let jwtToken = localStorage.getItem("jwtToken")
            console.log("our User id " +decoded.Id)
            const authorized = await refreshToken();


            if (authorized) {
                const response = await axios.get(`https://localhost:7224/api/Sessions/Psychologist/${decoded.Id}`, {
                        headers: {
                            Authorization: `Bearer ${jwtToken}`
                        }
                    }
                )
                if (response.status === 200) {
                    console.log(response.data)
                    setSessions(response.data);
                }
            }
        }
        const result = refreshToken();
        fetchData();


    },[])


    return(
        <div>

        </div>
    );
}
export default Sessions;