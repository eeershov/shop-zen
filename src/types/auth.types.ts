export interface LoginPayload {
  password: string;
  remember: boolean;
  username: string;
}

export interface AuthResponse {
  accessToken: string;
}
