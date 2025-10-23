/**
 * Generates a unique UUID v4 identifier
 * @returns A unique UUID string in the format xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
 */
export function generateUUID(): string {
  return crypto.randomUUID();
}
