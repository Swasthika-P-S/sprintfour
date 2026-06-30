/**
 * Default seed data for Privacy Policy Templates.
 * Loaded into MongoDB once if the collection is empty.
 */
const DEFAULT_TEMPLATES = [
  {
    id: 'healthcare',
    label: 'Healthcare',
    icon: '🏥',
    description: 'For sharing with hospitals, clinics, insurance companies, or medical providers.',
    keep: [
      { label: 'Patient Name',    piiTypes: ['NAME'] },
      { label: 'Age',             piiTypes: ['DOB'] },
      { label: 'Gender',          piiTypes: [] },
      { label: 'Diagnosis',       piiTypes: [] },
      { label: 'Medical History', piiTypes: [] },
    ],
    review: [
      { label: 'Hospital Name', piiTypes: [] },
      { label: 'Doctor Name',   piiTypes: ['NAME'] },
    ],
    alwaysHide: [
      { label: 'Phone Number',  piiTypes: ['PHONE'] },
      { label: 'Email',         piiTypes: ['EMAIL'] },
      { label: 'Address',       piiTypes: ['ADDRESS'] },
      { label: 'Aadhaar',       piiTypes: ['AADHAAR'] },
      { label: 'Insurance ID',  piiTypes: [] },
      { label: 'Patient ID',    piiTypes: [] },
    ],
  },
  {
    id: 'education',
    label: 'Education',
    icon: '🎓',
    description: 'For academic institutions, transcript sharing, or student records.',
    keep: [
      { label: 'Student Name',     piiTypes: ['NAME'] },
      { label: 'Roll Number',      piiTypes: [] },
      { label: 'Register Number',  piiTypes: [] },
      { label: 'Department',       piiTypes: [] },
      { label: 'CGPA',             piiTypes: [] },
      { label: 'Phone Number',     piiTypes: ['PHONE'] },
      { label: 'Email',            piiTypes: ['EMAIL'] },
    ],
    review: [
      { label: 'Parent Name',  piiTypes: ['NAME'] },
      { label: 'College Name', piiTypes: [] },
    ],
    alwaysHide: [
      { label: 'Aadhaar',      piiTypes: ['AADHAAR'] },
      { label: 'PAN',          piiTypes: ['PAN'] },
      { label: 'Bank Details', piiTypes: ['IFSC'] },
      { label: 'Home Address', piiTypes: ['ADDRESS'] },
    ],
  },
  {
    id: 'hr',
    label: 'Job / HR',
    icon: '💼',
    description: 'For job applications, resumes, and HR recruitment pipelines.',
    keep: [
      { label: 'Name',       piiTypes: ['NAME'] },
      { label: 'Skills',     piiTypes: [] },
      { label: 'Experience', piiTypes: [] },
      { label: 'Education',  piiTypes: [] },
      { label: 'LinkedIn',   piiTypes: [] },
      { label: 'GitHub',     piiTypes: [] },
    ],
    review: [
      { label: 'Email', piiTypes: ['EMAIL'] },
    ],
    alwaysHide: [
      { label: 'Phone Number',  piiTypes: ['PHONE'] },
      { label: 'Address',       piiTypes: ['ADDRESS'] },
      { label: 'Aadhaar',       piiTypes: ['AADHAAR'] },
      { label: 'PAN',           piiTypes: ['PAN'] },
      { label: 'Bank Details',  piiTypes: ['IFSC'] },
      { label: 'Salary Details',piiTypes: [] },
    ],
  },
];

module.exports = DEFAULT_TEMPLATES;
