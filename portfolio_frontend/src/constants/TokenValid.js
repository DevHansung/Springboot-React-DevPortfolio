import { ACCESS_TOKEN } from './Property';

export const expiry = (token) => {
  if (!token || token === "undefined") return null;
  const expiresAt = new Date(
    JSON.parse(window.atob(token.split(".")[1])).exp * 1000
  );
  const currentTime = new Date();
  return (expiresAt.getTime() - currentTime.getTime()) / 1000;
};

export const timer = accessToken => {
  const secondsToExpiry = expiry(sessionStorage.getItem(ACCESS_TOKEN));
  const roundedMinutes = Math.max(Math.floor(secondsToExpiry / 60), 0);
  return [
    roundedMinutes,
    Math.trunc(secondsToExpiry - roundedMinutes * 60)
  ];
};