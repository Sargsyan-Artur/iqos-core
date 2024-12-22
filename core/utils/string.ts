import crypto from 'crypto';

export function getRandomString(count = 10): string {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const charactersLength: number = characters.length;

  const randomBytes = crypto.randomBytes(count);
  for (let i = 0; i < count; i += 1) {
    const randomIndex = randomBytes[i] % charactersLength;
    result += characters.charAt(randomIndex);
  }

  return result;
}
