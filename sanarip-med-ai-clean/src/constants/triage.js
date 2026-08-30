/**
 * Sanarip Med AI - Clinical Triage Standards & Color Codes
 * Based on Ministry of Health KR & MedElement emergency classifications
 */

export const TRIAGE_CODES = {
  RED: {
    code: 'RED',
    labelRu: 'КРАСНЫЙ (Экстренный вызов 103)',
    labelKg: 'КЫЗЫЛ (Тез жардам 103)',
    labelEn: 'RED (Emergency 103)',
    badgeClass: 'bg-rose-50 text-rose-600 border-rose-200/60',
    iconBg: 'bg-rose-500/10 text-rose-600',
    borderClass: 'border-rose-500/30'
  },
  YELLOW: {
    code: 'YELLOW',
    labelRu: 'ЖЕЛТЫЙ (Срочная консультация врача)',
    labelKg: 'САРЫ (Дарыгердин шашылыш кароосу)',
    labelEn: 'YELLOW (Urgent Doctor Consultation)',
    badgeClass: 'bg-amber-50 text-amber-600 border-amber-200/60',
    iconBg: 'bg-amber-500/10 text-amber-600',
    borderClass: 'border-amber-500/30'
  },
  GREEN: {
    code: 'GREEN',
    labelRu: 'ЗЕЛЕНЫЙ (Плановое обследование / Чекап)',
    labelKg: 'ЖАШЫЛ (Пландуу текшерүү / Чекап)',
    labelEn: 'GREEN (Routine Checkup / Labs)',
    badgeClass: 'bg-emerald-50 text-emerald-600 border-emerald-200/60',
    iconBg: 'bg-emerald-500/10 text-emerald-600',
    borderClass: 'border-emerald-500/30'
  }
};

export const DEFAULT_TRIAGE_CODE = 'GREEN';
