import React from 'react';
import MessageItem from './Message';
import { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getConversation } from '@/services/chat';
import { CHAT_CONVERSATIONS_QUERY_KEY, CHAT_MESSAGES_QUERY_KEY } from '@/constants/query-keys';
import Spinner from '@/components/shared/spinner';
import { useSelector } from 'react-redux';
import { selectUser } from '@/store/auth/authSlice';

const Chat = ({ socket }) => {
  const { user } = useSelector(selectUser);
  const { id } = useParams();
  const inputRef = useRef(null);
  const queryClient = useQueryClient();
  const { data, isLoading, status } = useQuery({
    queryKey: [CHAT_MESSAGES_QUERY_KEY, id],
    queryFn: () => getConversation({ receiverId: id })
  });
  const [messages, setMessages] = useState([]);
  const wrapperRef = useRef(null);
  const receiver = data?.item?.user1._id === user._id ? data?.item?.user2 : data?.item?.user1;

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = inputRef.current?.value.trim();
    const conversationId = data?.item?._id;
    if (!value || !conversationId) return;
    setMessages(prev => [...prev, { text: value, owner: true, name: user.name }]);
    socket?.emit('message', { conversationId, message: value, to: id, from: user._id });
    inputRef.current.value = '';
  };

  useEffect(() => {
    if (!socket) return;
    socket.on('message', (data) => {
      const id = window.location.pathname.split('/').pop();
      if (data.from !== id) return;
      setMessages(prev => [...prev, { text: data.message, owner: false, name: receiver?.name }]);
    });
  }, [socket]);

  useEffect(() => {
    if (!data) return;
    setMessages(data.item.messages.map(message => {
      const owner = message.user === user._id;
      return {
        owner,
        name: owner ? user.name : receiver.name,
        text: message.content,
        createdAt: message.createdAt,
      };
    }));
  }, [data]);

  useEffect(() => {
    if (wrapperRef && wrapperRef.current) {
      wrapperRef.current.scrollTo({
        top: wrapperRef.current.scrollHeight
      });
    }
  }, [messages]);

  useEffect(() => {
    if (status === 'success') {
      queryClient.invalidateQueries(CHAT_CONVERSATIONS_QUERY_KEY);
    }
  }, [status]);

  if (isLoading) {
    return <div className='flex flex-col gap-3 justify-center items-center h-full w-full bg-gray-100'>
      <Spinner size={32} />
      <p className='text-muted-foreground '>Loading messages...</p>
    </div>;
  }

  return (
    <div className="flex flex-col flex-auto h-full p-6">
      <div
        className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4"
      >
        <div ref={wrapperRef} className="flex flex-col h-full overflow-x-auto mb-4">
          <div className="flex flex-col h-full">
            <div className="grid grid-cols-12 gap-y-2">
              {messages.map((message, index) => (
                <MessageItem
                  key={index}
                  text={message.text}
                  name={message.name}
                  owner={message.owner}
                  createdAt={message.createdAt}
                />
              ))}
            </div>
          </div>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4"
        >
          <div>
            <button
              className="flex items-center justify-center text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                ></path>
              </svg>
            </button>
          </div>
          <div className="flex-grow ml-4">
            <div className="relative w-full">
              <input
                ref={inputRef}
                type="text"
                className="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
              />
              <button
                className="absolute flex items-center justify-center h-full w-12 right-0 top-0 text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
          <div className="ml-4">
            <button
              className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0"
            >
              <span>Send</span>
              <span className="ml-2">
                <svg
                  className="w-4 h-4 transform rotate-45 -mt-px"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  ></path>
                </svg>
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;