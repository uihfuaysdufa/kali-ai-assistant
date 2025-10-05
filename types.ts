
export type PanelType = 'HOME' | 'CODE_CREATOR' | 'KALI' | 'TERMINAL';

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}
