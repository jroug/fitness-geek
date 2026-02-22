'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import header_logo_small from '@/public/images/logo/fitness-geek-logo-fresh-small.svg';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export default function DashboardChatboxDummy() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Hi, I am your AI coach. Ask me anything about your training and nutrition.' },
  ]);
  const [errorText, setErrorText] = useState('');
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [isOpen, messages]);

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    const nextMessage = inputValue.trim();
    if (!nextMessage || isSending) return;

    const nextMessages: ChatMessage[] = [...messages, { role: 'user', content: nextMessage }];
    setMessages(nextMessages);
    setInputValue('');
    setErrorText('');
    setIsSending(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: nextMessages }),
      });

      const data = (await res.json()) as { answer?: string; error?: string };
      if (!res.ok || !data.answer) {
        setErrorText(data.error || 'Failed to get a response.');
        return;
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: data.answer as string }]);
    } catch {
      setErrorText('Network error. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen ? (
          <motion.section
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed bottom-[4.8rem] right-4 z-50 h-[800px] w-[500px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl md:right-6 md:h-[min(1260px,calc(100dvh-7rem))]"
            aria-label="Demo chatbox"
          >
          <div className="chat-header flex items-center justify-between bg-slate-900 px-4 pt-[10px] pb-[10px] text-white">
            <div className="flex items-center gap-2">
              <Image src={header_logo_small} alt="Fitness Geek logo" className="h-8 w-8 rounded-md" />
              <p className="text-sm font-semibold">AI Coach</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-200 transition hover:bg-white/10"
                aria-label="Close chatbox"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>

          <div className="h-[calc(100%-120px)] space-y-3 overflow-y-auto bg-slate-50 p-4">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ring-1 ${
                  message.role === 'assistant'
                    ? 'rounded-bl-md bg-white text-slate-700 ring-slate-200'
                    : 'ml-auto rounded-br-md bg-cyan-100 text-slate-800 ring-cyan-200'
                }`}
              >
                {message.content}
              </div>
            ))}
            {isSending ? (
              <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-white px-3 py-2 text-sm text-slate-500 ring-1 ring-slate-200">
                Thinking...
              </div>
            ) : null}
            {errorText ? <p className="text-xs text-rose-600">{errorText}</p> : null}
            <div ref={bottomRef} />
          </div>

          <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-slate-200 bg-white p-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isSending}
              placeholder="Type your question..."
              className="h-10 flex-1 rounded-xl border border-slate-300 bg-slate-100 px-3 text-sm text-slate-500 outline-none"
            />
            <button
              type="submit"
              disabled={isSending || inputValue.trim().length === 0}
              className="h-10 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSending ? '...' : 'Send'}
            </button>
          </form>
          </motion.section>
        ) : null}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-4 right-4 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white shadow-xl transition hover:bg-slate-700 md:right-6"
        aria-label="Open chatbox"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M12 3.75L13.2 6.8L16.25 8L13.2 9.2L12 12.25L10.8 9.2L7.75 8L10.8 6.8L12 3.75Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6 13.5L6.8 15.2L8.5 16L6.8 16.8L6 18.5L5.2 16.8L3.5 16L5.2 15.2L6 13.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M17.5 13L18.4 14.8L20.2 15.7L18.4 16.6L17.5 18.4L16.6 16.6L14.8 15.7L16.6 14.8L17.5 13Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </>
  );
}
