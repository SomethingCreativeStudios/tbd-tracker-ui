export enum SourceLocation {
  THE_PIRATE_BAY = 'the-pirate-bay',
}

export interface MediaQuickLink {
  query: string;
  display: string;
}

export interface MediaLink {
  name: string;
  url: string;
}

export class MediaCollection {
  items: MediaItem[];
  link: string;
  name: string;
  parsedName: string;
  selectedItem = 0;
}

export interface MediaItem {
  id: number;

  displayName: string;

  associatedLinks: MediaLink[];

  description: string;

  rating: number;

  imagePath: string;

  releaseDate: Date;
}
