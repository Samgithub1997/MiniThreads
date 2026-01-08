export function encodeCursor(payload: unknown) {
  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
}

export function decodeCursor(input: string) {
  return JSON.parse(Buffer.from(input, "base64url").toString("utf8"));
}
