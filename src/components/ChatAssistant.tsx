import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Search, MapPin } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

type Message = { role: 'user' | 'model'; text: string };

export function ChatAssistant() {
  const [isOpen, setIsOpen]   = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Hello! I am your KarmSetu AI Assistant. How can I help you today?' }
  ]);
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);
  const [groundingMode, setGroundingMode] = useState<'search' | 'maps'>('search');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput(''); setLoading(true);
    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history: messages, prompt: userMessage.text, modelType: 'general', groundingMode }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to communicate with AI Assistant');
      if (data.text) setMessages(prev => [...prev, { role: 'model', text: data.text }]);
    } catch (err: any) {
      let msg = 'Sorry, I encountered an error. Please try again.';
      if (err.message?.includes('429') || err.message?.includes('quota'))
        msg = 'API Quota Exceeded. Please update your billing details or provide a new key.';
      else if (err.message) msg = `Error: ${err.message}`;
      setMessages(prev => [...prev, { role: 'model', text: msg }]);
    } finally { setLoading(false); }
  };

  const hair = '1px solid rgba(255,255,255,.08)';

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed', bottom: 24, right: 24, zIndex: 50,
            width: 48, height: 48, borderRadius: 0,
            background: '#6366F1', color: '#fff', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(99,102,241,.35)',
            transition: 'background .2s, transform .15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#4338CA')}
          onMouseLeave={e => (e.currentTarget.style.background = '#6366F1')}
        >
          <MessageSquare size={20} />
        </button>
      )}

      {isOpen && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 50,
          width: 384, maxWidth: 'calc(100vw - 3rem)',
          height: 580, maxHeight: 'calc(100vh - 6rem)',
          background: '#0F0F11', border: hair,
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          boxShadow: '0 24px 64px rgba(0,0,0,.60)',
        }}>

          {/* Header */}
          <div style={{
            background: '#131316', borderBottom: hair,
            padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <MessageSquare size={15} style={{ color: '#6366F1' }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', fontWeight: 300 }}>
                AI Assistant
              </span>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,.40)', lineHeight: 1 }}>
              <X size={16} />
            </button>
          </div>

          {/* Grounding Toggles */}
          <div style={{
            background: '#0A0A0A', borderBottom: hair,
            padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,.30)', marginRight: 4 }}>Intelligence:</span>
            {([['search', Search, 'Web Search'], ['maps', MapPin, 'Maps']] as const).map(([mode, Icon, label]) => (
              <button key={mode} onClick={() => setGroundingMode(mode as any)} style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px',
                fontFamily: "'JetBrains Mono', monospace", fontSize: 8, letterSpacing: '.10em', textTransform: 'uppercase',
                background: groundingMode === mode ? 'rgba(99,102,241,.18)' : 'transparent',
                color: groundingMode === mode ? '#6366F1' : 'rgba(255,255,255,.40)',
                border: groundingMode === mode ? '1px solid rgba(99,102,241,.35)' : '1px solid rgba(255,255,255,.08)',
                cursor: 'pointer', transition: 'all .18s',
              }}>
                <Icon size={10} />{label}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12, background: '#0A0A0A' }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '85%', padding: '10px 14px', fontSize: 13, lineHeight: 1.65,
                  background: msg.role === 'user' ? '#6366F1' : '#131316',
                  color: msg.role === 'user' ? '#fff' : 'rgba(255,255,255,.80)',
                  border: msg.role === 'user' ? 'none' : hair,
                }}>
                  {msg.role === 'user' ? msg.text : (
                    <div className="markdown-body prose prose-sm prose-invert max-w-none">
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ background: '#131316', border: hair, padding: '10px 14px', display: 'flex', gap: 5 }}>
                  {[0, 150, 300].map(d => (
                    <div key={d} style={{ width: 5, height: 5, background: 'rgba(255,255,255,.30)', borderRadius: '50%', animation: 'bounce 1.2s infinite', animationDelay: `${d}ms` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '10px 12px', background: '#0F0F11', borderTop: hair, display: 'flex', gap: 8 }}>
            <input
              type="text" value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask something..."
              style={{
                flex: 1, background: '#131316', border: hair,
                color: '#fff', padding: '9px 14px', fontSize: 13,
                outline: 'none', fontFamily: 'inherit',
              }}
            />
            <button onClick={handleSend} disabled={!input.trim() || loading} style={{
              width: 38, height: 38, background: '#6366F1', color: '#fff', border: 'none',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: (!input.trim() || loading) ? .4 : 1, transition: 'opacity .2s, background .2s', flexShrink: 0,
            }}>
              <Send size={14} />
            </button>
          </div>
        </div>
      )}

      <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}`}</style>
    </>
  );
}
