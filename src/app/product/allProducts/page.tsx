import { Metadata } from 'next';
import AllProductsClient from './AllProductsClient';

export const metadata: Metadata = {
  title: 'All Products - Factory Finds',
  description: 'Browse our complete collection of trendy clothes, apparel and fashion items at Factory Finds',
  alternates: {
    canonical: 'https://www.factoryfinds.store/product/allProducts',
  },
};

export default function AllProductsPage() {
  return <AllProductsClient />;
}