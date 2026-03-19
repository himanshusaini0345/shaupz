db = db.getSiblingDB('shaupz-mongo');
db.products.insertMany([
  {
    name: "Wireless Headphones",
    price: 199.99,
    stock: 50,
    description: "High-quality noise-canceling wireless headphones.",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Mechanical Keyboard",
    price: 149.50,
    stock: 200,
    description: "RGB backlit mechanical keyboard with tactile switches.",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Gaming Mouse",
    price: 79.99,
    stock: 150,
    description: "Ergonomic gaming mouse with adjustable DPI.",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "4K Monitor",
    price: 349.99,
    stock: 30,
    description: "27-inch 4K UHD monitor with 144Hz refresh rate.",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);
print("Seed finished!");
