import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getChatSession } from '../../services/geminiService';
import type { ChatMessage } from '../../types';
import LoadingSpinner from './LoadingSpinner';
import { KaliIcon } from '../../constants';

declare global {
  interface Window {
    hljs: any;
  }
}

interface ChatInterfaceProps {
  panelId: string;
  systemInstruction: string;
  welcomeMessage?: string;
  placeholder: string;
  spokenText?: string;
  clearSpokenText?: () => void;
  speak?: (text: string, options?: { isFeedback?: boolean; onEnd?: () => void; }) => void;
  uiVisible?: boolean;
  isSpeaking?: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  panelId, 
  systemInstruction, 
  welcomeMessage,
  placeholder,
  spokenText, 
  clearSpokenText, 
  speak,
  uiVisible = false,
  isSpeaking = false,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (window.hljs) {
      document.querySelectorAll('pre code:not(.hljs)').forEach((block) => {
        window.hljs.highlightElement(block);
      });
    }
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0 && welcomeMessage) {
      setMessages([{ role: 'model', content: welcomeMessage }]);
    }
    if (uiVisible) {
      inputRef.current?.focus();
    }
  }, [welcomeMessage, messages.length, uiVisible]);

  const handleSendMessage = useCallback(async (messageToSend?: string) => {
    const text = messageToSend?.trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    let fullResponse = '';

    try {
      const chat = getChatSession(panelId, systemInstruction);
      const response = await chat.sendMessageStream({ message: text });
      
      let streamedResponse = '';
      for await (const chunk of response) {
        streamedResponse += chunk.text;
      }
      fullResponse = streamedResponse;
      
      if (!fullResponse.trim()) {
        fullResponse = "I'm sorry, I couldn't generate a response for that. This can sometimes happen due to safety filters or the nature of the request. Please try rephrasing your question.";
      }
      
      const modelMessage: ChatMessage = { role: 'model', content: fullResponse };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      fullResponse = "Sorry, I encountered an error. Please try again.";
      const errorMessage: ChatMessage = { role: 'model', content: fullResponse };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      speak?.(fullResponse);
      inputRef.current?.focus();
    }
  }, [isLoading, panelId, systemInstruction, speak]);

  const handleFormSubmit = () => {
    if (input.trim() !== '') {
      handleSendMessage(input);
      setInput('');
    }
  };

  useEffect(() => {
    if (spokenText && clearSpokenText) {
      handleSendMessage(spokenText);
      clearSpokenText();
    }
  }, [spokenText, clearSpokenText, handleSendMessage]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    });
  };

  const renderMessageContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      const codeBlockMatch = part.match(/```(\w*)\n([\s\S]*?)```/);
      if (codeBlockMatch) {
        const language = codeBlockMatch[1] || 'plaintext';
        const code = codeBlockMatch[2].trim();
        return (
          <div key={index} className="relative group my-2">
            <pre><code className={`language-${language}`}>{code}</code></pre>
            <button
              onClick={() => handleCopyCode(code)}
              className="absolute top-2 right-2 px-2 py-1 bg-gray-700 text-xs text-cyan-200 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-600"
            >
              {copiedCode === code ? 'Copied!' : 'Copy'}
            </button>
          </div>
        );
      } else {
        return <span key={index} className="whitespace-pre-wrap">{part}</span>;
      }
    });
  };

  if (!uiVisible) {
    return null;
  }

  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex-grow p-4 overflow-y-auto font-mono text-base">
        {messages.map((msg, index) => {
          const isLastMessage = index === messages.length - 1;
          const shouldGlow = msg.role === 'model' && isLastMessage && isSpeaking;

          return (
            <div key={index} className="mb-3">
              {msg.role === 'user' ? (
                <div className="flex items-baseline">
                  <span className="text-cyan-400 mr-2 flex-shrink-0">[YOU] &gt;</span>
                  <p className="whitespace-pre-wrap break-words min-w-0">{msg.content}</p>
                </div>
              ) : (
                <div className="flex items-start">
                  <KaliIcon className={`w-5 h-5 text-cyan-400 flex-shrink-0 mr-2 mt-0.5 ${shouldGlow ? 'animate-speaking-glow' : ''}`} />
                  <div className="flex-1 min-w-0">
                    {renderMessageContent(msg.content)}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {isLoading && (
            <div className="flex items-start mt-3">
                <KaliIcon className="w-5 h-5 text-cyan-400 flex-shrink-0 mr-2 mt-0.5" />
                <LoadingSpinner />
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-cyan-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleFormSubmit();
          }}
          className="flex items-baseline font-mono"
        >
          <label htmlFor="chat-input" className="text-cyan-400 mr-2">[YOU] &gt;</label>
          <textarea
            id="chat-input"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleFormSubmit();
              }
            }}
            placeholder={placeholder}
            className="flex-grow bg-transparent text-cyan-200 focus:outline-none resize-none"
            rows={1}
            onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = `${target.scrollHeight}px`;
            }}
            disabled={isLoading}
          />
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;