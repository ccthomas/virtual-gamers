// src/types/Athlete.ts

export interface Athlete {
  id: string;
  uid: string;
  guid: string;
  alternate_ids: {
    sdr: string;
  };
  first_name: string;
  last_name: string;
  full_name: string;
  display_name: string;
  short_name: string;
  weight: number;
  display_weight: string;
  height: number;
  display_height: string;
  links: Link[];
  birth_place: {
    city: string;
    state: string;
    country: string;
    displayText: string;
  };
  birth_country: {
    alternateId: string;
    abbreviation: string;
  };
  college: {
    id: string;
    mascot: string;
    name: string;
    shortName: string;
    abbrev: string;
    logos: Logo[];
  };
  slug: string;
  headshot: {
    href: string;
    alt: string;
  };
  jersey: string;
  flag: {
    href: string;
    alt: string;
    rel: string[];
  };
  position: {
    id: string;
    name: string;
    displayName: string;
    abbreviation: string;
    leaf: boolean;
    parent: {
      id: string;
      name: string;
      displayName: string;
      abbreviation: string;
      leaf: boolean;
    };
  };
  injuries: unknown[];
  teams: TeamReference[];
  experience: {
    years: number;
    displayValue: string;
    abbreviation: string;
  };
  status: {
    id: string;
    name: string;
    type: string;
    abbreviation: string;
  };
}

interface Link {
  language: string;
  rel: string[];
  href: string;
  text: string;
  shortText: string;
  isExternal: boolean;
  isPremium: boolean;
}

interface Logo {
  href: string;
  width: number;
  height: number;
  alt: string;
  rel: string[];
  lastUpdated: string;
}

interface TeamReference {
  $ref: string;
}
