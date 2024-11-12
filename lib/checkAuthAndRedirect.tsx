export const checkAuthAndRedirect = async (router: { push: (url: string) => void }): Promise<boolean> => {
    const checkAuthFetchUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_BASE_PORT}/api/check-auth`;
    const res = await fetch(checkAuthFetchUrl, {
        method: 'GET',
        credentials: 'include',
    });
    if (!res.ok) {
        router.push('/');
        return false;
    }
    return true;
}