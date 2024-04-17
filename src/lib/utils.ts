// Generates a random string of a given length. Defaults to 6 characters.
export const generateRandomString = (length=6)=>Math.random().toString(20).substring(2, length + 2);