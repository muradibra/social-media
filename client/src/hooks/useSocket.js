import { BASE_URL } from "@/constants";
import { selectUser } from "@/store/auth/authSlice";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { io } from 'socket.io-client';

export function useSocket() {
  const [socket, setSocket] = useState(null);
  const { user } = useSelector(selectUser);

  useEffect(() => {
    const newSocket = io(BASE_URL, {
      withCredentials: true,
    });

    newSocket.emit('register', { userId: user._id });

    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, []);

  return socket;
}