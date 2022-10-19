export interface PBError {
  code: number;
  data: Record<string, unknown>;
  message: string;
}
