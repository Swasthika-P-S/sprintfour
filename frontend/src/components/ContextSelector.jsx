import React from 'react';

export const CONTEXTS = [
  { id: 'healthcare', label: 'Healthcare', desc: 'Doctors, insurance, hospitals' },
  { id: 'hr', label: 'HR / Recruitment', desc: 'Resumes, job applications' },
];

export default function ContextSelector({ selected, onSelect }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label htmlFor="context-select" style={{ display: 'block', fontWeight: 600, marginBottom: 8, color: 'var(--text-dark)', fontSize: '0.9rem' }}>
        Intended Sharing Context
      </label>
      <select
        id="context-select"
        value={selected || 'healthcare'}
        onChange={(e) => onSelect(e.target.value)}
        style={{
          width: '100%',
          padding: '12px 16px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
          backgroundColor: 'var(--bg-input)',
          color: 'var(--text-body)',
          fontSize: '0.95rem',
          fontFamily: 'inherit',
          outline: 'none',
          cursor: 'pointer',
          boxShadow: 'var(--shadow-xs)',
          transition: 'border-color 0.2s ease'
        }}
        onFocus={(e) => e.target.style.borderColor = 'var(--green-primary)'}
        onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
      >
        {CONTEXTS.map(c => (
          <option key={c.id} value={c.id}>
            {c.label}
          </option>
        ))}
      </select>
    </div>
  );
}
