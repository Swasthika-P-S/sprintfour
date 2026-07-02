import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, ShieldCheck, ChevronDown, ChevronUp, Info, HelpCircle } from 'lucide-react';

export default function ExplainabilityPanel({ selectedEntity }) {
  const [expanded, setExpanded] = useState(false);

  if (!selectedEntity) {
    return (
      <div className="empty-panel-state glass-card">
        <div className="glow-orb" />
        <Info size={40} color="var(--primary)" style={{ opacity: 0.8, marginBottom: 16 }} />
        <h4 style={{ color: 'var(--text-dark)', fontWeight: 700, marginBottom: 8 }}>AI Inspection Panel</h4>
        <p style={{ color: 'var(--text-muted)' }}>Select any highlighted word in the document to inspect the AI's deep reasoning process.</p>
      </div>
    );
  }

  const isSafe = selectedEntity.isSafe || false;
  const confColor = getConfidenceColor(selectedEntity.confidence);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15, scale: 0.98 }} 
      animate={{ opacity: 1, y: 0, scale: 1 }} 
      key={selectedEntity.idx ?? selectedEntity.text}
      className="explainability-card glass-card"
    >
      <div className="card-header" style={{ borderBottom: '1px solid var(--border-glass)', paddingBottom: 20, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div className="icon-glass-wrapper" style={{
            background: isSafe ? 'rgba(52,211,153,0.1)' : 'var(--conf-red-bg)',
            color: isSafe ? 'var(--conf-green)' : 'var(--conf-red)',
            boxShadow: isSafe ? 'var(--shadow-glow)' : 'var(--shadow-glow-red)'
          }}>
            {isSafe ? <ShieldCheck size={28} /> : <ShieldAlert size={28} />}
          </div>
          <div>
            <div className="entity-text gradient-text" style={{ fontSize: '1.4rem' }}>{selectedEntity.text}</div>
            <div className="decision-badge" style={{
              background: isSafe ? 'rgba(52,211,153,0.1)' : 'var(--conf-red-bg)',
              color: isSafe ? 'var(--conf-green)' : 'var(--conf-red)',
              borderColor: isSafe ? 'var(--conf-green)' : 'var(--conf-red)',
              border: '1px solid'
            }}>
              Decision: {isSafe ? 'KEPT VISIBLE' : 'HIDDEN'}
            </div>
          </div>
        </div>
      </div>

      <div className="metric-row" style={{ gap: 16, marginBottom: 28 }}>
        <div className="metric-box glass-box" style={{ flex: 1 }}>
          <span className="metric-label">Confidence</span>
          <span className="metric-value neon-text" style={{ color: confColor }}>{selectedEntity.confidence}%</span>
        </div>
        {!isSafe && selectedEntity.type && (
          <div className="metric-box glass-box" style={{ flex: 1 }}>
            <span className="metric-label">Entity Type</span>
            <span className="metric-value">{selectedEntity.type}</span>
          </div>
        )}
      </div>

      <div className="section-title">Primary Reason</div>
      <div className="glass-box reason-box" style={{ marginBottom: 24 }}>
        <p className="reason-text" style={{ margin: 0 }}>{selectedEntity.reason}</p>
      </div>

      {isSafe ? (
        <div className="glass-box" style={{ borderLeft: '3px solid var(--conf-green)', marginBottom: 24 }}>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--conf-green)', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <ShieldCheck size={16} style={{ marginTop: 2, flexShrink: 0 }} />
            <span>This entity was evaluated by the AI and deliberately <strong>kept visible</strong>. The AI found no significant privacy risk associated with including it in the output.</span>
          </p>
        </div>
      ) : (
        <>
          <div className="section-title">Privacy Risk (If leaked)</div>
          <div className="glass-box risk-box" style={{ marginBottom: 24, borderLeft: '4px solid var(--red)' }}>
            <p className="risk-text" style={{ margin: 0, color: 'var(--red)' }}>{selectedEntity.privacy_risk}</p>
          </div>

          <div className="section-title">Supporting Evidence</div>
          <ul className="evidence-list glass-list">
            {(selectedEntity.evidence || []).map((ev, i) => (
              <li key={i} className="glass-list-item">{ev}</li>
            ))}
          </ul>
        </>
      )}

      <div className="cross-examination-section" style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border-glass)' }}>
        <button className="expand-btn glass-btn" onClick={() => setExpanded(!expanded)}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><HelpCircle size={18} /> AI Clinical Analysis</span>
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        <AnimatePresence>
          {expanded && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }} 
              animate={{ height: 'auto', opacity: 1 }} 
              exit={{ height: 0, opacity: 0 }}
              className="qna-list"
              style={{ overflow: 'hidden', marginTop: 16 }}
            >
              <div className="qna-item glass-box" style={{ marginBottom: 12 }}>
                <div className="q-text" style={{ color: 'var(--primary)', fontWeight: 600, marginBottom: 4 }}>Why was this {isSafe ? 'kept visible' : 'hidden'}?</div>
                <div className="a-text">{selectedEntity.reason}</div>
              </div>
              {!isSafe && (
                <div className="qna-item glass-box">
                  <div className="q-text" style={{ color: 'var(--primary)', fontWeight: 600, marginBottom: 4 }}>What if this stayed visible?</div>
                  <div className="a-text">It poses a direct risk of {selectedEntity.privacy_risk}.</div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function getConfidenceColor(conf) {
  if (conf >= 98) return 'var(--conf-green)';
  if (conf >= 90) return 'var(--conf-yellow)';
  if (conf >= 70) return 'var(--conf-orange)';
  return 'var(--conf-red)';
}
