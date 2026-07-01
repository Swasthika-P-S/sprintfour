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
import AliasResolver from '../components/AliasResolver';

import { useAuth } from '../context/AuthContext';
import { useLanguage, LANGUAGES } from '../context/LanguageContext';
import { EyeOff, Eye, FileText, FileJson, ShieldAlert, ShieldCheck } from 'lucide-react';

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
  const [aliasSuggestions, setAliasSuggestions] = useState([]);

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
    setAliasSuggestions([]);
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
          setAliasSuggestions(data.suggested_aliases || []);
          setAnalyzed(true);
          setTimelineStep(-1);
          if (data.entities && data.entities.length > 0) {
            setSelectedEntity({ ...data.entities[0], idx: 0 });
          }
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

  const handleAliasConfirm = (idx, isSamePerson) => {
    const alias = aliasSuggestions[idx];
    const newSuggestions = [...aliasSuggestions];
    newSuggestions.splice(idx, 1);
    setAliasSuggestions(newSuggestions);

    // Escape regex string for safety
    const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const matches = [...text.matchAll(new RegExp(`\\b${escapeRegExp(alias.text)}\\b`, 'gi'))];
    const newEntities = [];
    
    let newReplacement = alias.proposed_replacement || '[PERSON-1]';
    if (!isSamePerson) {
       newReplacement = `[PERSON-X${Math.floor(Math.random()*100)}]`;
    }

    for (const m of matches) {
      const s = m.index;
      const e = m.index + alias.text.length;
      const overlaps = entities.some(ent => {
         const es = ent.start ?? ent.startIndex ?? 0;
         const ee = ent.end ?? ent.endIndex ?? 0;
         return (s >= es && s < ee) || (e > es && e <= ee) || (s <= es && e >= ee);
      });
      if (!overlaps) {
         newEntities.push({
           text: m[0],
           start: s,
           end: e,
           type: 'NAME',
           confidence: 85,
           reason: alias.reason || 'User confirmed alias.',
           privacy_risk: 'Identity Tracking',
           replacement: newReplacement
         });
      }
    }

    if (newEntities.length > 0) {
      setEntities(prev => {
        const updated = [...prev, ...newEntities];
        const newlyAddedIndices = Array.from({length: newEntities.length}, (_, i) => prev.length + i);
        setRedactedSet(rs => {
          const nextRs = new Set(rs);
          newlyAddedIndices.forEach(i => nextRs.add(i));
          return nextRs;
        });
        return updated;
      });
      addToast(`Found and redacted ${newEntities.length} occurrences of "${alias.text}".`);
    } else {
      addToast(`No additional unredacted occurrences of "${alias.text}" found.`);
    }
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
        ...e,
        text: text.slice(s, en),
        idx: e.idx,
        isRedacted: redactedSet.has(e.idx)
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
                  <div className="doc-controls" style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}>
                    
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-faint)', textTransform: 'uppercase', marginRight: 8 }}>Quick Filters:</span>
                      {[...new Set(entities.map(e => e.type))].map(type => (
                        <button key={type} className="btn-sm" style={{ 
                          background: 'var(--bg-muted)', color: 'var(--text-dark)', border: '1px solid var(--border)', borderRadius: 20,
                          padding: '4px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', transition: 'all 0.2s'
                        }} onClick={(e) => {
                          e.currentTarget.style.background = 'var(--primary-light)';
                          e.currentTarget.style.borderColor = 'var(--primary)';
                          e.currentTarget.style.color = 'var(--primary)';
                          const newRedacted = new Set(redactedSet);
                          entities.forEach((ent, i) => {
                            if (ent.type === type && !ignoredSet.has(i)) newRedacted.add(i);
                          });
                          setRedactedSet(newRedacted);
                          setTimeout(() => {
                            e.currentTarget.style.background = 'var(--bg-muted)';
                            e.currentTarget.style.borderColor = 'var(--border)';
                            e.currentTarget.style.color = 'var(--text-dark)';
                          }, 200);
                        }}>
                          <EyeOff size={14} /> Hide {type}
                        </button>
                      ))}
                    </div>
                    
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-muted)', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', gap: 12 }}>
                        <button className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px' }} onClick={redactAll}>
                          <ShieldAlert size={16} /> Hide All PII
                        </button>
                        <button className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px' }} onClick={clearAll}>
                          <Eye size={16} /> Keep All
                        </button>
                      </div>
                      
                      <div style={{ display: 'flex', gap: 12 }}>
                        <button className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px' }} onClick={handleDownloadTXT}>
                          <FileText size={16} /> Save TXT
                        </button>
                        <button className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px' }} onClick={handleDownloadJSON}>
                          <FileJson size={16} /> Save JSON
                        </button>
                      </div>
                    </div>
                    
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

              <AliasResolver 
                aliases={aliasSuggestions} 
                onResolve={handleAliasConfirm} 
              />

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
