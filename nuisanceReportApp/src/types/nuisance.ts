export enum NuisanceStatus {
  OPEN = 'OPEN',
  RESOLVED = 'RESOLVED',
}

export interface NuisanceReport {
  id: string;
  reporterName: string;
  reporterPhone: string;
  troublemakerName: string;
  location: Location_;
  pictureUrl?: string;
  extraInfo?: string;
  timeReported: number;
  status: NuisanceStatus.OPEN | NuisanceStatus.RESOLVED;
}

export interface Location_ {
  placeName: string;
  longitude: number;
  latitude: number;
}
