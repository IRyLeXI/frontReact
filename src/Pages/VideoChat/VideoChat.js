import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import PhoneIcon from '@mui/icons-material/Phone';
import { CopyToClipboard } from "react-copy-to-clipboard";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import React, { useEffect, useRef, useState } from "react"

import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
import Peer from "simple-peer"

import "./Video.css"
import { jwtDecode } from "jwt-decode"
import refreshToken from "../../Helpers/refreshToken";
import axios from "axios";
import UserSideBar from "../UserPage/UserSideBar";
import SideBar from "../MainPage/SideBar";
import {useNavigate} from "react-router-dom";

function VideoChat() {
    const [me, setMe] = useState("")
    const navigate = useNavigate();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [stream, setStream] = useState()
    const [receivingCall, setReceivingCall] = useState(false)
    const [caller, setCaller] = useState("")
    const [callerSignal, setCallerSignal] = useState()
    const [callAccepted, setCallAccepted] = useState(false)
    const [idToCall, setIdToCall] = useState("")
    const [callEnded, setCallEnded] = useState(false)
    const [isMuted, setIsMuted] = useState(false);
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [name, setName] = useState("")
    const myVideo = useRef()
    const userVideo = useRef()
    const connectionRef = useRef(new Peer())
    const [connection, setConnection] = useState()
    const [username, setUsername] = useState('')



    useEffect(() => {

        const checkAuthorization = async () => {
            try {
                if (localStorage.getItem("jwtToken") != null) {
                   let response =await refreshToken();
                    setIsAuthorized(response)
                   if(!response) {
                       navigate("/main");
                   }
                }

            } catch (ex) {
                console.error('Error during authorization check:', ex);
            }
        };
        checkAuthorization();
        const fetchData = async () => {

            const hubConnection = new HubConnectionBuilder()
                .withUrl("http://ec2-51-20-249-147.eu-north-1.compute.amazonaws.com:7224/api/videochat")
                .configureLogging(LogLevel.Information)
                .build();


            hubConnection.on("me", (id) => {
                console.log(id)
                setMe(id)
            })

            hubConnection.on("callEnded", () => {
                leaveCall()
            })

            hubConnection.on("callUser", (data) => {
                console.log(data)
                setReceivingCall(true)
                setCaller(data.from)
                setName(data.name)
                setCallerSignal(data.signal)
            })
            await hubConnection.start()
            hubConnection.invoke("OnStart")
            setConnection(hubConnection);

            let decoded = jwtDecode(localStorage.getItem("jwtToken"));
            setUsername(decoded.unique_name)

        }

        const GetWithoutVideo = () => {
            setIsCameraOn(false);
            navigator.mediaDevices.getUserMedia({ video: false, audio: true }).then((stream) => {
                setStream(stream)
                myVideo.current.srcObject = stream
            }).catch(e => console.log(e));
        }

        fetchData();

        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            setStream(stream)
            myVideo.current.srcObject = stream
        }).catch(e => GetWithoutVideo());

    }, [])

    const callUser = (id) => {
        try {
            const peer = new Peer({
                initiator: true,
                trickle: false,
                stream: stream
            })
            peer.on("signal", (data) => {
                connection.invoke("CallUser", {
                    userToCall: id,
                    signalData: data,
                    from: me,
                    name: username
                })
            })
            peer.on("stream", (stream) => {

                userVideo.current.srcObject = stream

            })
            connection.on("callAccepted", (signal) => {
                setCallAccepted(true)
                peer.signal(signal)
            })

            connectionRef.current = peer
        }
        catch (e) {
            window.location.reload();
        }
    }

    const answerCall = () => {
        try {
            setCallAccepted(true)
            const peer = new Peer({
                initiator: false,
                trickle: false,
                stream: stream
            })
            peer.on("signal", (data) => {
                connection.invoke("answerCall", { signal: data, to: caller })
            })
            peer.on("stream", (stream) => {
                userVideo.current.srcObject = stream
            })

            peer.signal(callerSignal)
            connectionRef.current = peer
        }
        catch (e) {
            window.location.reload();
        }
    }

    const handleLeave = async () => {
        if (connection) {
            console.log(idToCall)
            if (idToCall) {
                connection.invoke("EndCall", idToCall)
            }
            else {
                connection.invoke("EndCall", caller)
            }
            connection.invoke("EndCall", me);
        }
    }

    const leaveCall = () => {
        try {
            console.log("leaving");
            window.location.reload();
        }
        catch (e) {
            console.log(e);
        }

    }

    const handleToggleMute = () => {
        if (stream) {
            const audioTracks = stream.getAudioTracks();
            audioTracks.forEach((track) => {
                track.enabled = !track.enabled;
            });
            setIsMuted(!isMuted);
        }
    };
    const theme = createTheme({
        // Define your theme here (optional)
        // For example:
        palette: {
            mode: 'light',
          primary: {

            main: '#1e88e5',
          },
          secondary: {
            main: '#ff1744',
          },
        },
    });

    const handleToggleCamera = () => {
        if (stream) {
            const videoTracks = stream.getVideoTracks();
            videoTracks.forEach((track) => {
                track.enabled = !track.enabled;
            });
            setIsCameraOn(!isCameraOn);
        }
    };

    return (
        <div>
            {isAuthorized ? (
                <ThemeProvider theme={theme}>
                    <div className="full-page">
                        <h1 style={{ textAlign: "center", color: '#fff' }}></h1>
                        <div className="container-video-page">
                            <div className="video-container">
                                <div className="video">
                                    {stream && <video playsInline muted ref={myVideo} autoPlay style={{ width: "500px" }} />}
                                </div>
                                <div className="video">
                                    {callAccepted && !callEnded ?
                                        <video playsInline ref={userVideo} autoPlay style={{ width: "500px" }} /> :
                                        null}
                                </div>
                            </div>
                            <div className="myId">
                                <h3 className="call-username">
                                    {username}
                                </h3>
                                <CopyToClipboard text={me} style={{ marginBottom: "2rem" }}>
                                    <Button variant="contained" color="primary" startIcon={<AssignmentIcon fontSize="large" />}>
                                        Copy ID
                                    </Button>
                                </CopyToClipboard>

                                <TextField
                                    id="filled-basic"
                                    label="ID to call"
                                    variant="filled"
                                    value={idToCall}
                                    onChange={(e) => setIdToCall(e.target.value)}
                                />
                                <div className="call-button">
                                    {callAccepted && !callEnded ? (
                                        <div>
                                            <Button variant="contained" color="primary" onClick={handleLeave}>
                                                End Call
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color={isMuted ? "secondary" : "primary"}
                                                onClick={handleToggleMute}
                                            >
                                                {isMuted ? "Unmute Mic" : "Mute Mic"}
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color={isCameraOn ? "secondary" : "primary"}
                                                onClick={handleToggleCamera}
                                            >
                                                {isCameraOn ? "Turn Off Camera" : "Turn On Camera"}
                                            </Button>
                                        </div>
                                    ) : (
                                        <div>
                                            <IconButton color="primary" aria-label="call" onClick={() => callUser(idToCall)}>
                                                <PhoneIcon fontSize="large" />
                                            </IconButton>
                                            {idToCall}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    {receivingCall && !callAccepted ? (
                                        <div className="caller">
                                            <h1 >{name} is calling...</h1>
                                            <Button variant="contained" color="primary" onClick={answerCall}>
                                                Answer
                                            </Button>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </div>
                </ThemeProvider>
            ) : (
                <div>not authorized</div>
            )}
        </div>
    );


}

export default VideoChat













