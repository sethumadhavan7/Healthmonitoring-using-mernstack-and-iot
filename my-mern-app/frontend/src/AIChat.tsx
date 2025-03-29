import React, { useState } from 'react';
import { getAIResponse } from './gemini'; // Import AI response function

interface AIChatProps {
  onClose: () => void;
}

const AIChat: React.FC<AIChatProps> = ({ onClose }) => {
  const [message, setMessage] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendMessage = async () => {
    if (!message.trim()) return; // Prevent sending empty messages
    setLoading(true);
    setError(null);
    setResponse('');

    try {
      const aiResponse = await getAIResponse(message);
      setResponse(aiResponse);
    } catch (err) {
      console.error('Error getting AI response:', err);
      setError('Failed to get AI response. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-chat-modal">
      <div className="ai-chat-content">
        <h2>AI Chat</h2>

        <div className="ai-chat-messages">
          {error && <div className="ai-error">{error}</div>}
          {loading && <div className="ai-loading">Fetching response...</div>}
          {response && <div className="ai-response">{response}</div>}
        </div>

        <div className="ai-chat-input">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
          />
          <button onClick={handleSendMessage} disabled={loading || !message.trim()}>
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>

        <button className="close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default AIChat;
