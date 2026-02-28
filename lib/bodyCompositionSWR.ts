export const bodyCompositionSWRCacheKeyPrefix = '/api/get-bodyfat-data';

export const bodyCompositionSWRKey = (startDate: string, endDate: string): string => {
    const query = new URLSearchParams({ startDate, endDate }).toString();
    return `${bodyCompositionSWRCacheKeyPrefix}?${query}`;
};

export const bodyCompositionSWRFetcher = async (url: string): Promise<UserBodyfatData[]> => {
    const res = await fetch(url, { method: 'GET', credentials: 'include' });
    if (!res.ok) {
        throw new Error('Failed to fetch body composition data');
    }
    return (await res.json()) as UserBodyfatData[];
};
