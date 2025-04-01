export const checkAuthAndRedirect = async (router: { push: (url: string) => void }, acon:boolean): Promise<boolean> => {
    const checkAuthFetchUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_BASE_PORT}/api/check-auth${ acon ? '?acon=1' : '?acon=0' }`;
    // acon is for allowing contributors in public calendar page
   
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


 