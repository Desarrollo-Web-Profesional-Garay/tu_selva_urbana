import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { chatAPI } from '../services/api';

export default function Chatbot({ plantContext = null }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, sender: 'bot', text: '¡Hola! Soy tu asistente botánico de Tu Selva Urbana 🌿. ¿En qué te puedo ayudar hoy?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        e?.preventDefault();
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), sender: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const res = await chatAPI.sendMessage(userMsg.text, plantContext);
            setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: res.reply }]);
        } catch (error) {
            setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: 'Ups, mi conexión mental a la naturaleza falló. ¿Puedes repetirlo?' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="bg-white/95 backdrop-blur-xl border border-sage/30 shadow-2xl rounded-2xl w-80 sm:w-96 overflow-hidden mb-4 flex flex-col"
                        style={{ height: '480px' }}
                    >
                        {/* Header */}
                        <div className="bg-forest p-4 flex items-center justify-between text-white">
                            <div className="flex items-center gap-2">
                                <Bot size={24} className="text-terra" />
                                <div>
                                    <h3 className="font-bold text-base leading-tight">Asistente Botánico</h3>
                                    <p className="text-xs text-white/70">Respuestas impulsadas por IA</p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-bone/30 custom-scrollbar">
                            {messages.map(msg => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={msg.id}
                                    className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'user' ? 'bg-sage text-white' : 'bg-terra text-white'}`}>
                                        {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                                    </div>
                                    <div className={`px-4 py-2.5 rounded-2xl max-w-[75%] text-sm ${msg.sender === 'user' ? 'bg-sage text-white rounded-tr-none' : 'bg-white border border-sage/20 text-forest rounded-tl-none shadow-sm'}`}>
                                        {msg.text}
                                    </div>
                                </motion.div>
                            ))}
                            {isLoading && (
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-terra text-white flex items-center justify-center shrink-0">
                                        <Bot size={16} />
                                    </div>
                                    <div className="px-4 py-3 rounded-2xl bg-white border border-sage/20 text-forest rounded-tl-none shadow-sm flex gap-1 items-center">
                                        <div className="w-1.5 h-1.5 bg-sage/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="w-1.5 h-1.5 bg-sage/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <div className="w-1.5 h-1.5 bg-sage/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-3 bg-white border-t border-sage/10">
                            <form onSubmit={handleSend} className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Pregunta sobre cuidados..."
                                    className="flex-1 bg-bone border border-sage/30 rounded-xl px-4 py-2 text-sm text-forest focus:outline-none focus:border-sage focus:ring-1 focus:ring-sage"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || isLoading}
                                    className="w-10 h-10 flex flex-shrink-0 items-center justify-center bg-terra text-white rounded-xl hover:bg-terra/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Send size={18} />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bubble Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full shadow-2xl shadow-terra/30 flex items-center justify-center transition-colors z-50 ${isOpen ? 'bg-forest text-white' : 'bg-terra text-white'}`}
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
            </motion.button>
        </div>
    );
}
