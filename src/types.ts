export interface Milestone {
  id: number;
  date: string;
  title: string;
  description: string;
  imageEmoji: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  description: string;
}

export interface AppConfig {
  firstWorkDay: string;
  nextMeetingDate: string | null;
  whatsappNumber: string;
  whatsappText: string;
  developerEmail: string;
  timeline: Milestone[];
  hamburgChecklist: ChecklistItem[];
}
