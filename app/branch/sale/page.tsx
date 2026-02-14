"use client";

import React, { useState, useEffect } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

/* ---------------- TYPES ---------------- */

type Product = {
  id: number;
  name: string;
  price: number;
  qty: number;
};

type CartItem = {
  id: number;
  name: string;
  price: number;
  qty: number;
};

export default function ShopSalesPage() {
  /* ---------------- STATE ---------------- */

  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const limit = 5;

  /* ---------------- FETCH PRODUCTS ---------------- */

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");

      if (!res.ok) throw new Error("Failed to fetch products");

      const data = await res.json();

      console.log("PRODUCT LIST =>", data);

      setProducts(data);
    } catch (err) {
      console.log("FETCH ERROR =>", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* ---------------- FRONTEND SEARCH ---------------- */

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  /* ---------------- FRONTEND PAGINATION ---------------- */

  const totalPage = Math.ceil(filteredProducts.length / limit);

  const paginatedProducts = filteredProducts.slice(
    (page - 1) * limit,
    page * limit,
  );

  /* ---------------- CART ---------------- */

  const addToCart = (product: Product) => {
    if (product.qty <= 0) return;

    const exist = cart.find((c) => c.id === product.id);

    if (exist) {
      if (exist.qty >= product.qty) return;

      setCart(
        cart.map((c) => (c.id === product.id ? { ...c, qty: c.qty + 1 } : c)),
      );
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const increaseQty = (id: number) => {
    const product = products.find((p) => p.id === id);
    const item = cart.find((c) => c.id === id);

    if (!product || !item || item.qty >= product.qty) return;

    setCart(cart.map((c) => (c.id === id ? { ...c, qty: c.qty + 1 } : c)));
  };

  const decreaseQty = (id: number) => {
    setCart(
      cart
        .map((c) => (c.id === id ? { ...c, qty: c.qty - 1 } : c))
        .filter((c) => c.qty > 0),
    );
  };

  /* ---------------- CHECKOUT ---------------- */

  const checkout = async () => {
    try {
      const payload = {
        items: cart.map((c) => ({
          productId: c.id,
          qty: c.qty,
          price: c.price,
        })),
        total: cart.reduce((sum, i) => sum + i.price * i.qty, 0),
      };

      console.log("SALE DATA =>", payload);

      const res = await fetch("/api/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Sale failed");

      alert("✅ Sale saved successfully");

      setCart([]);
      fetchProducts(); // refresh stock
    } catch (err) {
      console.log("SALE ERROR =>", err);
      alert("❌ Sale failed");
    }
  };

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  /* ---------------- UI ---------------- */

  return (
    <section className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* PRODUCTS */}
      <div className="lg:col-span-2 space-y-4">
        <h1 className="text-2xl font-bold">🏬 Products</h1>

        <Input
          placeholder="Search product..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedProducts.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.price.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant={p.qty < 5 ? "destructive" : "secondary"}>
                    {p.qty}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    disabled={p.qty === 0}
                    onClick={() => addToCart(p)}
                  >
                    Add
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex justify-center gap-2">
          <Button disabled={page === 1} onClick={() => setPage(page - 1)}>
            Prev
          </Button>

          <span className="px-3 py-2">
            {page} / {totalPage || 1}
          </span>

          <Button
            disabled={page >= totalPage}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      {/* CART */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">🛒 Cart</h2>

        {cart.length === 0 && (
          <p className="text-sm text-muted-foreground">Cart is empty</p>
        )}

        {cart.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Subtotal</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {cart.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.name}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => decreaseQty(c.id)}>
                        -
                      </Button>
                      {c.qty}
                      <Button size="sm" onClick={() => increaseQty(c.id)}>
                        +
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>{(c.qty * c.price).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <div className="border-t pt-2 space-y-2">
          <p className="font-bold">Total: {total.toLocaleString()} MMK</p>

          <Button
            className="w-full"
            disabled={cart.length === 0}
            onClick={checkout}
          >
            Checkout
          </Button>
        </div>
      </div>
    </section>
  );
}
