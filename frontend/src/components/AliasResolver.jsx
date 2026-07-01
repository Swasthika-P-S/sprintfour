import React from 'react';
import { UserPlus, Check, X, Info } from 'lucide-react';

export default function AliasResolver({ aliases, onResolve }) {
  if (!aliases || aliases.length === 0) return null;

  return (
    <div className="card" style={{ marginTop: 24, border: '1px solid var(--primary)' }}>
      <div className="card-header" style={{ background: 'var(--primary-light)' }}>
        <div className="card-title" style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <UserPlus size={18} /> Alias Resolution Required
          <span style={{ background: 'var(--primary)', color: '#fff', padding: '2px 8px', borderRadius: 12, fontSize: '0.75rem' }}>
            {aliases.length}
          </span>
        </div>
      </div>
      <div className="card-body" style={{ padding: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {aliases.map((alias, idx) => (
            <div key={idx} className="review-card" style={{ borderLeft: '4px solid var(--primary)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <Info size={20} color="var(--primary)" style={{ marginTop: 2 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 8px', fontSize: '0.95rem', color: 'var(--text-dark)', fontWeight: 500 }}>
                    Is <strong>"{alias.text}"</strong> the same person as <strong>"{alias.base_entity}"</strong>?
                  </p>
                  <p style={{ margin: '0 0 16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {alias.reason}
                  </p>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button 
                      className="btn-sm btn-primary" 
                      style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, justifyContent: 'center' }}
                      onClick={() => onResolve(idx, true)}
                    >
                      <Check size={14} /> Yes, Link to {alias.proposed_replacement}
                    </button>
                    <button 
                      className="btn-sm btn-outline" 
                      style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, justifyContent: 'center', borderColor: 'var(--text-muted)', color: 'var(--text-dark)' }}
                      onClick={() => onResolve(idx, false)}
                    >
                      <X size={14} /> No, Different Person
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
