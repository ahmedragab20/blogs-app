export interface Errors {
  code?: number;
  message?: string;
}

export type AuthLand = 'login' | 'register' | 'forgot' | 'reset' | 'verify';
