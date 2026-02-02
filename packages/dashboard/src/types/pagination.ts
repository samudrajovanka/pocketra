export type PaginationParams = {
	page?: number;
	limit?: number;
};

export type PaginationMeta = {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
};

export type CursorPaginationParams = {
	cursor?: string;
	limit?: number;
};

export type CursorPaginationMeta = {
	limit: number;
	nextCursor?: string | null;
};
