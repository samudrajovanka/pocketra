import { isAxiosError } from 'axios';
import type { QueryHandlingProps } from './types';

const QueryHandling = <T,>({
	queryResult,
	render,
	...props
}: QueryHandlingProps<T>) => {
	const { data, isLoading, isFetching, isError, isSuccess, error } =
		queryResult;

	if (isLoading && isFetching) {
		return props.renderLoading !== undefined ? (
			props.renderLoading
		) : (
			<p>Loading...</p>
		);
	}

	if (isError) {
		if (isAxiosError(error) && error.status === 404) {
			return props.renderNotFound !== undefined ? (
				props.renderNotFound
			) : (
				<p>Data not found</p>
			);
		}

		return props.renderError ? props.renderError : <p>Error</p>;
	}

	if (isSuccess && data) {
		if (props.checkEmpty?.(data) && props.renderEmpty) {
			return props.renderEmpty;
		}

		return render(data);
	}

	return 'Something when wrong';
};

export default QueryHandling;
