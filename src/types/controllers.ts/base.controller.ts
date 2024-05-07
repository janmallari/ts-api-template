export type GetAllProps = {
  page: number;
  limit: number;
  orderBy?: string | null;
  includes?: string[] | null;
  where?: Record<string, string>;
};
