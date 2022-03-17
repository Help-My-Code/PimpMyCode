export function getCurrentTokenWithoutQuotes(): string {
    return localStorage.getItem('currentToken').substring(1, localStorage.getItem('currentToken').length - 1);
    //return localStorage.getItem('currentToken').replace("\"", "");
}
