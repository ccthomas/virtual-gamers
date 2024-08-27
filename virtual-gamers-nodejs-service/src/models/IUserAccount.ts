export interface IUserAccount {
  id: string;
  iconName: string;
  preferences: Record<string, string>;
}

export interface IAuth {
  id: string;
  username: string;
  passwordHash: string;
}
