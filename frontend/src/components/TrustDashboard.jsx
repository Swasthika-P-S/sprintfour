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

      <div className="privacy-risk-panel">
        <h4 className="section-title" style={{ marginTop: 24, marginBottom: 16 }}>Privacy Risk Exposure</h4>
        
        <div className="risk-columns">
          <div className="risk-column">
            <div className="risk-col-title">Before Redaction</div>
            <RiskMeter label="Identity Theft" level={9} color="var(--conf-red)" />
            <RiskMeter label="Financial Fraud" level={7} color="var(--conf-orange)" />
            <RiskMeter label="Medical Exposure" level={6} color="var(--conf-yellow)" />
          </div>
          
          <div className="risk-column">
            <div className="risk-col-title">After Redaction</div>
            <RiskMeter label="Identity Theft" level={1} color="var(--conf-green)" />
            <RiskMeter label="Financial Fraud" level={1} color="var(--conf-green)" />
            <RiskMeter label="Medical Exposure" level={1} color="var(--conf-green)" />
          </div>
        </div>
      </div>
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
