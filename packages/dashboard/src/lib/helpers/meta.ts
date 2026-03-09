import { DetailedHTMLProps, MetaHTMLAttributes } from 'react';
import app from '@/config/app';

type Metadata = DetailedHTMLProps<
	MetaHTMLAttributes<HTMLMetaElement>,
	HTMLMetaElement
>[];

interface MetadataProps {
	title: string;
	description?: string;
	keywords?: string[];
}

interface MetadataOptions {
	withSuffix?: boolean;
}

export const generateMetadata = (
	props: MetadataProps,
	options?: MetadataOptions,
) => {
	const withSuffix = options?.withSuffix ?? true;
	const finalTitle = withSuffix ? `${props.title} | ${app.name}` : props.title;
	const metadata: Metadata = [
		{ title: finalTitle },
		{ property: 'og:title', content: finalTitle },
	];

	if (props.description) {
		metadata.push({ name: 'description', content: props.description });
		metadata.push({ property: 'og:description', content: props.description });
	}

	if (props.keywords) {
		metadata.push({ name: 'keywords', content: props.keywords.join(',') });
	}

	return metadata;
};
