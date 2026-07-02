import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ShieldAlert, ClipboardCheck, Loader2, CheckCircle2, XCircle, Info } from 'lucide-react';

const API = import.meta.env.PROD ? '/api' : 'http://localhost:5000/api';

export default function IntegrityVerifier({ originalText, redactedText, entities, redactedIndices, token }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const runCheck = async () => {
    setLoading(true);
    setError(null);
    setReport(null);
    try {
      const res = await fetch(`${API}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ originalText, redactedText, entities, redactedIndices })
      });
      const data = await res.json();
      setReport(data);
    } catch (e) {
      setError('Failed to run integrity check. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card" style={{ padding: 24, marginTop: 8 }}>
      <div className="glow-orb" style={{ background: 'var(--conf-green)', top: -30, right: -30, width: 100, height: 100 }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="icon-glass-wrapper" style={{ background: 'rgba(52,211,153,0.1)', color: 'var(--conf-green)', width: 40, height: 40 }}>
            <ClipboardCheck size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--text-dark)', fontSize: '0.95rem' }}>Redaction Integrity Verifier</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Verify no PII leaked through</div>
          </div>
        </div>
        <button
          className="glass-btn"
          style={{ width: 'auto', padding: '8px 16px', fontSize: '0.85rem' }}
          onClick={runCheck}
          disabled={loading}
        >
          {loading ? <><Loader2 size={14} className="spin-animation" /> Running…</> : 'Run Check'}
        </button>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ color: 'var(--conf-red)', fontSize: '0.85rem', padding: '8px 12px', background: 'var(--conf-red-bg)', borderRadius: 8 }}>
            {error}
          </motion.div>
        )}

        {report && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {/* Overall banner */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
              background: report.overallPass ? 'rgba(52,211,153,0.1)' : 'rgba(248,113,113,0.1)',
              border: `1px solid ${report.overallPass ? 'var(--conf-green)' : 'var(--conf-red)'}`,
              borderRadius: 10, marginBottom: 16
            }}>
              {report.overallPass
                ? <ShieldCheck size={22} color="var(--conf-green)" />
                : <ShieldAlert size={22} color="var(--conf-red)" />}
              <div>
                <div style={{ fontWeight: 700, color: report.overallPass ? 'var(--conf-green)' : 'var(--conf-red)', fontSize: '0.9rem' }}>
                  {report.overallPass ? '✅ Document is clean — all checks passed' : '❌ Issues detected — review failed checks'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Verified {new Date(report.checkedAt).toLocaleTimeString()}</div>
              </div>
            </div>

            {/* Individual checks */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {report.checks.map(check => (
                <div key={check.id} className="glass-box" style={{
                  display: 'flex', alignItems: 'flex-start', gap: 12,
                  borderLeft: `3px solid ${check.status === 'PASS' ? 'var(--conf-green)' : check.status === 'FAIL' ? 'var(--conf-red)' : 'var(--text-faint)'}`
                }}>
                  <div style={{ marginTop: 2 }}>
                    {check.status === 'PASS'
                      ? <CheckCircle2 size={16} color="var(--conf-green)" />
                      : check.status === 'FAIL'
                        ? <XCircle size={16} color="var(--conf-red)" />
                        : <Info size={16} color="var(--text-muted)" />}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-dark)', fontSize: '0.85rem', marginBottom: 2 }}>
                      Check {check.id}: {check.label}
                      <span style={{
                        marginLeft: 8, fontSize: '0.7rem', padding: '1px 6px', borderRadius: 10, fontWeight: 700,
                        background: check.status === 'PASS' ? 'var(--conf-green-bg)' : check.status === 'FAIL' ? 'var(--conf-red-bg)' : 'var(--bg-muted)',
                        color: check.status === 'PASS' ? 'var(--conf-green)' : check.status === 'FAIL' ? 'var(--conf-red)' : 'var(--text-muted)'
                      }}>{check.status}</span>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{check.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`.spin-animation { animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
