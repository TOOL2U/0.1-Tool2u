import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import { CSSTransition } from 'react-transition-group';

// Knowledge base for the chatbot
const knowledgeBase = [
  {
    question: "What is Tool2U?",
    answer: "Tool2U is an online tool rental service that delivers tools straight to your location and picks them up when you're done. We make tool rentals easy and hassle-free!"
  },
  {
    question: "How does Tool2U work?",
    answer: "1. Browse Tools – Select the tools you need from our online catalog.\n2. Choose Rental Duration – Pick how long you need them for.\n3. Order & Pay Online – Complete your order with secure payment.\n4. We Deliver – Get your tools delivered to your location.\n5. Use & Return – Once done, we'll pick them up!"
  },
  {
    question: "What areas do you serve?",
    answer: "We currently offer tool rentals in Bangkok and surrounding areas. If you're outside this area, contact us, and we'll see if we can arrange delivery."
  },
  {
    question: "How long can I rent tools for?",
    answer: "You can rent tools for as little as 1 day or as long as 30+ days. Discounts may be available for long-term rentals."
  },
  {
    question: "Can I extend my rental period?",
    answer: "Yes! You can extend your rental by contacting us before your rental period ends. Additional fees may apply."
  },
  {
    question: "What if I return a tool late?",
    answer: "Late returns may incur additional charges. Please contact us as soon as possible if you need an extension."
  },
  {
    question: "How do I place an order?",
    answer: "1. Browse tools on our website.\n2. Select the tool and rental duration.\n3. Add to cart and complete payment.\n4. We confirm your order and arrange delivery."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept Visa, MasterCard, PayPal, and Apple Pay."
  },
  {
    question: "Is there a security deposit?",
    answer: "Yes, some tools require a refundable security deposit. This is refunded after tool inspection upon return."
  },
  {
    question: "When will my deposit be refunded?",
    answer: "Deposits are refunded within 2 business days after returning the tool in good condition."
  },
  {
    question: "How much does delivery cost?",
    answer: "Delivery fees vary based on location. The cost will be calculated at checkout."
  },
  {
    question: "When will my tools be delivered?",
    answer: "We deliver within 6 hours of your order. You can select a preferred delivery time at checkout."
  },
  {
    question: "Do I need to be home for delivery/pickup?",
    answer: "Yes, someone must be present to receive and return the tools. If unavailable, please contact us to make alternative arrangements."
  },
  {
    question: "What if a tool gets damaged during my rental?",
    answer: "If accidental damage occurs, report it immediately. You may be charged for repairs or replacement."
  },
  {
    question: "What if the tool is faulty upon delivery?",
    answer: "If a tool is defective or doesn't work, contact us within 24 hours for a replacement or refund."
  },
  {
    question: "Do you clean the tools before rental?",
    answer: "Yes! All tools are cleaned and inspected before every rental."
  },
  {
    question: "Can I cancel my order?",
    answer: "Yes, cancellations are allowed up to 2 hours before delivery for a full refund. After this time, a cancellation fee may apply."
  },
  {
    question: "Do you offer refunds?",
    answer: "Refunds are available for orders canceled within the allowed timeframe or if a tool is faulty. See our Refund Policy for details."
  },
  {
    question: "How can I contact customer support?",
    answer: "📧 Email: wearetool2u@gmail.com\n📞 Phone: 0933880630\n📲 WhatsApp: https://wa.me/66933880630"
  },
  {
    question: "What are your customer support hours?",
    answer: "We are available from 8am - 8pm 7 days a week"
  }
];

// Common questions for quick access
const commonQuestions = [
  "What is Tool2U?",
  "How does Tool2U work?",
  "How do I place an order?",
  "How can I contact customer support?"
];

