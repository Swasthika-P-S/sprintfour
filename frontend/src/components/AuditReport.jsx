import React from 'react';
import { Download, FileText } from 'lucide-react';

export default function AuditReport({ entities, safeEntities }) {
  const allItems = [
    ...entities.map(e => ({ ...e, finalAction: e.isRedacted ? 'Hidden' : 'Visible' })),
    ...safeEntities.map(e => ({ ...e, type: 'SAFE', confidence: e.confidence || 100, finalAction: 'Visible (Safe)' }))
  ].sort((a, b) => a.startIndex - b.startIndex);

  const handleDownload = () => {
    let content = "VEILiq Privacy Audit Report\n";
    content += `Generated: ${new Date().toISOString()}\n\n`;
    content += "ENTITY | REASON | CONFIDENCE | EVIDENCE | FINAL ACTION\n";
    content += "--------------------------------------------------------\n";
    allItems.forEach(item => {
      content += `${item.text} | ${item.reason} | ${item.confidence}% | ${(item.evidence || []).join(', ')} | ${item.finalAction}\n`;
    });
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Privacy_Audit_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (allItems.length === 0) return null;

  return (
    <div className="audit-report-container">
      <div className="audit-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <FileText color="var(--primary)" />
          <h3 className="section-title" style={{ margin: 0 }}>Privacy Audit Log</h3>
        </div>
        <button className="btn-download-audit" onClick={handleDownload}>
          <Download size={16} /> Download Report
        </button>
      </div>

      <div className="audit-table-wrapper">
        <table className="audit-table">
          <thead>
            <tr>
              <th>Detected Entity</th>
              <th>AI Decision Reason</th>
              <th>Confidence</th>
              <th>Final Action</th>
            </tr>
          </thead>
          <tbody>
            {allItems.map((item, i) => (
              <tr key={i}>
                <td className="fw-600">{item.text}</td>
                <td>{item.reason}</td>
                <td>
                  <span className="conf-pill" style={{ color: getConfidenceColor(item.confidence) }}>
                    {item.confidence}%
                  </span>
                </td>
                <td>
                  <span className={`action-pill ${item.finalAction.includes('Hidden') ? 'hidden' : 'visible'}`}>
                    {item.finalAction}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function getConfidenceColor(conf) {
  if (conf >= 98) return 'var(--conf-green)';
  if (conf >= 90) return 'var(--conf-yellow)';
  if (conf >= 70) return 'var(--conf-orange)';
  return 'var(--conf-red)';
}
