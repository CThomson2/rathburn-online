/**
 * Interface representing a repro stock item from the CSV data
 */
export interface ReproStock {
  repro_drum_id: number;
  date_created: string;
  material: string;
  capacity: number;
  current_volume: number;
  created_at: string;
  updated_at: string;
  status: string;
  volume_status: string;
  location: string | null;
  drum_code: string | null;
}
