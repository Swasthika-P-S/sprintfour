import { useState } from 'react';

export default function ReviewPanel({ entities, onAccept, onReject, onEdit, onAdd, text }) {
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [addMode, setAddMode] = useState(false);
  const [addForm, setAddForm] = useState({ text: '', type: 'CUSTOM' });

  const pending  = entities.filter((e) => e.status === 'pending');
  const accepted = entities.filter((e) => e.status === 'accepted');
  const rejected = entities.filter((e) => e.status === 'rejected');
  const edited   = entities.filter((e) => e.status === 'edited');

  const handleEditSave = (id) => {
    if (editValue.trim()) {
      onEdit(id, editValue.trim());
    }
    setEditingId(null);
    setEditValue('');
  };

  const handleAddSubmit = () => {
    if (addForm.text.trim()) {
      onAdd({ text: addForm.text.trim(), type: addForm.type });
      setAddForm({ text: '', type: 'CUSTOM' });
      setAddMode(false);
    }
  };

  if (!entities || entities.length === 0) {
    return (
      <div className="card">
        <div className="card-header">
          <div className="card-icon">REV</div>
          <div className="card-title">Review Panel</div>
        </div>
        <div className="card-body">
          <div className="empty-state" style={{ padding: '24px 12px' }}>
            <div className="empty-state-icon">REV</div>
            <h3>No entities to review</h3>
            <p>Run the analyzer first</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-icon">REV</div>
        <div className="card-title">Review Panel</div>
        <button
          className="btn btn-outline btn-sm"
          style={{ marginLeft: 'auto' }}
          onClick={() => setAddMode((v) => !v)}
          id="btn-add-pii"
        >
          + Add
        </button>
      </div>

      {/* Add Custom PII Form */}
      {addMode && (
        <div
          style={{
            padding: '12px 16px',
            background: 'var(--green-light)',
            borderBottom: '1px solid var(--border-light)',
          }}
        >
          <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: 8 }}>
            Add Missing PII
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <input
              className="edit-input"
              style={{ flex: 2, minWidth: 120 }}
              placeholder="Text to flag..."
              value={addForm.text}
              onChange={(e) => setAddForm((f) => ({ ...f, text: e.target.value }))}
              id="add-pii-text"
            />
            <select
              className="edit-input"
              style={{ flex: 1, minWidth: 100 }}
              value={addForm.type}
              onChange={(e) => setAddForm((f) => ({ ...f, type: e.target.value }))}
              id="add-pii-type"
            >
              {['NAME','PHONE','EMAIL','PAN','AADHAAR','ADDRESS','ORG','CUSTOM'].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <button className="btn btn-primary btn-sm" onClick={handleAddSubmit} id="btn-add-submit">
              Add
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => setAddMode(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="card-body" style={{ padding: '12px 16px', maxHeight: 480, overflowY: 'auto' }}>
        {/* Pending */}
        {pending.length > 0 && (
          <SectionLabel label="Pending Review" count={pending.length} color="var(--text-muted)" />
        )}
        {pending.map((e) => (
          <ReviewRow
            key={e.id}
            entity={e}
            editingId={editingId}
            editValue={editValue}
            setEditingId={setEditingId}
            setEditValue={setEditValue}
            onAccept={onAccept}
            onReject={onReject}
            handleEditSave={handleEditSave}
          />
        ))}

        {/* Accepted */}
        {accepted.length > 0 && (
          <>
            <div className="divider" />
            <SectionLabel label="Accepted" count={accepted.length} color="#16a34a" />
          </>
        )}
        {accepted.map((e) => (
          <ReviewRow
            key={e.id}
            entity={e}
            editingId={editingId}
            editValue={editValue}
            setEditingId={setEditingId}
            setEditValue={setEditValue}
            onAccept={onAccept}
            onReject={onReject}
            handleEditSave={handleEditSave}
          />
        ))}

        {/* Edited */}
        {edited.length > 0 && (
          <>
            <div className="divider" />
            <SectionLabel label="Edited" count={edited.length} color="#d97706" />
          </>
        )}
        {edited.map((e) => (
          <ReviewRow
            key={e.id}
            entity={e}
            editingId={editingId}
            editValue={editValue}
            setEditingId={setEditingId}
            setEditValue={setEditValue}
            onAccept={onAccept}
            onReject={onReject}
            handleEditSave={handleEditSave}
          />
        ))}

        {/* Rejected */}
        {rejected.length > 0 && (
          <>
            <div className="divider" />
            <SectionLabel label="Rejected" count={rejected.length} color="#dc2626" />
          </>
        )}
        {rejected.map((e) => (
          <ReviewRow
            key={e.id}
            entity={e}
            editingId={editingId}
            editValue={editValue}
            setEditingId={setEditingId}
            setEditValue={setEditValue}
            onAccept={onAccept}
            onReject={onReject}
            handleEditSave={handleEditSave}
          />
        ))}
      </div>
    </div>
  );
}

function SectionLabel({ label, count, color }) {
  return (
    <div
      style={{
        fontSize: '0.75rem',
        fontWeight: 700,
        color,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        marginBottom: 8,
        marginTop: 4,
      }}
    >
      {label} ({count})
    </div>
  );
}

function ReviewRow({
  entity, editingId, editValue, setEditingId,
  setEditValue, onAccept, onReject, handleEditSave,
}) {
  const isEditing = editingId === entity.id;

  return (
    <div
      style={{
        padding: '10px 12px',
        borderRadius: 8,
        border: '1px solid var(--border-light)',
        marginBottom: 8,
        background: 'white',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 6,
          flexWrap: 'wrap',
        }}
      >
        <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-dark)' }}>
          {entity.text}
        </span>
        <span className={`badge badge-${entity.type}`}>{entity.type}</span>
      </div>

      {entity.replacement && (
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>
          → <code style={{ background: 'var(--green-light)', padding: '1px 6px', borderRadius: 4 }}>
            {entity.replacement}
          </code>
        </div>
      )}

      {(entity.reason || entity.confidence) && (
        <div style={{ fontSize: '0.72rem', color: 'var(--text-faint)', marginTop: 6, fontStyle: 'italic', background: 'var(--background)', padding: '4px 6px', borderRadius: 4 }}>
          💡 {entity.reason} {entity.confidence ? `(${entity.confidence}%)` : ''}
        </div>
      )}

      {isEditing ? (
        <div style={{ marginTop: 8, display: 'flex', gap: 6 }}>
          <input
            className="edit-input"
            style={{ flex: 1 }}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            placeholder="New replacement text..."
            onKeyDown={(e) => e.key === 'Enter' && handleEditSave(entity.id)}
            autoFocus
            id={`edit-input-${entity.id}`}
          />
          <button
            className="btn btn-primary btn-sm"
            onClick={() => handleEditSave(entity.id)}
          >
            Save
          </button>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setEditingId(null)}
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="entity-row-actions">
          {entity.status !== 'accepted' && (
            <button
              className="btn btn-sm"
              style={{
                background: '#dcfce7',
                color: '#16a34a',
                border: '1px solid #bbf7d0',
              }}
              onClick={() => onAccept(entity.id)}
              id={`btn-accept-${entity.id}`}
            >
              Accept
            </button>
          )}
          {entity.status !== 'rejected' && (
            <button
              className="btn btn-danger btn-sm"
              onClick={() => onReject(entity.id)}
              id={`btn-reject-${entity.id}`}
            >
              Reject
            </button>
          )}
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => {
              setEditingId(entity.id);
              setEditValue(entity.replacement || entity.text);
            }}
            id={`btn-edit-${entity.id}`}
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
}
