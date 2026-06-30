import React from 'react';

export default function PrivacySimulation({ simulation, loading, onSimulate }) {
  if (loading) {
    return (
      <div className="card" style={{ marginTop: 24, padding: 32, textAlign: 'center' }}>
        <div className="spinner" style={{ margin: '0 auto 16px', borderColor: 'var(--border)', borderTopColor: 'var(--green-primary)' }} />
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Running privacy simulation...</p>
        <p style={{ color: 'var(--text-faint)', fontSize: '0.75rem', marginTop: 8 }}>
          Analyzing unredacted text for k-anonymity risks.
        </p>
      </div>
    );
  }

  if (!simulation) {
    return null;
  }

  const { riskLevel, confidence, suggestions } = simulation;

  const isHigh = riskLevel === 'High';
  const isMedium = riskLevel === 'Medium';
  const isLow = riskLevel === 'Low';

  let badgeClass = 'badge-DEFAULT';
  if (isHigh) badgeClass = 'badge-AADHAAR'; // Red
  else if (isMedium) badgeClass = 'badge-PAN'; // Amber
  else if (isLow) badgeClass = 'badge-EMAIL'; // Green

  return (
    <div className="card" style={{ marginTop: 24 }}>
      <div className="card-header" style={{ borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>
        <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          Privacy Simulation Result
          <span className={`pii-type-badge ${badgeClass}`} style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
            {riskLevel} Risk ({confidence}%)
          </span>
        </div>
      </div>
      <div className="card-body" style={{ paddingTop: 16 }}>
        {suggestions && suggestions.length > 0 && (
          <div>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-dark)', marginBottom: 8 }}>Suggestions to Reduce Risk</h4>
            <ul style={{ paddingLeft: 20, margin: 0, color: 'var(--text-body)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              {suggestions.map((sug, idx) => (
                <li key={idx} style={{ marginBottom: 4 }}>{sug}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div style={{ marginTop: 24, textAlign: 'right' }}>
          <button className="btn btn-ghost btn-sm" onClick={onSimulate}>
            ↻ Re-run Simulation
          </button>
        </div>
      </div>
    </div>
  );
}
