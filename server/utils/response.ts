// server/utils/response.ts
export const success = (data: any) => ({ success: true, data });
export const fail = (message: string, code?: string) => ({ success: false, message, code });
