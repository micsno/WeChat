'use client';

import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import './styles.css'; 

const socket = io('http://localhost:3001');

const Page = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState<string>('');
  const [nickname, setNickname] = useState<string>('');
  const [isNickSet, setIsNickSet] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    socket.on('chat message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off('chat message');
    };
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message && isNickSet) {
      socket.emit('chat message', `${nickname}: ${message}`);
      setMessage('');
    }
  };

  const setUserNickname = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (nickname) {
      setIsNickSet(true);
    }
  };

  return (
    <div className="chat-container">
      <h1>WeChat</h1>
      
      {!isNickSet ? (
        <form onSubmit={setUserNickname} className="nickname-form">
          <input
            type="text"
            placeholder="Nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="nickname-input"
          />
          <button type="submit" className="submit-button">
            Set a nickname
          </button>
        </form>
      ) : (
        <>
          <form onSubmit={sendMessage} className="message-form">
            <input
              type="text"
              placeholder="Write a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="message-input"
            />
            <button type="submit" className="submit-button">
              Send
            </button>
          </form>
          <div className="messages-container">
            {messages.map((msg, index) => (
              <div key={index} className="message">
                {msg}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </>
      )}
    </div>
  );
};

export default Page;
