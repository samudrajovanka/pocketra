export type MutationOptions = {
	onSuccess?: () => void;
};

export type QueryOptions<T = unknown> = {
	onSuccess?: (data: T) => void;
};
