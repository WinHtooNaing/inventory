"use client";

import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";

/** ================= TYPES ================= */

type Branch = {
  id: number;
  name: string;
};

type BranchProduct = {
  branchId: number;
  productId: number;
  productName: string;
  quantity: number;
  purchasePrice: number;
  salePrice: number;
};

/** ================= COMPONENT ================= */

export default function BranchStockTabsPage() {
  /** STATES */
  const [branches, setBranches] = useState<Branch[]>([]);
  const [branchProducts, setBranchProducts] = useState<
    Record<number, BranchProduct[]>
  >({});
  const [activeBranch, setActiveBranch] = useState<number | null>(null);

  /** ================= FETCH BRANCHES ================= */

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const res = await fetch("http://localhost:8080/branches");
      const data = await res.json();

      setBranches(data);

      if (data.length > 0) {
        setActiveBranch(data[0].id);
      }
    } catch (err) {
      console.error("Failed to load branches", err);
    }
  };

  /** ================= FETCH PRODUCTS BY BRANCH ================= */

  const fetchBranchProducts = async (branchId: number) => {
    if (branchProducts[branchId]) return;

    try {
      const res = await fetch(
        `http://localhost:8080/branch-products/${branchId}`,
      );

      const data = await res.json();

      setBranchProducts((prev) => ({
        ...prev,
        [branchId]: data,
      }));
    } catch (err) {
      console.error("Failed to load branch products", err);
    }
  };

  /** Load products when active branch changes */
  useEffect(() => {
    if (activeBranch) {
      fetchBranchProducts(activeBranch);
    }
  }, [activeBranch]);

  /** ================= UI ================= */

  return (
    <section className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">🏬 Branch-wise Remaining Stock</h1>

      {branches.length > 0 && (
        <Tabs
          value={activeBranch?.toString()}
          onValueChange={(v) => setActiveBranch(Number(v))}
        >
          {/* Branch Tabs */}
          <TabsList className="mb-4">
            {branches.map((branch) => (
              <TabsTrigger key={branch.id} value={branch.id.toString()}>
                {branch.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Branch Content */}
          {branches.map((branch) => {
            const products = branchProducts[branch.id] || [];

            return (
              <TabsContent key={branch.id} value={branch.id.toString()}>
                <div className="rounded-xl border bg-white shadow-sm">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-center">
                          Remaining Qty
                        </TableHead>
                        <TableHead className="text-center">Status</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {products.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={3}
                            className="text-center text-muted-foreground"
                          >
                            No products
                          </TableCell>
                        </TableRow>
                      ) : (
                        products.map((item) => (
                          <TableRow key={item.productId}>
                            <TableCell className="font-medium">
                              {item.productName}
                            </TableCell>

                            <TableCell className="text-center">
                              {item.quantity}
                            </TableCell>

                            <TableCell className="text-center">
                              <Badge
                                variant={
                                  item.quantity < 10
                                    ? "destructive"
                                    : "secondary"
                                }
                              >
                                {item.quantity < 10 ? "Low Stock" : "OK"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      )}
    </section>
  );
}
