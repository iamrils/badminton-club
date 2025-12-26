export interface BadmintonRecord {
  no: number;
  pemain: string;
  totalBola: number;
  hargaSebenarnya: number;
  hargaDibayar: number;
  selisih: number;
  tanggal: string;
}

export interface DateFilter {
  from: string;
  to: string;
}
