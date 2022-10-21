export interface ILink {
  id: string;
  key: string;
  to: string;
  reload?: boolean;
  prefetch?: boolean;
}