interface Message {
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hi there! I'm Tool2u Support. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  // Function to find the best answer from knowledge base
  const findAnswer = (question: string): string => {
    // Convert to lowercase for case-insensitive matching
    const normalizedQuestion = question.toLowerCase();
    
    // First try exact matches
    for (const entry of knowledgeBase) {
      if (entry.question.toLowerCase() === normalizedQuestion) {
        return entry.answer;
      }
    }
    
    // Then try keyword matching
    let bestMatch = null;
    let highestScore = 0;
    
    for (const entry of knowledgeBase) {
      const keywords = entry.question.toLowerCase().split(' ');
      let score = 0;
      
      for (const word of keywords) {
        if (normalizedQuestion.includes(word) && word.length > 3) {
          score++;
        }
      }
      
      if (score > highestScore) {
        highestScore = score;
        bestMatch = entry.answer;
      }
    }
    
    if (bestMatch && highestScore > 1) {
      return bestMatch;
    }
    
    // Default response if no match found
    return "I'm not sure about that. Would you like to contact our customer service? You can reach us at wearetool2u@gmail.com or call 0933880630.";
  };

  // Function to handle user message and generate bot response
  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;
    
    // Add user message
    const userMessage: Message = {
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    // Simulate bot thinking time
    setTimeout(() => {
      const botResponse: Message = {
        text: findAnswer(inputValue),
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  // Handle common question click
  const handleQuestionClick = (question: string) => {
    setInputValue(question);
    handleSendMessage();
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Check for reduced motion preference
  const prefersReducedMotion = 
    typeof window !== 'undefined' 
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
      : false;

  return (
    <>
      {/* Chat toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-black flex items-center justify-center shadow-lg btn-animate z-50"
        aria-label="Chat with Tool2u Support"
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-[#FFF02B]" />
        ) : (
          <MessageSquare className="w-6 h-6 text-[#FFF02B]" />
        )}
      </button>

      {/* Chat window */}
      <CSSTransition
        in={isOpen}
        timeout={prefersReducedMotion ? 0 : 250}
        classNames="menu"
        unmountOnExit
        nodeRef={chatWindowRef}
      >
        <div 
          ref={chatWindowRef}
          className="fixed bottom-24 right-6 w-80 sm:w-96 h-[500px] bg-white rounded-lg shadow-xl flex flex-col overflow-hidden z-50 border border-gray-200"
        >
          {/* Chat header */}
          <div className="bg-black text-white p-4 flex items-center justify-between">
            <div className="flex items-center">
              <MessageSquare className="w-5 h-5 text-[#FFF02B] mr-2" />
              <h3 className="font-bold">Tool2u Support</h3>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-300 hover:text-white btn-animate"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Chat messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`mb-4 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}
              >
                <div 
                  className={`inline-block p-3 rounded-lg max-w-[80%] ${
                    message.sender === 'user' 
                      ? 'bg-blue-500 text-white rounded-br-none animate-fadeIn' 
                      : 'bg-gray-200 text-gray-800 rounded-bl-none animate-fadeIn'
                  }`}
                  style={{ 
                    animationDuration: '250ms',
                    animationDelay: `${index * 50}ms`
                  }}
                >
                  <p className="whitespace-pre-line">{message.text}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="text-left mb-4">
                <div className="inline-block p-3 rounded-lg bg-gray-200 text-gray-800 rounded-bl-none">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Common questions */}
          <div className="px-4 py-2 bg-gray-100 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-2">Common questions:</p>
            <div className="flex flex-wrap gap-2">
              {commonQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleQuestionClick(question)}
                  className="text-xs bg-white border border-gray-300 rounded-full px-3 py-1 hover:bg-gray-50 btn-animate"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
          
          {/* Chat input */}
          <div className="p-3 border-t border-gray-200 flex items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 input-animate"
            />
            <button
              onClick={handleSendMessage}
              disabled={inputValue.trim() === ''}
              className={`ml-2 rounded-full w-10 h-10 flex items-center justify-center btn-animate ${
                inputValue.trim() === '' 
                  ? 'bg-gray-200 text-gray-400' 
                  : 'bg-black text-[#FFF02B]'
              }`}
              aria-label="Send message"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </CSSTransition>
    </>
  );
};

export default ChatBot;
