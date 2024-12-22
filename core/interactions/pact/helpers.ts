const escapeSpace = (s: string) => s.replace(/\s+/g, '\\s*');

const escapeRegexChars = (s: string) =>
  s.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');

export const escapeGraphQlQuery = (s: string) =>
  escapeSpace(escapeRegexChars(s));
