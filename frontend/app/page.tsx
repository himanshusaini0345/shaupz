import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { fetchProducts } from '@/lib/graphql';

export default async function Home() {
  const products = await fetchProducts();

  async function addToCart(formData: FormData) {
    'use server';
    const productId = formData.get('productId');
    await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001') + '/cart/add', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ productId, quantity: 1 })
    });
  }

  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {products.items?.map((product: any) => (
        <Card key={product.id}>
          <CardHeader>
            <h2 className="font-semibold">{product.name}</h2>
          </CardHeader>
          <CardContent>
            <p className="mb-2 text-sm text-slate-600">{product.description}</p>
            <p className="mb-4 font-medium">${product.price}</p>
            <form action={addToCart}>
              <input type="hidden" name="productId" value={product.id} />
              <Button>Add to cart</Button>
            </form>
          </CardContent>
        </Card>
      ))}
      {!products.items?.length && <p>No products found.</p>}
    </section>
  );
}
