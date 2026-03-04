"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

/* ---------------- TYPES ---------------- */

type ApiProduct = {
  purchasePrice: number;
  salePrice: number;
  quantity: number;
  productName: string;
  productId: number;
  branchId: number;
};

type Product = {
  id: number;
  name: string;
  price: number;
  qty: number;
};

const PRODUCTS_PER_PAGE = 5;

export default function ProductPage() {
  const { user } = useAuth();

  const [userId, setUserId] = useState<number | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  /* ---------------- FETCH PRODUCTS ---------------- */

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/branch-products/${userId}`,
      );

      if (!res.ok) throw new Error("Failed to fetch products");

      const data: ApiProduct[] = await res.json();

      console.log("API RAW => ", data);

      // 🔥 API → UI Mapping
      const formatted: Product[] = data.map((p) => ({
        id: p.productId,
        name: p.productName,
        price: p.salePrice,
        qty: p.quantity,
      }));

      setProducts(formatted);
    } catch (err) {
      console.log("Fetch error => ", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- GET USER ID ---------------- */

  useEffect(() => {
    if (user?.id) {
      setUserId(user.id);
    }
  }, [user]);

  /* ---------------- FETCH WHEN USER READY ---------------- */

  useEffect(() => {
    if (userId) {
      fetchProducts();
    }
  }, [userId]);

  /* ---------------- SEARCH ---------------- */

  const filteredProducts = products.filter((p) =>
    (p.name || "").toLowerCase().includes(search.toLowerCase()),
  );

  /* ---------------- PAGINATION ---------------- */

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;

  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + PRODUCTS_PER_PAGE,
  );

  /* ---------------- UI ---------------- */

  return (
    <section className="p-6">
      <h1 className="text-2xl font-bold mb-4">📦 Product List</h1>

      {/* SEARCH */}
      <div className="mb-4 w-1/3">
        <Input
          placeholder="Search product..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* TABLE */}
      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead className="text-center">Price</TableHead>
              <TableHead className="text-center">Qty</TableHead>
              <TableHead className="text-center">Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6">
                  Loading...
                </TableCell>
              </TableRow>
            )}

            {!loading &&
              paginatedProducts.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell className="text-center">
                    {p.price.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-center">{p.qty}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={p.qty < 5 ? "destructive" : "secondary"}>
                      {p.qty < 5 ? "Low Stock" : "OK"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}

            {!loading && paginatedProducts.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-6 text-muted-foreground"
                >
                  No products found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-end items-center gap-2 mt-4">
        <Button
          size="sm"
          variant="outline"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Prev
        </Button>

        <span className="text-sm">
          Page {currentPage} / {totalPages || 1}
        </span>

        <Button
          size="sm"
          variant="outline"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </section>
  );
}
