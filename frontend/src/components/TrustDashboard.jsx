import React from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle, EyeOff } from 'lucide-react';

export default function TrustDashboard({ metrics }) {
  // metrics = { totalFound, hidden, reviewRequired, humanApproved, keptVisible, score }
  
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
        {(metrics.keptVisible ?? 0) > 0 && (
          <MetricCard icon={<CheckCircle color="var(--conf-green)" />} label="Kept Visible" value={metrics.keptVisible} />
        )}
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
