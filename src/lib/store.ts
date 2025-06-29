'use client';
import type { AudioFile, OneTimeLink, ActivityLog } from '@/types';

type Listener = () => void;

const STORE_KEY = 'whisper_share_store';

class AppStore {
  private audioFiles: AudioFile[] = [];
  private listeners: Set<Listener> = new Set();

  constructor() {
    this.loadState();
  }

  private loadState(): void {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      const savedState = localStorage.getItem(STORE_KEY);
      if (savedState) {
        const parsed = JSON.parse(savedState);
        // Dates are stringified, need to convert them back
        this.audioFiles = parsed.map((file: any) => ({
          ...file,
          createdAt: new Date(file.createdAt),
          links: file.links.map((link: any) => ({
            ...link,
            createdAt: new Date(link.createdAt),
          })),
          activityLogs: file.activityLogs.map((log: any) => ({
            ...log,
            timestamp: new Date(log.timestamp),
          })),
        }));
      }
    } catch (error) {
      console.error("Failed to load state from localStorage", error);
      this.audioFiles = [];
    }
  }

  private saveState(): void {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(this.audioFiles));
    } catch (error) {
      console.error("Failed to save state to localStorage", error);
    }
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.saveState();
    this.listeners.forEach(listener => listener());
  }

  // --- Audio File Methods ---

  getAudioFiles(): AudioFile[] {
    return [...this.audioFiles].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getAudioFile(id: string): AudioFile | undefined {
    return this.audioFiles.find(file => file.id === id);
  }

  addAudioFile(name: string, fileName: string): void {
    const newFile: AudioFile = {
      id: crypto.randomUUID(),
      name,
      fileName,
      fileUrl: `/audio/${fileName}`, // Mock URL
      createdAt: new Date(),
      links: [],
      activityLogs: [],
    };
    this.audioFiles.push(newFile);
    this.notify();
  }

  deleteAudioFile(id: string): void {
    this.audioFiles = this.audioFiles.filter(file => file.id !== id);
    this.notify();
  }

  // --- Link Methods ---
  
  generateLinks(audioFileId: string, quantity: number): void {
    const file = this.getAudioFile(audioFileId);
    if (!file) return;

    for (let i = 0; i < quantity; i++) {
      const newLink: OneTimeLink = {
        id: crypto.randomUUID(),
        audioFileId,
        used: false,
        createdAt: new Date(),
      };
      file.links.push(newLink);
    }
    this.notify();
  }
  
  deleteLink(audioFileId: string, linkId: string): void {
    const file = this.getAudioFile(audioFileId);
    if (!file) return;
    file.links = file.links.filter(link => link.id !== linkId);
    this.notify();
  }

  getLink(linkId: string): { link: OneTimeLink; file: AudioFile } | undefined {
    for (const file of this.audioFiles) {
      const link = file.links.find(l => l.id === linkId);
      if (link) {
        return { link, file };
      }
    }
    return undefined;
  }
  
  useLink(linkId: string): void {
    const data = this.getLink(linkId);
    if (data && !data.link.used) {
      data.link.used = true;
      this.notify();
    }
  }

  // --- Activity Log Methods ---

  logActivity(linkId: string, activity: string): void {
    const data = this.getLink(linkId);
    if (!data) return;

    const newLog: ActivityLog = {
      id: crypto.randomUUID(),
      linkId,
      activity,
      timestamp: new Date(),
    };
    
    const file = this.getAudioFile(data.file.id);
    if(file) {
      file.activityLogs.push(newLog);
      this.notify();
    }
  }
}

// Singleton instance of the store
export const store = new AppStore();
