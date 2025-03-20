
export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  message: string;
  detectedDate?: string;
  suggestedExpiry?: Date;
}
