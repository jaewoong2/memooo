export interface User {
  id: number;
  avatar: string;
  email: string;
  userName: string;
  provider?: 'email' | 'google';
}

export interface Image {
  id: number;
  imageUrl: string;
  name: string;
}
