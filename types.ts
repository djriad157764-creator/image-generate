export interface ThumbnailRequest {
  laptopImage: string;
  mobileImage: string;
  codeImage: string;
  outputImage: string;
  heading: string;
  services: string[];
  skills: string[];
}

export enum AppStatus {
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}

export interface ThumbnailAssets {
  laptop: string | null;
  mobile: string | null;
  code: string | null;
  output: string | null;
}

export interface ThumbnailText {
  heading: string;
  services: string[];
  skills: string[];
}
