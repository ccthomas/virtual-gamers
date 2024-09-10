// src/types/Athlete.ts

export type BirthPlace = {
  city: string;
  state: string;
  country: string;
  displayText: string; // Use snake_case for keys
};

export type Headshot = {
  alt: string;
  href: string;
};

export type Position = {
  id: string;
  leaf: boolean;
  name: string;
  parent: {
    id: string;
    leaf: boolean;
    name: string;
    displayName: string;
    abbreviation: string;
  };
  displayName: string;
  abbreviation: string;
};

export type Experience = {
  years: number;
  abbreviation: string;
  displayValue: string;
};

export type Status = {
  id: string;
  name: string;
  type: string;
  abbreviation: string;
};

export type Athlete = {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  display_name: string;
  weight: number;
  display_weight: string;
  height: number;
  display_height: string;
  birth_place: BirthPlace;
  headshot: Headshot;
  jersey: string;
  college: { name: string },
  position: Position;
  injuries: unknown[]; // Adjust if you have specific structure for injuries
  experience: Experience;
  status: Status;
  team_id: string;
  position_name: string;
};
