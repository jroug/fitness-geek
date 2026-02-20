export const profileDataSWRKey = '/api/profile-data?include_fitness_stats=1';

export const profileDataSWRFetcher = async <T,>(url: string): Promise<T> => {
  const res = await fetch(url, { credentials: 'include' });
  if (!res.ok) {
    throw new Error('Failed to fetch profile data');
  }
  return (await res.json()) as T;
};
