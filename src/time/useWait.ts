export const useWait = (timeoutMs: number) => new Promise((r) => setTimeout(r, timeoutMs))
