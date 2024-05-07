export enum OrderBy {
  'name:desc' = 'name:desc',
  'name:asc' = 'name:asc',
  'createdAt:desc' = 'created_at:desc',
  'createdAt:asc' = 'created_at:asc',
  'id:desc' = 'id:desc',
  'id:asc' = 'id:asc',
}

export type TFindAllProps = {
  page: number;
  limit: number;
  orderBy?: OrderBy;
  includes?: string[] | null;
  where?: Record<string, string>;
};
