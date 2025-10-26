export interface RollMeta {
  rollId: string;
  date: string; // YYYY-MM-DD format
  camera: string;
  lens: string;
  filmStock: string;
  ratedISO: string;
  meterISO: string;
  exposures: number;
}

export interface Shot {
  shotNumber: number;
  date?: string; // YYYY-MM-DD format or ISO timestamp
  filmSpeed?: string;
  aperture?: string;
  exposureAdjustments?: string;
  notes?: string;
  imageUrl?: string;
}

export interface RollDoc {
  meta: RollMeta;
  shots: Shot[];
}

export interface SaveRequest {
  doc: RollDoc;
  storageMode: 'download' | 'github';
}

export interface SaveResponse {
  filename?: string;
  content?: string;
  html_url?: string;
}

export interface ImportGitHubResponse {
  content: string;
}

export interface UploadImageResponse {
  url: string;
}
