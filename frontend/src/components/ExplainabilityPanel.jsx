import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, ShieldCheck, ChevronDown, ChevronUp, Info, HelpCircle } from 'lucide-react';

export default function ExplainabilityPanel({ selectedEntity }) {
  const [expanded, setExpanded] = useState(false);

  if (!selectedEntity) {
    return (
      <div className="empty-panel-state">
        <Info size={32} color="var(--text-faint)" />
        <p>Select any highlighted word in the document to inspect the AI's decision process.</p>
      </div>
    );
  }

  const isSafe = selectedEntity.isSafe;
  const confColor = getConfidenceColor(selectedEntity.confidence);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      key={selectedEntity.startIndex} // Re-animate when selection changes
      className="explainability-card"
    >
      <div className="card-header">
        {isSafe ? <ShieldCheck size={28} color="var(--conf-green)" /> : <ShieldAlert size={28} color="var(--conf-red)" />}
        <div>
          <div className="entity-text">{selectedEntity.text}</div>
          <div className="decision-badge" style={{ background: isSafe ? 'var(--conf-green-bg)' : 'var(--conf-red-bg)', color: isSafe ? 'var(--conf-green)' : 'var(--conf-red)' }}>
            Decision: {isSafe ? 'VISIBLE' : 'HIDDEN'}
          </div>
        </div>
      </div>

      <div className="metric-row">
        <div className="metric-box">
          <span className="metric-label">Confidence</span>
          <span className="metric-value" style={{ color: confColor }}>{selectedEntity.confidence}%</span>
        </div>
        {!isSafe && selectedEntity.type && (
          <div className="metric-box">
            <span className="metric-label">Entity Type</span>
            <span className="metric-value">{selectedEntity.type}</span>
          </div>
        )}
      </div>

      <div className="section-title">Primary Reason</div>
      <p className="reason-text">{selectedEntity.reason}</p>

      {!isSafe && (
        <>
          <div className="section-title">Privacy Risk (If leaked)</div>
          <p className="risk-text">{selectedEntity.privacy_risk}</p>

          <div className="section-title">Supporting Evidence</div>
          <ul className="evidence-list">
            {(selectedEntity.evidence || []).map((ev, i) => (
              <li key={i}>{ev}</li>
            ))}
          </ul>
        </>
      )}

      <div className="cross-examination-section">
        <button className="expand-btn" onClick={() => setExpanded(!expanded)}>
          <HelpCircle size={16} /> AI Cross Examination
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        <AnimatePresence>
          {expanded && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }} 
              animate={{ height: 'auto', opacity: 1 }} 
              exit={{ height: 0, opacity: 0 }}
              className="qna-list"
            >
              <div className="qna-item">
                <div className="q-text">Why was this {isSafe ? 'kept visible' : 'hidden'}?</div>
                <div className="a-text">{selectedEntity.reason}</div>
              </div>
              {!isSafe && (
                <div className="qna-item">
                  <div className="q-text">What if this stayed visible?</div>
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
