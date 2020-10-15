import {
  API_URL,
} from '../settings'

export const getUrl = (filepath: string): string => `${API_URL}/storage/download?filepath=${encodeURIComponent(filepath)}`