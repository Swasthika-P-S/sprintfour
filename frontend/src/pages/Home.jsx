import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FileUpload from '../components/FileUpload';
import PrivacyScore, { computePrivacyScore } from '../components/PrivacyScore';
import PrivacyCertificate from '../components/PrivacyCertificate';
import PrivacySimulation from '../components/PrivacySimulation';
import ContextSelector, { CONTEXTS } from '../components/ContextSelector';
import Timeline from '../components/Timeline';
import ExplainabilityPanel from '../components/ExplainabilityPanel';
import TrustDashboard from '../components/TrustDashboard';
import AuditReport from '../components/AuditReport';
import ReviewQueue from '../components/ReviewQueue';

import { useAuth } from '../context/AuthContext';
import { useLanguage, LANGUAGES } from '../context/LanguageContext';

const API = import.meta.env.PROD ? '/api' : 'http://localhost:5000/api';

function Toast({ toasts }) {
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type}`}>
          <span className="toast-icon">
            {t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : 'ℹ'}
          </span>
          {t.message}
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const { token } = useAuth();
  const { lang, t } = useLanguage();
  const langName = LANGUAGES.find(l => l.code === lang)?.label || 'English';

  const [text, setText] = useState('');
  const [fileName, setFileName] = useState('');

  const [entities, setEntities] = useState([]);
  const [redactedSet, setRedactedSet] = useState(new Set());
  const [ignoredSet, setIgnoredSet] = useState(new Set());
  
  // Processing States
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [timelineStep, setTimelineStep] = useState(-1);

  // Translation & Simulation
  const [translatedText, setTranslatedText] = useState(null);
  const [viewMode, setViewMode] = useState('original');
  const [simulationResult, setSimulationResult] = useState(null);
  const [simulating, setSimulating] = useState(false);

  const [context, setContext] = useState('healthcare');
  const [showCertificate, setShowCertificate] = useState(false);
  const [toasts, setToasts] = useState([]);

  // New Explainability State
  const [selectedEntity, setSelectedEntity] = useState(null);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  };

  const handleFileResult = (data) => {
    setText(data.text);
    setFileName(data.filename);
    setEntities([]);
    setRedactedSet(new Set());
    setIgnoredSet(new Set());
    setSelectedEntity(null);
    setAnalyzed(false);
    
    // Start Timeline Animation
    setTimelineStep(0);
    setTimeout(() => setTimelineStep(1), 800);
    setTimeout(() => setTimelineStep(2), 1600);
    setTimeout(() => setTimelineStep(3), 2400);
    
    // Actually hit the API in the background while animating
    processTextWithAI(data.text);
  };

  const processTextWithAI = async (docText) => {
    try {
      const { data } = await axios.post(
        `${API}/analyze`,
        { text: docText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setTimeout(() => {
        setTimelineStep(4);
        setTimeout(() => {
          setEntities(data.entities || []);
          setAnalyzed(true);
          setTimelineStep(-1);
          addToast(`Analysis complete. Click any highlighted entity to inspect AI reasoning.`);
        }, 800);
      }, 1500); // Pad delay for smooth animation

    } catch (err) {
      setTimelineStep(-1);
      addToast(err.response?.data?.error || 'Analysis failed.', 'error');
    }
  };

  const toggleRedact = (idx) => {
    setRedactedSet((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
    setIgnoredSet((prev) => {
      const next = new Set(prev);
      next.delete(idx);
      return next;
    });
    if (selectedEntity?.idx === idx) {
       setSelectedEntity(prev => ({ ...prev, isRedacted: !redactedSet.has(idx) }));
    }
  };

  const toggleIgnore = (idx) => {
    setIgnoredSet((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
    setRedactedSet((prev) => {
      const next = new Set(prev);
      next.delete(idx);
      return next;
    });
    if (selectedEntity?.idx === idx) {
       setSelectedEntity(prev => ({ ...prev, isRedacted: false }));
    }
  };

  const redactAll = () => {
    const newRedacted = new Set();
    entities.forEach((_, i) => {
      if (!ignoredSet.has(i)) newRedacted.add(i);
    });
    setRedactedSet(newRedacted);
  };

  const clearAll = () => {
    setRedactedSet(new Set());
    setIgnoredSet(new Set());
  };

  const handleEntityClick = (seg) => {
    setSelectedEntity(seg);
  };

  const buildDocSegments = () => {
    if (!entities.length) return [{ text, idx: null }];
    
    let combined = [...entities].map((e, idx) => ({ ...e, idx, isSafe: false }));
    
    const sorted = combined.sort((a, b) => (a.startIndex ?? a.start ?? 0) - (b.startIndex ?? b.start ?? 0));
    const nonOverlapping = [];
    let lastEnd = -1;
    for (const e of sorted) {
       const s = e.startIndex ?? e.start ?? 0;
       const en = e.endIndex ?? e.end ?? 0;
       if (s >= lastEnd) {
         nonOverlapping.push(e);
         lastEnd = en;
       }
    }

    const segments = [];
    let cursor = 0;
    for (const e of nonOverlapping) {
      const s = e.startIndex ?? e.start ?? 0;
      const en = e.endIndex ?? e.end ?? 0;
      if (s > cursor) {
        segments.push({ text: text.slice(cursor, s), idx: null });
      }
      segments.push({
        text: text.slice(s, en),
        idx: e.idx,
        isRedacted: redactedSet.has(e.idx),
        type: e.type,
        reason: e.reason,
        confidence: e.confidence,
        evidence: e.evidence,
        privacy_risk: e.privacy_risk,
        replacement: e.replacement
      });
      cursor = en;
    }
    if (cursor < text.length) segments.push({ text: text.slice(cursor), idx: null });
    return segments;
  };

  function getConfidenceColor(conf) {
    if (conf >= 98) return 'var(--conf-green)';
    if (conf >= 90) return 'var(--conf-yellow)';
    if (conf >= 70) return 'var(--conf-orange)';
    return 'var(--conf-red)';
  }

  const generateRedactedText = () => {
    return buildDocSegments().map(seg => {
      if (seg.isRedacted) return seg.replacement || `[${seg.type}]`;
      return seg.text;
    }).join('');
  };

  const handleDownloadTXT = () => {
    const content = generateRedactedText();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `redacted_document_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadJSON = () => {
    const data = {
      original: text,
      redacted: generateRedactedText(),
      entities_hidden: entities.filter((_, i) => redactedSet.has(i)).map(e => ({ text: e.text, type: e.type, replacement: e.replacement }))
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `redacted_data_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Toast toasts={toasts} />
      <div className="page-wrapper">
        {!analyzed && timelineStep === -1 && (
          <div className="landing-hero-section">
            <h1 className="landing-title">Trust No Box. Inspect Every Decision.</h1>
            <p className="landing-subtitle">Upload a confidential document and inspect every AI decision before downloading. No hidden decisions.</p>
            <FileUpload onResult={handleFileResult} onError={(msg) => addToast(msg, 'error')} />
          </div>
        )}

        {timelineStep !== -1 && (
          <Timeline 
            currentStep={timelineStep} 
            steps={[
              { id: 'upload', label: 'Document Uploaded Securely' },
              { id: 'ocr', label: 'Extracting Text Context' },
              { id: 'detect', label: 'Deep Scanning for Sensitive Entities' },
              { id: 'eval', label: 'Calculating Confidence & Explanations' },
              { id: 'rules', label: 'Generating Privacy Evidence' }
            ]} 
          />
        )}

        {analyzed && text && (
          <div className="split-layout">
            <div className="split-left">
              <div className="card doc-card">
                <div className="card-header doc-header">
                  <div className="card-title">Document Inspection</div>
                  <div className="doc-controls">
                    {[...new Set(entities.map(e => e.type))].map(type => (
                      <button key={type} className="btn btn-outline btn-sm" onClick={() => {
                        const newRedacted = new Set(redactedSet);
                        entities.forEach((e, i) => {
                          if (e.type === type && !ignoredSet.has(i)) newRedacted.add(i);
                        });
                        setRedactedSet(newRedacted);
                      }}>
                        Hide {type}
                      </button>
                    ))}
                    <div className="divider"></div>
                    <button className="btn btn-secondary btn-sm" onClick={redactAll}>Hide All PII</button>
                    <button className="btn btn-ghost btn-sm" onClick={clearAll}>Keep All</button>
                    <div className="divider"></div>
                    <button className="btn btn-primary btn-sm" onClick={handleDownloadTXT}>Save TXT</button>
                    <button className="btn btn-primary btn-sm" onClick={handleDownloadJSON}>Save JSON</button>
                  </div>
                </div>
                <div className="card-body">
                  <div className="doc-viewer premium-viewer">
                    {buildDocSegments().map((seg, i) => {
                      if (seg.idx === null && !seg.isSafe) {
                        return <span key={i}>{seg.text}</span>;
                      }
                      
                      const isSelected = selectedEntity?.text === seg.text && selectedEntity?.idx === seg.idx;
                      const confColor = getConfidenceColor(seg.confidence);
                      
                      return (
                        <mark
                          key={i}
                          title={seg.reason}
                          className={`entity-mark ${seg.isRedacted ? 'redacted' : ''} ${isSelected ? 'selected' : ''}`}
                          style={{ borderBottom: `2px solid ${confColor}` }}
                          onClick={() => handleEntityClick(seg)}
                        >
                          {seg.isRedacted ? (seg.replacement || `[${seg.type}]`) : seg.text}
                        </mark>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="split-right">
              <TrustDashboard metrics={{
                totalFound: entities.length,
                hidden: redactedSet.size,
                reviewRequired: entities.filter(e => e.confidence < 90).length,
                humanApproved: ignoredSet.size,
                score: computePrivacyScore(entities.filter((_, i) => !redactedSet.has(i)), context)
              }} />

              <ReviewQueue 
                entities={entities} 
                redactedSet={redactedSet} 
                ignoredSet={ignoredSet}
                onToggleRedact={toggleRedact}
                onToggleIgnore={toggleIgnore}
                onSelect={handleEntityClick}
              />

              <ExplainabilityPanel selectedEntity={selectedEntity} />

              {selectedEntity && !selectedEntity.isSafe && (
                <div className="action-buttons-panel">
                  <button className="btn btn-outline" onClick={() => toggleIgnore(selectedEntity.idx)}>
                    Keep Visible
                  </button>
                  <button className="btn btn-primary" onClick={() => toggleRedact(selectedEntity.idx)}>
                    {selectedEntity.isRedacted ? 'Un-Hide' : 'Hide Anyway'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {analyzed && text && (
          <AuditReport entities={entities} safeEntities={[]} />
        )}
      </div>
    </>
  );
}
