/**
 * DocumentViewer – renders text with color-coded PII highlights.
 * Builds spans from entity positions in the text.
 */
export default function DocumentViewer({ text, entities, onEntityClick, selectedId }) {
  if (!text) {
    return (
      <div className="card">
        <div className="card-header">
          <div className="card-icon">TXT</div>
          <div className="card-title">Document Preview</div>
        </div>
        <div className="card-body">
          <div className="empty-state">
            <div className="empty-state-icon">PREVIEW</div>
            <h3>No document yet</h3>
            <p>Paste your document above and click Analyze</p>
          </div>
        </div>
      </div>
    );
  }

  // Build highlight segments
  const segments = buildSegments(text, entities);

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-icon">TXT</div>
        <div className="card-title">Document Preview</div>
        {entities.length > 0 && (
          <span
            style={{
              marginLeft: 'auto',
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
            }}
          >
            {entities.filter((e) => e.status !== 'rejected').length} highlighted
          </span>
        )}
      </div>

      {entities.length > 0 && <Legend entities={entities} />}

      <div className="card-body">
        <div className="document-viewer">
          {segments.map((seg, i) => {
            if (!seg.entity) {
              return <span key={i}>{seg.text}</span>;
            }
            const e = seg.entity;
            const isSelected = e.id === selectedId;
            const className = [
              'pii-mark',
              `pii-${e.type}`,
              e.status === 'rejected' ? 'rejected' : '',
              isSelected ? 'selected-mark' : '',
            ]
              .filter(Boolean)
              .join(' ');

            return (
              <mark
                key={i}
                className={className}
                onClick={() => onEntityClick && onEntityClick(e.id)}
                title={`${e.type} · ${e.confidence}% confidence`}
                style={isSelected ? { outline: '2px solid var(--green-primary)' } : {}}
              >
                {seg.text}
              </mark>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* Build flat array of {text, entity|null} segments */
function buildSegments(text, entities) {
  if (!entities || entities.length === 0) return [{ text, entity: null }];

  const segments = [];
  let cursor = 0;

  // Sort by start position
  const sorted = [...entities].sort((a, b) => a.startIndex - b.startIndex);

  for (const entity of sorted) {
    const { startIndex, endIndex } = entity;
    if (startIndex < cursor) continue; // overlapping, skip
    if (startIndex > cursor) {
      segments.push({ text: text.slice(cursor, startIndex), entity: null });
    }
    segments.push({ text: text.slice(startIndex, endIndex), entity });
    cursor = endIndex;
  }

  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor), entity: null });
  }

  return segments;
}

const TYPE_COLORS = {
  NAME:    '#e6c84a',
  PHONE:   '#e07070',
  EMAIL:   '#6699dd',
  PAN:     '#9966cc',
  AADHAAR: '#cc8833',
  ADDRESS: '#44bb77',
  ORG:     '#dd8844',
  IFSC:    '#7dd3fc',
  PINCODE: '#f9a8d4',
  DATE_OF_BIRTH: '#6ee7b7',
};

function Legend({ entities }) {
  const types = [...new Set(entities.map((e) => e.type))];
  return (
    <div className="legend" style={{ margin: '0 20px 0' }}>
      {types.map((type) => (
        <div key={type} className="legend-item">
          <div
            className="legend-dot"
            style={{ background: TYPE_COLORS[type] || '#999' }}
          />
          {type}
        </div>
      ))}
    </div>
  );
}
