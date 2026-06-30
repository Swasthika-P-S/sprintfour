import { useState } from 'react';

const SAMPLE_TEXT = `Name: XYZ

We are writing to confirm your appointment on 25/06/2025.

Your registered mobile number: 9876543210
Email: xyz.patient@gmail.com

PAN: ABCDE1234F
Aadhaar: 1234 5678 9012

Please visit us at 42, MG Road, Bangalore, Karnataka - 560001.

Regards,
Doctor: ABC
City Health Clinic`;

export default function UploadBox({ onAnalyze, isLoading }) {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    if (text.trim()) onAnalyze(text.trim());
  };

  const handleSample = () => {
    setText(SAMPLE_TEXT);
  };

  return (
    <div className="upload-box card">
      <div className="card-header">
        <div className="card-icon">DOC</div>
        <div>
          <div className="card-title">Paste Your Document</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>
            Paste any text containing sensitive information
          </div>
        </div>
        <button
          className="btn btn-ghost btn-sm"
          style={{ marginLeft: 'auto' }}
          onClick={handleSample}
          id="btn-load-sample"
        >
          Load Sample
        </button>
      </div>

      <textarea
        className="upload-textarea"
        placeholder="Paste your document here...&#10;&#10;Example:&#10;Name: ABC&#10;Phone: 9876543210&#10;Email: abc@example.com"
        value={text}
        onChange={(e) => setText(e.target.value)}
        id="document-textarea"
      />

      <div className="upload-footer">
        <span className="char-count">
          {text.length.toLocaleString()} characters
          {text.length > 0 && ` · ~${text.split(/\s+/).filter(Boolean).length} words`}
        </span>
        <div style={{ display: 'flex', gap: 8 }}>
          {text.length > 0 && (
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setText('')}
              id="btn-clear-text"
            >
              Clear
            </button>
          )}
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={!text.trim() || isLoading}
            id="btn-analyze"
          >
            {isLoading ? (
              <>
                <span className="spinner" />
                Analyzing...
              </>
            ) : (
              <>Analyze</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
