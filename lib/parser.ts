export function parseJwt(token: string) {
  const arrayToken = token.split(".");
  return JSON.parse(atob(arrayToken[1]));
}
