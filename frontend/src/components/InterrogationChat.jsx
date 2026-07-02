import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, Loader2, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

const API = import.meta.env.PROD ? '/api' : 'http://localhost:5000/api';

const STARTER_QUESTIONS = [
  "Why was the first person's name hidden?",
  "What's the biggest privacy risk in this document?",
  "Which entities were kept visible and why?",
  "Are there any re-identification risks I should know about?",
];

export default function InterrogationChat({ entities, safeEntities, redactedIndices, aliasSuggestions, token }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hello! I'm VEILiq. Ask me anything about why specific words in this document were hidden or kept visible. My answers are grounded entirely in this document's actual detection data." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const sendMessage = async (question) => {
    const q = question || input.trim();
    if (!q) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: q }]);
    setLoading(true);

    try {
      const metadata = {
        entities,
        safeEntities,
        redactedIndices,
        aliasSuggestions,
      };
      const res = await fetch(`${API}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ question: q, metadata })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', text: data.answer || 'No answer returned.' }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card" style={{ padding: 0, marginTop: 8, overflow: 'hidden' }}>
      {/* Header toggle */}
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px', background: 'transparent', border: 'none', cursor: 'pointer',
          borderBottom: open ? '1px solid var(--border-glass)' : 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="icon-glass-wrapper" style={{ background: 'rgba(167,139,250,0.1)', color: '#A78BFA', width: 40, height: 40 }}>
            <MessageCircle size={20} />
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontWeight: 700, color: 'var(--text-dark)', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: 6 }}>
              Ask VEILiq Why <Sparkles size={14} color="#A78BFA" />
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Interrogate every redaction decision</div>
          </div>
        </div>
        {open ? <ChevronUp size={18} color="var(--text-muted)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden' }}
          >
            {/* Starter chip questions */}
            {messages.length <= 1 && (
              <div style={{ padding: '12px 16px', display: 'flex', flexWrap: 'wrap', gap: 8, borderBottom: '1px solid var(--border-glass)' }}>
                {STARTER_QUESTIONS.map((q, i) => (
                  <button key={i} onClick={() => sendMessage(q)} style={{
                    background: 'var(--bg-glass-strong)', border: '1px solid var(--border-glass)',
                    color: 'var(--text-muted)', borderRadius: 20, padding: '4px 12px', fontSize: '0.78rem',
                    cursor: 'pointer', transition: 'all 0.2s'
                  }} onMouseEnter={e => { e.target.style.borderColor = '#A78BFA'; e.target.style.color = '#A78BFA'; }}
                     onMouseLeave={e => { e.target.style.borderColor = 'var(--border-glass)'; e.target.style.color = 'var(--text-muted)'; }}>
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Messages */}
            <div style={{ maxHeight: 360, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {messages.map((msg, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  style={{
                    display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
                  }}>
                  <div style={{
                    maxWidth: '85%', padding: '10px 14px', borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    background: msg.role === 'user' ? 'var(--primary)' : 'var(--bg-glass-strong)',
                    border: msg.role === 'user' ? 'none' : '1px solid var(--border-glass)',
                    color: msg.role === 'user' ? '#fff' : 'var(--text-body)',
                    fontSize: '0.88rem', lineHeight: 1.5
                  }}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    padding: '10px 14px', background: 'var(--bg-glass-strong)', border: '1px solid var(--border-glass)',
                    borderRadius: '16px 16px 16px 4px', display: 'flex', gap: 6, alignItems: 'center'
                  }}>
                    <Loader2 size={14} className="spin-animation" color="#A78BFA" />
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Thinking…</span>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border-glass)', display: 'flex', gap: 8 }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder="Ask why an entity was hidden or kept visible…"
                style={{
                  flex: 1, background: 'var(--bg-glass-strong)', border: '1px solid var(--border-glass)',
                  borderRadius: 10, padding: '10px 14px', color: 'var(--text-dark)', fontSize: '0.88rem',
                  outline: 'none'
                }}
              />
              <button
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
                style={{
                  background: '#A78BFA', border: 'none', borderRadius: 10, padding: '10px 14px',
                  color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
                  opacity: loading || !input.trim() ? 0.5 : 1, transition: 'opacity 0.2s'
                }}
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`.spin-animation { animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
