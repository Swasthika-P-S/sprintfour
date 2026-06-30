import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ta', label: 'தமிழ்',   flag: '🇮🇳' },
  { code: 'hi', label: 'हिन्दी',    flag: '🇮🇳' },
];

// Full UI translations
export const T = {
  en: {
    // Navbar
    navAnalyze:     'Analyze',
    navHistory:     'History',
    navSignIn:      'Sign In',
    navGetStarted:  'Get Started',
    navSignOut:     'Sign Out',
    navMinor:       'Minor Account',
    // Home Hero
    heroTitle:      'AI Privacy',
    heroHighlight:  'Copilot',
    heroSub:        'Upload or paste any document. VEILiq will detect sensitive information and help you share safely.',
    // Input Tabs
    tabPaste:       'Paste Text',
    tabUpload:      'Upload File',
    btnAnalyze:     '🔍 Analyze Document',
    btnAnalyzing:   'Analyzing...',
    // Context selector
    labelContext:   'Intended Sharing Context',
    // Document Preview
    docPreview:     '📄 Document Preview',
    btnRedactAll:   'Redact All',
    btnClear:       'Clear',
    btnHideWord:    'Hide Word',
    placeholderHide:'Manual redact (e.g. neelambur)',
    viewOriginal:   'Original',
    viewTranslated: 'Translated',
    btnCopy:        'Copy',
    btnDownload:    'Download',
    btnSimulate:    'Simulate Privacy Risk',
    btnSimulating:  'Simulating...',
    btnSave:        'Save to History',
    btnSaving:      'Saving...',
    btnCertificate: 'Privacy Certificate',
    // Score
    scoreTitle:     'Privacy Score',
    recsTitle:      'Recommendations for',
    detectedPII:    'Detected PII',
    noPII:          'No sensitive information detected.',
    // Policy
    policyTitle:    '📋 Privacy Policy Templates',
    policySub:      'Choose a context to load predefined rules for which PII fields to keep, review, or always hide.',
    policyView:     'View →',
    policyApply:    '✓ Apply Policy',
    policyCancel:   'Cancel',
    tabKeep:        'Keep',
    tabReview:      'Review',
    tabAlwaysHide:  'Always Hide',
    policyWarning:  'Clicking "Apply Policy" will automatically redact all detected PII matching the Always Hide categories.',
    noFields:       'No fields in this category.',
  },
  ta: {
    navAnalyze:     'ஆய்வு',
    navHistory:     'வரலாறு',
    navSignIn:      'உள்நுழைவு',
    navGetStarted:  'தொடங்கு',
    navSignOut:     'வெளியேறு',
    navMinor:       'சிறார் கணக்கு',
    heroTitle:      'AI தனியுரிமை',
    heroHighlight:  'உதவியாளர்',
    heroSub:        'உங்கள் ஆவணத்தை பதிவேற்றவும் அல்லது ஒட்டவும். VEILiq தனிப்பட்ட தகவல்களை கண்டறிந்து பாதுகாப்பாக பகிர உதவும்.',
    tabPaste:       'உரையை ஒட்டு',
    tabUpload:      'கோப்பை பதிவேற்று',
    btnAnalyze:     '🔍 ஆவணத்தை பகுப்பாய்வு செய்',
    btnAnalyzing:   'பகுப்பாய்வு செய்கிறது...',
    labelContext:   'பகிர்வு சூழல் தேர்ந்தெடு',
    docPreview:     '📄 ஆவண முன்னோட்டம்',
    btnRedactAll:   'அனைத்தையும் மறை',
    btnClear:       'அழி',
    btnHideWord:    'சொல்லை மறை',
    placeholderHide:'கைமுறை மறைப்பு (எ.கா. நெல்லம்பூர்)',
    viewOriginal:   'அசல்',
    viewTranslated: 'மொழிபெயர்ப்பு',
    btnCopy:        'நகலெடு',
    btnDownload:    'பதிவிறக்கு',
    btnSimulate:    'தனியுரிமை அபாயத்தை உருவகப்படுத்து',
    btnSimulating:  'உருவகப்படுத்துகிறது...',
    btnSave:        'வரலாற்றில் சேமி',
    btnSaving:      'சேமிக்கிறது...',
    btnCertificate: 'தனியுரிமை சான்றிதழ்',
    scoreTitle:     'தனியுரிமை மதிப்பெண்',
    recsTitle:      'பரிந்துரைகள்',
    detectedPII:    'கண்டறியப்பட்ட PII',
    noPII:          'எந்த முக்கியமான தகவலும் கண்டறியப்படவில்லை.',
    policyTitle:    '📋 தனியுரிமை கொள்கை வார்ப்புரு',
    policySub:      'எந்த PII புலங்களை வைக்க, மதிப்பாய்வு செய்ய அல்லது மறைக்க வேண்டும் என்பதை தேர்ந்தெடுக்கவும்.',
    policyView:     'காண்க →',
    policyApply:    '✓ கொள்கையை பயன்படுத்து',
    policyCancel:   'ரத்து செய்',
    tabKeep:        'வை',
    tabReview:      'மதிப்பாய்வு',
    tabAlwaysHide:  'எப்போதும் மறை',
    policyWarning:  '"கொள்கையை பயன்படுத்து" என்பதை கிளிக் செய்வதால் "எப்போதும் மறை" பிரிவில் உள்ள PII தானாகவே மறைக்கப்படும்.',
    noFields:       'இந்த பிரிவில் புலங்கள் எதுவும் இல்லை.',
  },
  hi: {
    navAnalyze:     'विश्लेषण',
    navHistory:     'इतिहास',
    navSignIn:      'साइन इन',
    navGetStarted:  'शुरू करें',
    navSignOut:     'साइन आउट',
    navMinor:       'नाबालिग खाता',
    heroTitle:      'AI गोपनीयता',
    heroHighlight:  'सहायक',
    heroSub:        'अपना दस्तावेज़ अपलोड या पेस्ट करें। VEILiq संवेदनशील जानकारी पहचानकर आपको सुरक्षित साझा करने में मदद करेगा।',
    tabPaste:       'टेक्स्ट पेस्ट करें',
    tabUpload:      'फ़ाइल अपलोड करें',
    btnAnalyze:     '🔍 दस्तावेज़ का विश्लेषण करें',
    btnAnalyzing:   'विश्लेषण हो रहा है...',
    labelContext:   'साझाकरण संदर्भ चुनें',
    docPreview:     '📄 दस्तावेज़ पूर्वावलोकन',
    btnRedactAll:   'सभी छुपाएं',
    btnClear:       'साफ़ करें',
    btnHideWord:    'शब्द छुपाएं',
    placeholderHide:'मैन्युअल रिडैक्ट (जैसे neelambur)',
    viewOriginal:   'मूल',
    viewTranslated: 'अनुवादित',
    btnCopy:        'कॉपी करें',
    btnDownload:    'डाउनलोड करें',
    btnSimulate:    'गोपनीयता जोखिम सिमुलेट करें',
    btnSimulating:  'सिमुलेट हो रहा है...',
    btnSave:        'इतिहास में सहेजें',
    btnSaving:      'सहेज रहा है...',
    btnCertificate: 'गोपनीयता प्रमाणपत्र',
    scoreTitle:     'गोपनीयता स्कोर',
    recsTitle:      'अनुशंसाएं',
    detectedPII:    'पहचानी गई PII',
    noPII:          'कोई संवेदनशील जानकारी नहीं मिली।',
    policyTitle:    '📋 गोपनीयता नीति टेम्पलेट',
    policySub:      'चुनें कि कौन से PII फ़ील्ड रखने, समीक्षा करने या हमेशा छुपाने हैं।',
    policyView:     'देखें →',
    policyApply:    '✓ नीति लागू करें',
    policyCancel:   'रद्द करें',
    tabKeep:        'रखें',
    tabReview:      'समीक्षा',
    tabAlwaysHide:  'हमेशा छुपाएं',
    policyWarning:  '"नीति लागू करें" क्लिक करने पर "हमेशा छुपाएं" श्रेणी की सभी PII स्वतः रिडैक्ट हो जाएगी।',
    noFields:       'इस श्रेणी में कोई फ़ील्ड नहीं है।',
  },
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('veiliq-lang') || 'en');

  const setLanguage = (code) => {
    setLang(code);
    localStorage.setItem('veiliq-lang', code);
  };

  const t = T[lang] || T.en;

  return (
    <LanguageContext.Provider value={{ lang, setLanguage, t, LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
