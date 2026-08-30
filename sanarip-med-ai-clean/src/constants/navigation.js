/**
 * Sanarip Med AI - Navigation Configuration
 */

export const NAV_ITEMS = [
  { id: 'home', href: '#top', labelKey: 'nav.home', delay: 2.7 },
  { id: 'problems', href: '#problems', labelKey: 'nav.problems', delay: 2.8 },
  { id: 'ai-chat', href: '#ai-chat', labelKey: 'nav.aiChat', delay: 2.9 },
  { id: 'ai-vision', href: '#ai-vision', labelKey: 'nav.aiVision', delay: 3.0 },
  { id: 'rag-security', href: '#rag-security', labelKey: 'nav.rag', delay: 3.1 },
  { id: 'integration', href: '#integration', labelKey: 'nav.integration', delay: 3.2 },
  { id: 'partnership', href: '#partnership', labelKey: 'nav.partnership', delay: 3.35 }
];

export const SECTION_ORDER = [
  'partnership',
  'integration',
  'rag-security',
  'ai-vision',
  'ai-chat',
  'problems'
];
