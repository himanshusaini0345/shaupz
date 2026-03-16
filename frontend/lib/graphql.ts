export async function fetchProducts(page = 1, limit = 12, search = '') {
  const query = `
    query GetProducts($page: Int!, $limit: Int!, $search: String) {
      getProducts(page: $page, limit: $limit, search: $search) {
        items {
          id
          name
          price
          stock
          description
        }
        total
        page
        limit
      }
    }
  `;

  const res = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3001/graphql', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query, variables: { page, limit, search } }),
    cache: 'no-store'
  });

  if (!res.ok) {
    return { items: [], page, limit, total: 0 };
  }

  const json = await res.json();
  return json.data.getProducts;
}

export async function fetchCart() {
  const query = `
   query {
      getCart {
        items {
          product {
            id
            name
            price
          }
          quantity
        }
      }
    }
  `;

  const res = await fetch(
    process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:3001/graphql",
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ query }),
      cache: "no-store",
    },
  );

  if (!res.ok) {
    return { items: [] };
  }

  const json = await res.json();
  return json.data.getCart;
}
