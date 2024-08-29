// src/types.ts

export interface Logo {
  href: string;
  width: number;
  height: number;
  alt: string;
  rel: string[];
}

export interface Team {
  id: string;
  abbreviation: string;
  display_name: string;
  location: string;
  logos: Logo[];
  color?: string;
  alternate_color?: string;
}

export interface TeamsResponse {
  count: number;
  data: Team[];
}
