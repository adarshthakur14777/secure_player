export interface ActivityLog {
  id: string;
  linkId: string;
  activity: string;
  timestamp: Date;
}

export interface OneTimeLink {
  id: string;
  audioFileId: string;
  used: boolean;
  createdAt: Date;
}

export interface AudioFile {
  id: string;
  name: string;
  fileName: string;
  fileUrl: string; // In a real app, this would be a path to storage
  createdAt: Date;
  links: OneTimeLink[];
  activityLogs: ActivityLog[];
}
