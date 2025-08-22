import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { ArrowLeft, Loader2, Circle, Phone, Video, PhoneOff, Send, Paperclip } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const serverUrl = 'https://freelance-client-3029.onrender.com';

export default function ChatComponent({ currentUserEmail, targetUserEmail }) {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [file, setFile] = useState(null);
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [callStatus, setCallStatus] = useState('idle'); // idle, calling, receiving-call, in-call
    const [isCallRequested, setIsCallRequested] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSocketConnected, setIsSocketConnected] = useState(false);
    const [targetUserIsOnline, setTargetUserIsOnline] = useState(false);
    const [targetUser, setTargetUser] = useState({ name: targetUserEmail?.split('@')[0] });

    const socketRef = useRef();
    const peerConnectionRef = useRef();
    const localVideoRef = useRef();
    const remoteVideoRef = useRef();
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    const createPeerConnection = () => {
        const pc = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        });

        pc.ontrack = (event) => {
            console.log("Receiving remote stream...");
            setRemoteStream(event.streams[0]);
            setCallStatus('in-call');
        };

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                console.log("Sending ICE candidate:", event.candidate);
                socketRef.current.emit('ice-candidate', {
                    targetUserEmail: targetUserEmail,
                    candidate: event.candidate,
                });
            }
        };

        return pc;
    };

    const endCall = () => {
        if (socketRef.current) {
            socketRef.current.emit('end-call', { targetUserEmail });
        }

        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
        }
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
            setLocalStream(null);
        }
        if (remoteStream) {
            remoteStream.getTracks().forEach(track => track.stop());
            setRemoteStream(null);
        }
        setCallStatus('idle');
        setIsCallRequested(false);
    };

    useEffect(() => {
        if (!currentUserEmail || !targetUserEmail) return;

        socketRef.current = io(serverUrl);

        socketRef.current.on('connect', () => {
            setIsSocketConnected(true);
            socketRef.current.emit('register-user', currentUserEmail);
            socketRef.current.emit('join', currentUserEmail);
            socketRef.current.emit('checkUserStatus', targetUserEmail);
        });

        socketRef.current.on('disconnect', () => {
            setIsSocketConnected(false);
            setTargetUserIsOnline(false);
        });

        socketRef.current.on('userStatus', ({ email, isOnline }) => {
            if (email === targetUserEmail) {
                setTargetUserIsOnline(isOnline);
            }
        });

        socketRef.current.on('receiveMessage', (msg) => {
            setMessages((prevMessages) => [...prevMessages, msg]);
        });

        socketRef.current.on('receiveFileMessage', (fileData) => {
            setMessages((prevMessages) => [...prevMessages, fileData]);
        });
        
        setIsLoading(true);
        axios.get(`${serverUrl}/api/messages/${currentUserEmail}/${targetUserEmail}`)
            .then(res => setMessages(res.data))
            .catch(err => console.error('Message fetch failed:', err))
            .finally(() => setIsLoading(false));

        socketRef.current.on('call-incoming', ({ callerEmail }) => {
            console.log("Incoming call from:", callerEmail);
            setCallStatus('receiving-call');
        });

        socketRef.current.on('call-accepted', async () => {
            console.log("Call accepted, initializing WebRTC connection.");
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setLocalStream(stream);

            peerConnectionRef.current = createPeerConnection();
            stream.getTracks().forEach(track => peerConnectionRef.current.addTrack(track, stream));

            const offer = await peerConnectionRef.current.createOffer();
            await peerConnectionRef.current.setLocalDescription(offer);
            
            socketRef.current.emit('call-user', {
                targetUserEmail: targetUserEmail,
                signal: offer,
                callerEmail: currentUserEmail
            });
        });

        socketRef.current.on('call-declined', () => {
            console.log("Call declined by the other user.");
            setIsCallRequested(false);
            setCallStatus('idle');
            alert("The user declined your call.");
        });

        socketRef.current.on('call-made', async ({ signal, callerEmail }) => {
            console.log("Received a WebRTC offer, preparing to answer.");
            
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setLocalStream(stream);

            peerConnectionRef.current = createPeerConnection();
            stream.getTracks().forEach(track => peerConnectionRef.current.addTrack(track, stream));

            await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(signal));
            
            const answer = await peerConnectionRef.current.createAnswer();
            await peerConnectionRef.current.setLocalDescription(answer);

            socketRef.current.emit('make-answer', {
                signal: answer,
                to: callerEmail
            });
            setCallStatus('in-call');
        });

        socketRef.current.on('answer-made', ({ signal }) => {
            if (peerConnectionRef.current && peerConnectionRef.current.signalingState !== 'stable') {
                console.log("Received a WebRTC answer, setting remote description.");
                peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(signal));
                setCallStatus('in-call');
            }
        });

        socketRef.current.on('ice-candidate', ({ candidate }) => {
            if (peerConnectionRef.current) {
                peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate))
                    .catch(e => console.error("Error adding received ice candidate:", e));
            }
        });

        socketRef.current.on('end-call', () => {
            console.log("Call ended by the other user.");
            endCall();
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
            if (peerConnectionRef.current) {
                peerConnectionRef.current.close();
            }
            if (localStream) {
                localStream.getTracks().forEach(track => track.stop());
            }
        };
    }, [currentUserEmail, targetUserEmail]);

    useEffect(() => {
        if (localVideoRef.current && localStream) localVideoRef.current.srcObject = localStream;
    }, [localStream]);

    useEffect(() => {
        if (remoteVideoRef.current && remoteStream) remoteVideoRef.current.srcObject = remoteStream;
    }, [remoteStream]);

    useEffect(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, [messages]);

    const handleFileChange = (e) => setFile(e.target.files[0]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!isSocketConnected) return;

        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('senderEmail', currentUserEmail);
            formData.append('receiverEmail', targetUserEmail);

            try {
                await axios.post(`${serverUrl}/api/upload`, formData);
                setFile(null);
            } catch (error) { console.error('Error uploading file:', error); }

        } else if (inputValue.trim()) {
            const newMsg = {
                senderEmail: currentUserEmail,
                receiverEmail: targetUserEmail,
                messageText: inputValue.trim(),
                timestamp: new Date(),
                type: 'text',
            };
            socketRef.current.emit('sendMessage', newMsg);
            setInputValue('');
        }
    };
    
    const requestCall = () => {
        if (!targetUserIsOnline) {
            alert("The user is offline and cannot be called.");
            return;
        }
        setIsCallRequested(true);
        setCallStatus('calling');
        socketRef.current.emit('call-request', {
            targetUserEmail: targetUserEmail,
            callerEmail: currentUserEmail
        });
    };
    
    const acceptCall = () => {
        setCallStatus('in-call');
        socketRef.current.emit('call-accepted', {
            targetUserEmail: targetUserEmail,
        });
    };
    
    const declineCall = () => {
        setCallStatus('idle');
        socketRef.current.emit('call-declined', {
            targetUserEmail: targetUserEmail,
        });
    };

    const renderCallActions = () => {
        if (callStatus === 'idle' && !isCallRequested) {
            return (
                <button type="button" onClick={requestCall} className="p-3 bg-green-500 text-white rounded-full transition-transform hover:scale-110 active:scale-95 duration-200 shadow-lg">
                    <Phone size={24} />
                </button>
            );
        }
        
        if (isCallRequested && callStatus === 'calling') {
            return (
                <button type="button" onClick={endCall} className="p-3 bg-red-500 text-white rounded-full animate-pulse transition-transform hover:scale-110 active:scale-95 duration-200 shadow-lg">
                    <PhoneOff size={24} />
                </button>
            );
        }
        
        if (callStatus === 'receiving-call') {
            return (
                <>
                    <button type="button" onClick={acceptCall} className="p-3 bg-green-500 text-white rounded-full transition-transform hover:scale-110 active:scale-95 duration-200 shadow-lg">
                        <Phone size={24} />
                    </button>
                    <button type="button" onClick={declineCall} className="p-3 bg-red-500 text-white rounded-full transition-transform hover:scale-110 active:scale-95 duration-200 shadow-lg">
                        <PhoneOff size={24} />
                    </button>
                </>
            );
        }
        
        if (callStatus === 'in-call') {
            return (
                <button type="button" onClick={endCall} className="p-3 bg-red-500 text-white rounded-full transition-transform hover:scale-110 active:scale-95 duration-200 shadow-lg">
                    <PhoneOff size={24} />
                </button>
            );
        }
        
        return null;
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100 antialiased">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-blue-600 transition-colors duration-200 focus:outline-none">
                        <ArrowLeft size={28} />
                    </button>
                    <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center text-blue-800 font-bold text-xl">
                        {targetUser?.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-lg font-semibold text-gray-900">{targetUser?.name}</h2>
                        <div className="flex items-center gap-1 text-sm">
                            <Circle size={12} className={`transition-colors duration-200 ${targetUserIsOnline ? 'text-green-500 fill-green-500' : 'text-gray-400 fill-gray-400'}`} />
                            <span className="text-gray-500">
                                {targetUserIsOnline ? 'Online' : 'Offline'}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        {renderCallActions()}
                    </div>
                </div>
            </header>
            
            {/* Video Area */}
            {(localStream || remoteStream) && (
                <div className="flex flex-col lg:flex-row justify-center items-center gap-4 p-4 bg-gray-900 transition-all duration-300 transform scale-100 animate-scale-in">
                    <div className="relative w-full lg:w-1/2 rounded-xl overflow-hidden shadow-2xl transition-shadow duration-300 hover:shadow-blue-500/50">
                        <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-auto object-cover transform transition-transform duration-500 rounded-xl" />
                        <div className="absolute bottom-2 left-2 px-3 py-1 bg-black bg-opacity-50 text-white rounded-lg text-xs font-semibold">You</div>
                    </div>
                    <div className="relative w-full lg:w-1/2 rounded-xl overflow-hidden shadow-2xl transition-shadow duration-300 hover:shadow-red-500/50">
                        <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-auto object-cover transform transition-transform duration-500 rounded-xl" />
                        <div className="absolute bottom-2 left-2 px-3 py-1 bg-black bg-opacity-50 text-white rounded-lg text-xs font-semibold">
                            {targetUser?.name}
                        </div>
                    </div>
                </div>
            )}
            
            {/* Chat Messages */}
            <main className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-100 custom-scrollbar">
                {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loader2 size={48} className="animate-spin text-blue-500" />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex justify-center items-center h-full text-gray-500 italic">
                        Start a new conversation.
                    </div>
                ) : (
                    messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex transform animate-fade-in-up ${
                                msg.senderEmail === currentUserEmail ? 'justify-end' : 'justify-start'
                            }`}
                        >
                            <div
                                className={`max-w-xl px-5 py-3 rounded-2xl shadow-md text-base ${
                                    msg.senderEmail === currentUserEmail
                                        ? 'bg-blue-600 text-white rounded-br-none'
                                        : 'bg-white text-gray-900 rounded-bl-none border border-gray-200'
                                }`}
                            >
                                {msg.type === 'file' ? (
                                    msg.mimetype.startsWith('image/') ? (
                                        <img src={`${serverUrl}${msg.fileUrl}`} alt={msg.originalname} className="max-w-full rounded-md" />
                                    ) : (
                                        <a href={`${serverUrl}${msg.fileUrl}`} download={msg.originalname} className="text-blue-200 hover:text-blue-100 underline flex items-center gap-2">
                                            <Paperclip size={16} /> Download: {msg.originalname}
                                        </a>
                                    )
                                ) : (
                                    <div>{msg.messageText}</div>
                                )}
                                <div className={`text-xs mt-1 text-right ${msg.senderEmail === currentUserEmail ? 'text-blue-100' : 'text-gray-500'}`}>
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </main>
            {/* Input Area */}
            <footer className="flex items-center gap-4 border-t border-gray-200 px-6 py-4 bg-white shadow-top sticky bottom-0 z-10">
                <form onSubmit={handleSendMessage} className="flex flex-grow items-center gap-4">
                    <label htmlFor="file-input" className="cursor-pointer text-gray-600 hover:text-blue-600 transition-colors duration-200">
                        <Paperclip size={24} />
                        <input type="file" onChange={handleFileChange} className="hidden" id="file-input" />
                    </label>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-grow px-5 py-3 text-lg border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
                        disabled={!isSocketConnected || file}
                    />
                    <button
                        type="submit"
                        className={`p-3 bg-blue-600 text-white rounded-full transition-transform hover:scale-110 active:scale-95 duration-200 shadow-md ${!isSocketConnected || (!inputValue.trim() && !file) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                        disabled={!isSocketConnected || (!inputValue.trim() && !file)}
                    >
                        <Send size={24} />
                    </button>
                </form>
            </footer>
        </div>
    );
}