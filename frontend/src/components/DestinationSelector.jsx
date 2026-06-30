import React from 'react';

const DESTINATIONS = [
  {
    id: 'chatgpt',
    icon: '🤖',
    label: 'AI / ChatGPT',
    desc: 'Sharing with an AI tool',
    keep: ['Skills', 'Work Experience', 'Education'],
    remove: ['Name', 'Phone', 'Email', 'Aadhaar', 'Address', 'DOB', 'PAN'],
  },
  {
    id: 'hr',
    icon: '👔',
    label: 'HR / Employer',
    desc: 'Job application or resume',
    keep: ['Name', 'Email', 'Skills', 'Education', 'Experience'],
    remove: ['Aadhaar', 'PAN', 'Passport No.', 'Bank Details'],
  },
  {
    id: 'public',
    icon: '🌐',
    label: 'Public Post',
    desc: 'Reddit, social media, etc.',
    keep: ['General context only'],
    remove: ['Name', 'Phone', 'Email', 'Address', 'Aadhaar', 'PAN', 'DOB', 'Location'],
  },
  {
    id: 'email',
    icon: '📧',
    label: 'Email / Colleague',
    desc: 'Professional communication',
    keep: ['Name', 'Email', 'Context'],
    remove: ['Aadhaar', 'PAN', 'Bank Details', 'Passport'],
  },
  {
    id: 'government',
    icon: '🏛️',
    label: 'Government / Bank',
    desc: 'Official submission',
    keep: ['All verified identity documents'],
    remove: ['Unrelated personal data'],
  },
  {
    id: 'medical',
    icon: '🏥',
    label: 'Medical Provider',
    desc: 'Hospital or insurance',
    keep: ['Name', 'DOB', 'Medical history'],
    remove: ['Financial data', 'Aadhaar (unless required)', 'Unrelated PII'],
  },
];

export { DESTINATIONS };

export default function DestinationSelector({ selected, onSelect }) {
  const dest = DESTINATIONS.find((d) => d.id === selected);

  return (
    <div>
      <div className="destination-grid">
        {DESTINATIONS.map((d) => (
          <button
            key={d.id}
            id={`dest-${d.id}`}
            className={`dest-card ${selected === d.id ? 'selected' : ''}`}
            onClick={() => onSelect(d.id === selected ? null : d.id)}
            type="button"
            aria-pressed={selected === d.id}
          >
            <div className="dest-icon">{d.icon}</div>
            <div className="dest-label">{d.label}</div>
            <div className="dest-desc">{d.desc}</div>
          </button>
        ))}
      </div>

      {dest && (
        <div className="recommendation-box" key={dest.id}>
          <div className="recommendation-title">
            {dest.icon} Recommendations for {dest.label}
          </div>
          <div className="rec-keep">
            <div className="rec-label">✓ Keep</div>
            {dest.keep.map((item) => (
              <div key={item} className="rec-item">
                <span style={{ color: 'var(--green-primary)' }}>✓</span> {item}
              </div>
            ))}
          </div>
          <div className="rec-remove">
            <div className="rec-label">✕ Remove</div>
            {dest.remove.map((item) => (
              <div key={item} className="rec-item">
                <span style={{ color: 'var(--red)' }}>✕</span> {item}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
