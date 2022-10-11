
function isLoggedIn() {
    return localStorage.getItem('accessToken');
}


export function useAuth() {
    return { isLoggedIn }
}