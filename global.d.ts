// global.d.ts
export { };

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
  interface Window {
    fbq?: (event: string, action: string, params?: Record<string, any>) => void;
  }
  interface Window {
    dataLayer: Record<string, any>[];
    gtag: (...args: any[]) => void;
  }
}
