import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { reviewAPI } from '../../utils/api';
import toast from 'react-hot-toast';

function UserChat({ review }) {
    const { user } = useSelector((state) => state.auth);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchMessages = async () => {
        try {
            const response = await reviewAPI.getChatMessages(review._id);
            setMessages(response.data.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    useEffect(() => {
        if (review?._id && (review.status === 'in_progress' || review.status === 'completed')) {
            fetchMessages();
            // Poll for new messages every 5 seconds
            const interval = setInterval(fetchMessages, 5000);
            return () => clearInterval(interval);
        }
    }, [review]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!newMessage.trim()) return;

        setLoading(true);

        try {
            const response = await reviewAPI.sendChatMessage(review._id, newMessage);
            setMessages([...messages, response.data.data]);
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('Failed to send message');
        } finally {
            setLoading(false);
        }
    };

    // No review exists
    if (!review) {
        return (
            <div className="bg-gray-50 p-4 rounded-lg text-center border border-gray-200">
                <p className="text-gray-500 text-sm">
                    💬 Send your document for review to start chatting with a lawyer.
                </p>
            </div>
        );
    }

    // Review exists but lawyer hasn't accepted yet
    if (review.status === 'pending') {
        return (
            <div className="bg-yellow-50 p-4 rounded-lg text-center border border-yellow-200">
                <p className="text-yellow-800 text-sm font-medium mb-1">
                    ⏳ Waiting for Lawyer
                </p>
                <p className="text-yellow-600 text-xs">
                    Chat will be available once a lawyer accepts your review request.
                </p>
            </div>
        );
    }

    // Review was rejected
    if (review.status === 'rejected') {
        return (
            <div className="bg-red-50 p-4 rounded-lg text-center border border-red-200">
                <p className="text-red-800 text-sm font-medium mb-1">
                    ❌ Review Declined
                </p>
                <p className="text-red-600 text-xs">
                    This review was declined by the lawyer. Please request a new review.
                </p>
            </div>
        );
    }

    // Review is in_progress or completed - enable chat
    return (
        <div className="bg-white rounded-lg shadow overflow-hidden flex flex-col h-96 border border-gray-200">
            {/* Chat Header */}
            <div className="bg-blue-600 text-white p-4">
                <h3 className="font-bold">💬 Chat with Lawyer</h3>
                {review.lawyer && (
                    <p className="text-xs text-blue-100 mt-1">
                        {review.lawyer.name}
                    </p>
                )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">No messages yet. Start the conversation!</p>
                ) : (
                    messages.map((message) => {
                        // Debug logs
                        console.log('Message sender:', message.sender._id);
                        console.log('Current user:', user?.id || user?._id);

                        const isCurrentUser = message.sender._id === (user?.id || user?._id);

                        return (
                            <div
                                key={message._id}
                                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-xs px-4 py-2 rounded-lg ${isCurrentUser
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-900'
                                        }`}
                                >
                                    {!isCurrentUser && (
                                        <p className="text-xs font-semibold opacity-75 mb-1">
                                            {message.sender.name}
                                        </p>
                                    )}
                                    <p className="text-sm">{message.message}</p>
                                    <p
                                        className={`text-xs mt-1 opacity-70`}
                                    >
                                        {new Date(message.createdAt).toLocaleTimeString('en-IN', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="border-t border-gray-200 p-4 bg-gray-50">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        disabled={loading}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-100"
                    />
                    <button
                        type="submit"
                        disabled={loading || !newMessage.trim()}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition"
                    >
                        {loading ? '...' : '📤'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default UserChat;
