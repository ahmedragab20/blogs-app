export interface Errors {
  code?: number;
  message?: string;
}

export interface FirestoreUser {
  uid: string;
  email?: string;
  displayName?: string;
  emailVerified?: boolean;
  photoURL?: string;
}

export interface Tag {
  name: string;
  category: string;
}

interface Reaction {
  icon: string;
  key: string;
  name: string;
}

interface BlogReaction extends Reaction {
  users: FirestoreUser[];
}
export interface Blog {
  blogId?: string;
  title: string;
  content: string;
  subtitle: string;
  createdAt: Date;
  tags: Tag[];
  reactions: BlogReaction[];
  updatedAt?: Date;
  user?: FirestoreUser;
  // attachments: string[]; TODO:: investigate adding it later
}

// types
export type AuthLand = 'login' | 'register' | 'forgot' | 'reset' | 'verify';
