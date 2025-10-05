
import { GoogleGenAI, Chat } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const chatSessions = new Map<string, Chat>();

export function getChatSession(panelId: string, systemInstruction: string): Chat {
  if (!chatSessions.has(panelId)) {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction,
      },
    });
    chatSessions.set(panelId, chat);
  }
  return chatSessions.get(panelId)!;
}
