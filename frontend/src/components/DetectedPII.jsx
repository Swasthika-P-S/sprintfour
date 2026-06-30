import { useState } from 'react';

export default function DetectedPII({ entities, onEntityClick, selectedId }) {
  if (!entities || entities.length === 0) {
    return (
      <div className="card">
        <div className="card-header">
          <div className="card-icon">FIND</div>
          <div className="card-title">Detected PII</div>
        </div>
        <div className="card-body">
          <div className="empty-state" style={{ padding: '32px 12px' }}>
            <div className="empty-state-icon">LIST</div>
            <h3>Nothing detected</h3>
            <p>Analyze a document to see PII entities</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-icon">FIND</div>
        <div className="card-title">Detected PII</div>
        <span
          style={{
            marginLeft: 'auto',
            background: 'var(--green-light)',
            color: 'var(--green-dark)',
            borderRadius: '20px',
            padding: '2px 10px',
            fontSize: '0.8rem',
            fontWeight: 600,
          }}
        >
          {entities.length} found
        </span>
      </div>

      <div className="card-body" style={{ padding: '12px 16px' }}>
        {entities.map((entity) => (
          <EntityCard
            key={entity.id}
            entity={entity}
            isSelected={entity.id === selectedId}
            onClick={() => onEntityClick && onEntityClick(entity.id)}
          />
        ))}
      </div>
    </div>
  );
}

function EntityCard({ entity, isSelected, onClick }) {
  const [showReason, setShowReason] = useState(false);

  const confidenceClass =
    entity.confidence >= 90 ? 'high' : entity.confidence >= 70 ? 'medium' : 'low';

  return (
    <div
      className={`pii-entity-row ${entity.status} ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
      id={`entity-${entity.id}`}
    >
      <div className="entity-row-top">
        <span className="entity-text">"{entity.text}"</span>
        <span className={`badge badge-${entity.type}`}>{entity.type}</span>
      </div>

      <div className="confidence-bar-wrap">
        <div className="confidence-bar-track">
          <div
            className={`confidence-bar-fill ${confidenceClass}`}
            style={{ width: `${entity.confidence}%` }}
          />
        </div>
        <span className="confidence-label">{entity.confidence}%</span>
      </div>

      <div style={{ marginTop: 8, display: 'flex', gap: 6, alignItems: 'center' }}>
        <button
          className="btn btn-ghost btn-sm"
          style={{ fontSize: '0.74rem', padding: '3px 8px' }}
          onClick={(e) => {
            e.stopPropagation();
            setShowReason((v) => !v);
          }}
          id={`btn-why-${entity.id}`}
        >
          {showReason ? 'Hide' : 'Why?'}
        </button>
        {entity.status !== 'pending' && (
          <span
            style={{
              fontSize: '0.75rem',
              color:
                entity.status === 'accepted'
                  ? '#16a34a'
                  : entity.status === 'rejected'
                  ? '#dc2626'
                  : '#d97706',
              fontWeight: 600,
            }}
          >
            {entity.status === 'accepted' && 'Accepted'}
            {entity.status === 'rejected' && 'Rejected'}
            {entity.status === 'edited' && 'Edited'}
          </span>
        )}
      </div>

      <div className={`entity-reason ${showReason ? 'visible' : ''}`}>
        <strong>Detection reason:</strong> {entity.reason}
      </div>
    </div>
  );
}
