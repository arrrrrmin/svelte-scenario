import { tags } from '$lib';

export const tagCurrent = $state({ string: Object.values(tags)[0] });
