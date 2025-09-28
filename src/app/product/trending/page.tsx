import { Metadata } from 'next';
import TrendingProductsClient from './TrendingProductsClient';

export const metadata: Metadata = {
  title: 'Trending Products - Factory Finds',
  description: 'Discover the latest trending clothes, fashion styles and popular apparel at Factory Finds',
  alternates: {
    canonical: 'https://www.factoryfinds.store/product/trending',
  },
};

export default function TrendingProductsPage() {
  return <TrendingProductsClient />;
}