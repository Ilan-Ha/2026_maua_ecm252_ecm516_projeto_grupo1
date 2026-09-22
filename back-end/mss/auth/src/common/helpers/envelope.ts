export type SuccessResponse<T> = { error: false; status: number; content?: T; message?: string };
export type ErrorResponse = { error: true; status: number; message: string | Record<string, string> | Record<string, string[]> };

export function sucesso<T>(content: T, status = 200, message?: string): SuccessResponse<T> {
  return message ? { error: false, status, content, message } : { error: false, status, content };
}

export function sucessoMsg(message: string, status = 200): SuccessResponse<undefined> {
  return { error: false, status, message };
}

export function erro(status: number, message: string | Record<string, string> | Record<string, string[]>): ErrorResponse {
  return { error: true, status, message };
}
