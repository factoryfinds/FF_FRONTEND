// public/workers/sortWorker.ts
// This file should be placed in your public/workers/ directory

interface Product {
  _id: string;
  originalPrice: number;
  discountedPrice: number;
  [key: string]: unknown;
}

self.addEventListener('message', (event: MessageEvent<{ products: Product[] }>) => {
  const { products } = event.data;

  try {
    // Sort products by discount amount
    const sorted = [...products].sort((a, b) => {
      const discountA = a.originalPrice - a.discountedPrice;
      const discountB = b.originalPrice - b.discountedPrice;
      return discountB - discountA;
    });

    // Return only first 8 products
    const result = sorted.slice(0, 8);

    self.postMessage({ success: true, products: result });
  } catch (error) {
    self.postMessage({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

export {};