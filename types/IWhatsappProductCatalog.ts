export type ApiListResponse = {
  items: any[];         // viene “mongo style”, lo mapeamos abajo
  total: number;
  page: number;
  totalPages: number;
};