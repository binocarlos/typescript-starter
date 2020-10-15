export interface PayloadUploadFiles {
  path: string,
  files: File[],
}

export interface PayloadSetProgress {
  filename: string,
  values: ProgressEvent,
}