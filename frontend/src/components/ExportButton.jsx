import React from 'react';

export default function ExportButton({ redactedText, originalText, onSave, isSaving }) {
  const handleDownload = () => {
    if (!redactedText) return;
    const element = document.createElement("a");
    const file = new Blob([redactedText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "redacted_document.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleCopy = () => {
    if (!redactedText) return;
    navigator.clipboard.writeText(redactedText);
    alert("Copied redacted text to clipboard!");
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-icon">OUT</div>
        <div className="card-title">Redaction Output</div>
      </div>
      <div className="card-body">
        {redactedText ? (
          <div>
            <div className="redacted-preview" style={{ marginBottom: 16 }}>
              {redactedText}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                className="btn btn-outline"
                style={{ flex: 1 }}
                onClick={handleCopy}
                id="btn-copy-redacted"
              >
                Copy Text
              </button>
              <button
                className="btn btn-primary"
                style={{ flex: 1 }}
                onClick={handleDownload}
                id="btn-download-redacted"
              >
                Download .txt
              </button>
            </div>
            <div style={{ marginTop: 12 }}>
              <button
                className="btn btn-ghost btn-full"
                onClick={onSave}
                disabled={isSaving}
                id="btn-save-db"
              >
                {isSaving ? (
                  <>
                    <span className="spinner spinner-green" />
                    Saving Document...
                  </>
                ) : (
                  "Save to History"
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="empty-state" style={{ padding: '24px 12px' }}>
            <div className="empty-state-icon">LOCK</div>
            <h3>Ready for Redaction</h3>
            <p>Perform analysis and approve/reject items to generate the output.</p>
          </div>
        )}
      </div>
    </div>
  );
}
