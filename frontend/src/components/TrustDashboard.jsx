import React from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle, EyeOff } from 'lucide-react';

export default function TrustDashboard({ metrics }) {
  // metrics = { totalFound, hidden, reviewRequired, humanApproved, score }
  
  return (
    <div className="trust-dashboard">
      <div className="trust-score-header">
        <div>
          <h3 className="dashboard-title">Document Trust Score</h3>
          <p className="dashboard-subtitle">Based on AI confidence and coverage</p>
        </div>
        <div className="score-circle">
          {metrics.score}%
        </div>
      </div>

      <div className="metrics-grid">
        <MetricCard icon={<Shield color="var(--primary)" />} label="Sensitive Items" value={metrics.totalFound} />
        <MetricCard icon={<EyeOff color="var(--conf-green)" />} label="Hidden" value={metrics.hidden} />
        <MetricCard icon={<AlertTriangle color="var(--conf-orange)" />} label="Needs Review" value={metrics.reviewRequired} />
        <MetricCard icon={<CheckCircle color="var(--text-dark)" />} label="Human Approved" value={metrics.humanApproved} />
      </div>

      <div className="compliance-panel" style={{ marginTop: 32, padding: '24px 28px', background: 'var(--bg-muted)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
        <h4 className="section-title" style={{ marginBottom: 20 }}>Regulatory Compliance Readiness</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <ComplianceRow label="GDPR (Europe - Article 5/17)" status={metrics.score >= 90 ? 'Passed' : 'At Risk'} />
          <ComplianceRow label="HIPAA (Healthcare - Safe Harbor)" status={metrics.score >= 95 ? 'Passed' : 'At Risk'} />
          <ComplianceRow label="CCPA (California Privacy Rights)" status={metrics.score >= 85 ? 'Passed' : 'At Risk'} />
          <ComplianceRow label="PCI-DSS (Financial Data Protection)" status={metrics.score >= 98 ? 'Passed' : 'At Risk'} />
        </div>
      </div>
    </div>
  );
}

function ComplianceRow({ label, status }) {
  const isPassed = status === 'Passed';
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
      <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-dark)' }}>{label}</span>
      <span style={{ 
        fontSize: '0.75rem', 
        fontWeight: 800, 
        padding: '4px 12px', 
        borderRadius: 20,
        background: isPassed ? 'var(--conf-green-bg, rgba(46, 204, 113, 0.15))' : 'var(--conf-red-bg, rgba(231, 76, 60, 0.15))',
        color: isPassed ? 'var(--conf-green)' : 'var(--conf-red)',
        letterSpacing: '0.05em',
        textTransform: 'uppercase'
      }}>
        {status}
      </span>
    </div>
  );
}

function MetricCard({ icon, label, value }) {
  return (
    <div className="metric-card-mini">
      <div className="metric-icon-wrap">{icon}</div>
      <div className="metric-info">
        <span className="m-val">{value}</span>
        <span className="m-lab">{label}</span>
      </div>
    </div>
  );
}

function RiskMeter({ label, level, color }) {
  const blocks = Array.from({ length: 10 });
  return (
    <div className="risk-meter-row">
      <span className="risk-label">{label}</span>
      <div className="risk-blocks">
        {blocks.map((_, i) => (
          <div 
            key={i} 
            className="risk-block" 
            style={{ 
              background: i < level ? color : 'var(--border)',
              opacity: i < level ? 1 : 0.3
            }} 
          />
        ))}
      </div>
    </div>
  );
}
