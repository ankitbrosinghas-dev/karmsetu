import React, { useState, useEffect, useRef } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  region?: string;
}

export const TOP_INDIAN_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', region: 'Default' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', region: 'Northern & Central India' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', region: 'West Bengal & Northeast' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', region: 'Maharashtra' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', region: 'Andhra Pradesh & Telangana' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', region: 'Tamil Nadu & Puducherry' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', region: 'Gujarat' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', region: 'Pan-India & Telangana/UP' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', region: 'Karnataka' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', region: 'Odisha' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', region: 'Punjab & Delhi NCR' },
];

declare global {
  interface Window {
    google?: any;
    googleTranslateElementInit?: () => void;
  }
}

export function LanguageSelector({ variant = 'header' }: { variant?: 'header' | 'landing' | 'compact' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<string>(() => {
    return localStorage.getItem('karmsetu_language') || 'en';
  });
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initialize Google Translate script
  useEffect(() => {
    if (!document.getElementById('google-translate-script')) {
      window.googleTranslateElementInit = () => {
        if (window.google?.translate?.TranslateElement) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: 'en',
              includedLanguages: 'en,hi,bn,mr,te,ta,gu,ur,kn,or,pa',
              autoDisplay: false,
              layout: window.google.translate.TranslateElement.InlineLayout?.SIMPLE,
            },
            'google_translate_element'
          );
        }
      };

      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.type = 'text/javascript';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Handle outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const changeLanguage = (langCode: string) => {
    setCurrentLang(langCode);
    localStorage.setItem('karmsetu_language', langCode);
    setIsOpen(false);
    setSearch('');

    // Set Google translate cookie
    const cookieValue = `/en/${langCode}`;
    document.cookie = `googtrans=${cookieValue}; path=/;`;
    document.cookie = `googtrans=${cookieValue}; domain=.${window.location.hostname}; path=/;`;
    if (window.location.hostname !== 'localhost') {
      const hostParts = window.location.hostname.split('.');
      if (hostParts.length > 1) {
        const rootDomain = hostParts.slice(-2).join('.');
        document.cookie = `googtrans=${cookieValue}; domain=.${rootDomain}; path=/;`;
      }
    }

    // Trigger select change in Google Translate widget if available
    const selectElem = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
    if (selectElem) {
      selectElem.value = langCode;
      selectElem.dispatchEvent(new Event('change'));
    } else {
      // Reload to apply if combo is not directly reactive
      window.location.reload();
    }
  };

  const selectedLangObj = TOP_INDIAN_LANGUAGES.find((l) => l.code === currentLang) || TOP_INDIAN_LANGUAGES[0];

  const filteredLanguages = TOP_INDIAN_LANGUAGES.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.nativeName.toLowerCase().includes(search.toLowerCase()) ||
      (l.region && l.region.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="notranslate" ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
      {/* Hidden container for Google Translate element */}
      <div id="google_translate_element" style={{ display: 'none' }} />

      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: variant === 'landing' ? '7px 14px' : '5px 10px',
          background: variant === 'landing' ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 4,
          color: '#FFFFFF',
          cursor: 'pointer',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: variant === 'landing' ? 11 : 10,
          letterSpacing: '0.06em',
          transition: 'all 0.2s cubic-bezier(0.16,1,0.3,1)',
          outline: 'none',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)';
          e.currentTarget.style.background = 'rgba(99,102,241,0.08)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
          e.currentTarget.style.background = variant === 'landing' ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.03)';
        }}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        title="Select Language / भाषा चुनें"
      >
        <Globe size={14} style={{ color: '#6366F1' }} />
        <span style={{ fontWeight: 400 }}>
          {selectedLangObj.nativeName}
          {selectedLangObj.code !== 'en' && (
            <span style={{ opacity: 0.65, fontSize: 9, marginLeft: 4 }}>({selectedLangObj.name})</span>
          )}
        </span>
        <ChevronDown
          size={12}
          style={{
            color: 'rgba(255,255,255,0.4)',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s',
          }}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            right: 0,
            width: 270,
            maxHeight: 380,
            background: '#0D0D11',
            border: '1px solid rgba(255,255,255,0.14)',
            borderRadius: 6,
            boxShadow: '0 16px 36px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.15)',
            zIndex: 99999,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '10px 12px 8px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              background: 'rgba(255,255,255,0.02)',
            }}
          >
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 9,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.4)',
                marginBottom: 6,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span>Indian Languages</span>
              <span style={{ color: '#6366F1' }}>Top 10</span>
            </div>
            <input
              type="text"
              placeholder="Search language / खोजें..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
              style={{
                width: '100%',
                background: '#141418',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 4,
                padding: '6px 9px',
                color: '#FFFFFF',
                fontSize: 11,
                fontFamily: "'Inter', sans-serif",
                outline: 'none',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(99,102,241,0.6)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
            />
          </div>

          {/* Languages List */}
          <div style={{ overflowY: 'auto', padding: '4px', flex: 1 }}>
            {filteredLanguages.map((lang) => {
              const isSelected = lang.code === currentLang;
              return (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    background: isSelected ? 'rgba(99,102,241,0.12)' : 'transparent',
                    border: 'none',
                    borderRadius: 4,
                    color: isSelected ? '#FFFFFF' : 'rgba(255,255,255,0.7)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s',
                    marginBottom: 2,
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                      e.currentTarget.style.color = '#FFFFFF';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                    }
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: isSelected ? 500 : 400 }}>{lang.nativeName}</span>
                      <span
                        style={{
                          fontSize: 11,
                          fontFamily: "'JetBrains Mono', monospace",
                          color: 'rgba(255,255,255,0.4)',
                        }}
                      >
                        {lang.name}
                      </span>
                    </div>
                    {lang.region && (
                      <span
                        style={{
                          fontSize: 9,
                          fontFamily: "'JetBrains Mono', monospace",
                          color: 'rgba(255,255,255,0.3)',
                          letterSpacing: '0.04em',
                        }}
                      >
                        {lang.region}
                      </span>
                    )}
                  </div>

                  {isSelected && <Check size={14} style={{ color: '#6366F1' }} />}
                </button>
              );
            })}
            {filteredLanguages.length === 0 && (
              <div
                style={{
                  padding: '16px 12px',
                  textAlign: 'center',
                  color: 'rgba(255,255,255,0.35)',
                  fontSize: 11,
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                No matching language found
              </div>
            )}
          </div>

          {/* Footer badge */}
          <div
            style={{
              padding: '6px 10px',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              background: 'rgba(0,0,0,0.3)',
              fontSize: 9,
              fontFamily: "'JetBrains Mono', monospace",
              color: 'rgba(255,255,255,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>Official Language Support</span>
            <span style={{ color: '#6366F1' }}>MoSPI &middot; ISS</span>
          </div>
        </div>
      )}
    </div>
  );
}
