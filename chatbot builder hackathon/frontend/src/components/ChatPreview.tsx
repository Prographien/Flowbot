import React, { useState, useEffect, useRef } from 'react';
import { chatApi } from '../services/api';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  CircularProgress,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatPreviewProps {
  flowId: string;
}

const ChatPreview: React.FC<ChatPreviewProps> = ({ flowId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const initializeChat = async () => {
      try {
        setLoading(true);
        const response = await chatApi.initializeChat(flowId);
        setContext(response.data.context);
        if (response.data.initialMessage) {
          setMessages([
            {
              id: 'initial',
              text: response.data.initialMessage,
              sender: 'bot',
              timestamp: new Date(),
            },
          ]);
        }
      } catch (error) {
        console.error('Error initializing chat:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeChat();
  }, [flowId]);

  const handleSend = async () => {
    if (!input.trim() || !context) return;

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await chatApi.sendMessage(flowId, input, context);
      
      const botMessage: Message = {
        id: `bot_${Date.now()}`,
        text: response.data.response,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setContext(response.data.context);
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: Message = {
        id: `error_${Date.now()}`,
        text: 'Sorry, there was an error processing your message.',
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        width: '100%',
        height: '500px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        {messages.map((message) => (
          <Box
            key={message.id}
            sx={{
              alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '70%',
            }}
          >
            <Paper
              elevation={1}
              sx={{
                p: 1,
                backgroundColor:
                  message.sender === 'user' ? '#e3f2fd' : '#f5f5f5',
                borderRadius: 2,
              }}
            >
              <Typography variant="body1">{message.text}</Typography>
              <Typography
                variant="caption"
                sx={{ display: 'block', mt: 0.5, opacity: 0.7 }}
              >
                {message.timestamp.toLocaleTimeString()}
              </Typography>
            </Paper>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>
      <Box
        sx={{
          p: 2,
          borderTop: 1,
          borderColor: 'divider',
          display: 'flex',
          gap: 1,
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
          size="small"
          multiline
          maxRows={4}
        />
        <IconButton
          color="primary"
          onClick={handleSend}
          disabled={loading || !input.trim()}
        >
          {loading ? <CircularProgress size={24} /> : <SendIcon />}
        </IconButton>
      </Box>
    </Paper>
  );
};

export default ChatPreview; 