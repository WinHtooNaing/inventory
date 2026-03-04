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
import { useAuth } from "@/context/AuthContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

/* ---------------- TYPES ---------------- */

type Product = {
  productId: number;
  productName: string;
  salePrice: number;
  quantity: number;
  purchasePrice: number;
  branchId: number;
};
type CartItem = {
  productId: number;
  productName: string;
  salePrice: number;
  qty: number;
};

export default function ShopSalesPage() {
  /* ---------------- STATE ---------------- */

  const { user } = useAuth();
  const [userId, setUserId] = useState<number | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  const [search, setSearch] = useState("");
  const [openSuccess, setOpenSuccess] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 5;

  /* ---------------- FETCH PRODUCTS ---------------- */

  const fetchProducts = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/branch-products/${userId}`,
      );

      if (!res.ok) throw new Error("Failed to fetch products");

      const data = await res.json();

      console.log("PRODUCT LIST =>", data);

      setProducts(data);
    } catch (err) {
      console.log("FETCH ERROR =>", err);
    }
  };

  useEffect(() => {
    if (user?.id) {
      setUserId(user.id);
    }
  }, [user]);

  useEffect(() => {
    if (userId) {
      fetchProducts();
    }
  }, [userId]);

  /* ---------------- FRONTEND SEARCH ---------------- */

  const filteredProducts = products.filter((p) =>
    p.productName.toLowerCase().includes(search.toLowerCase()),
  );

  /* ---------------- FRONTEND PAGINATION ---------------- */

  const totalPage = Math.ceil(filteredProducts.length / limit);

  const paginatedProducts = filteredProducts.slice(
    (page - 1) * limit,
    page * limit,
  );

  /* ---------------- CART ---------------- */

  const addToCart = (product: Product) => {
    if (product.quantity <= 0) return;

    const exist = cart.find((c) => c.productId === product.productId);

    if (exist) {
      if (exist.qty >= product.quantity) return;

      setCart(
        cart.map((c) =>
          c.productId === product.productId ? { ...c, qty: c.qty + 1 } : c,
        ),
      );
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const increaseQty = (id: number) => {
    const product = products.find((p) => p.productId === id);
    const item = cart.find((c) => c.productId === id);

    if (!product || !item || item.qty >= product.quantity) return;

    setCart(
      cart.map((c) => (c.productId === id ? { ...c, qty: c.qty + 1 } : c)),
    );
  };

  const decreaseQty = (id: number) => {
    setCart(
      cart
        .map((c) => (c.productId === id ? { ...c, qty: c.qty - 1 } : c))
        .filter((c) => c.qty > 0),
    );
  };

  /* ---------------- CHECKOUT ---------------- */

  const checkout = async () => {
    if (!userId) {
      alert("Branch not found");
      return;
    }

    try {
      const payload = {
        branchId: userId,
        items: cart.map((c) => ({
          productId: c.productId,
          quantity: c.qty,
        })),
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/branch-sale/checkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Checkout failed");
      }

      // alert(`✅ Sale Completed\nTotal: ${data.grandTotal} MMK`);
      setOpenSuccess(true);

      setCart([]);
      fetchProducts();
    } catch (err: any) {
      console.log("CHECKOUT ERROR =>", err);
      alert(`❌ ${err.message}`);
    }
  };

  const total = cart.reduce((sum, i) => sum + i.salePrice * i.qty, 0);

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
              <TableRow key={p.productId}>
                <TableCell>{p.productName}</TableCell>
                <TableCell>{p.salePrice.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant={p.quantity < 5 ? "destructive" : "secondary"}>
                    {p.quantity}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    disabled={p.quantity === 0}
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
                <TableRow key={c.productId}>
                  <TableCell>{c.productName}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => decreaseQty(c.productId)}
                      >
                        -
                      </Button>
                      {c.qty}
                      <Button
                        size="sm"
                        onClick={() => increaseQty(c.productId)}
                      >
                        +
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    {(c.qty * c.salePrice).toLocaleString()}
                  </TableCell>
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
      <AlertDialog open={openSuccess} onOpenChange={setOpenSuccess}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>✅ Sale Completed</AlertDialogTitle>
            <AlertDialogDescription>
              The sale has been saved successfully.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setOpenSuccess(false)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
