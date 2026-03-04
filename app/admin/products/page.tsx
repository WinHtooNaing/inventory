"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Plus, Pencil, Trash2 } from "lucide-react";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormField } from "@/components/ui/form";
import { productSchema } from "@/types/product-schema";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

/* ================= TYPES ================= */

type Product = {
  id: number;
  name: string;
  categoryId: number;
  categoryName: string;
  purchasePrice: number;
  salePrice: number;
  arrivalQty: number;
};

type Category = {
  id: number;
  name: string;
};

type Branch = {
  id: number;
  name: string;
};

/* ================= API ================= */

const PRODUCT_API = "http://localhost:8080/products";
const CATEGORY_API = "http://localhost:8080/categories";
const BRANCH_API = "http://localhost:8080/branches";
const TRANSFER_API = "http://localhost:8080/branch-products/transfer";

export default function AdminProductPage() {
  /* ================= STATE ================= */

  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);

  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [transferData, setTransferData] = useState({
    branchId: 0,
    quantity: 0,
  });

  const [searchName, setSearchName] = useState("");
  const [searchCategory, setSearchCategory] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  /* ================= FORM ================= */

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      categoryId: "",
      purchasePrice: 0,
      salePrice: 0,
      totalStock: 0,
    },
  });

  /* ================= LOAD DATA ================= */

  const loadProducts = async () => {
    const res = await fetch(PRODUCT_API);
    const data = await res.json();
    setProducts(data);
  };

  const loadCategories = async () => {
    const res = await fetch(CATEGORY_API);
    const data = await res.json();
    setCategories(data);
  };

  const loadBranches = async () => {
    const res = await fetch(BRANCH_API);
    const data = await res.json();
    setBranches(data);
  };

  useEffect(() => {
    loadProducts();
    loadCategories();
    loadBranches();
  }, []);

  /* ================= CREATE ================= */

  const onCreate = async (values: z.infer<typeof productSchema>) => {
    const payload = {
      name: values.name,
      categoryId: Number(values.categoryId),
      purchasePrice: values.purchasePrice,
      salePrice: values.salePrice,
      arrivalQty: values.totalStock,
    };

    const res = await fetch(PRODUCT_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (data.success) {
      toast.success(data.message, {
        style: {
          background: "#16a34a", // green
          color: "#fff",
        },
      });
      loadProducts();
      setOpen(false);
      form.reset();
    } else toast.error(data.message);
  };

  /* ================= UPDATE ================= */

  const updateProduct = async () => {
    if (!editProduct) return;

    const payload = {
      name: editProduct.name,
      categoryId: editProduct.categoryId,
      purchasePrice: editProduct.purchasePrice,
      salePrice: editProduct.salePrice,
      arrivalQty: editProduct.arrivalQty,
    };

    const res = await fetch(`${PRODUCT_API}/${editProduct.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (data.success) {
      toast.success(data.message, {
        style: {
          background: "#16a34a", // green
          color: "#fff",
        },
      });
      loadProducts();
      setEditOpen(false);
    } else toast.error(data.message);
  };

  /* ================= DELETE ================= */

  const deleteProduct = async (id: number) => {
    const res = await fetch(`${PRODUCT_API}/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (data.success) {
      loadProducts();
    } else
      toast.error(data.message, {
        style: {
          background: "#dc2626", // red
          color: "#fff",
        },
      });
  };

  /* ================= TRANSFER ================= */

  const transferStock = async () => {
    if (!selectedProduct) return;

    if (transferData.quantity > selectedProduct.arrivalQty) {
      toast.error("Not enough main stock");
      return;
    }

    const payload = {
      productId: selectedProduct.id,
      branchId: transferData.branchId,
      quantity: transferData.quantity,
    };

    const res = await fetch(TRANSFER_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (data.success) {
      toast.success(data.message, {
        style: {
          background: "#16a34a", // green
          color: "#fff",
        },
      });
      setTransferOpen(false);
      loadProducts();
    } else toast.error(data.message);
  };

  /* ================= FILTER ================= */
  const filteredProducts = products.filter((p) => {
    const matchName = p.name.toLowerCase().includes(searchName.toLowerCase());

    const matchCategory =
      searchCategory === "all" || p.categoryId.toString() === searchCategory;

    return matchName && matchCategory;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  /* ================= UI ================= */

  return (
    <section className="p-6">
      <h1 className="text-2xl font-bold mb-6">Product Management</h1>

      <Button onClick={() => setOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Add Product
      </Button>

      <div className="flex gap-4 mt-4 w-[60%]">
        {/* Name Search */}
        <Input
          placeholder="Search product name..."
          value={searchName}
          onChange={(e) => {
            setSearchName(e.target.value);
            setCurrentPage(1);
          }}
        />

        {/* Category Filter */}
        <Select
          value={searchCategory}
          onValueChange={(v) => {
            setSearchCategory(v);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter Category" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id.toString()}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {/* TABLE */}
      <div className="rounded-xl border mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Purchase</TableHead>
              <TableHead>Sale</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedProducts.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.categoryName}</TableCell>
                <TableCell>{p.purchasePrice}</TableCell>
                <TableCell>{p.salePrice}</TableCell>
                <TableCell>{p.arrivalQty}</TableCell>

                <TableCell className="text-right space-x-2">
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => {
                      setSelectedProduct(p);
                      setTransferOpen(true);
                    }}
                  >
                    T
                  </Button>

                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => {
                      setEditProduct(p);
                      setEditOpen(true);
                    }}
                  >
                    <Pencil size={16} />
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="icon" variant="destructive">
                        <Trash2 size={16} />
                      </Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Product?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Cannot undo this action
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteProduct(p.id)}
                          variant={"destructive"}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex justify-center gap-2 mt-6">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Prev
          </Button>

          <span className="px-4 py-2">
            {currentPage} / {totalPages || 1}
          </span>

          <Button
            variant="outline"
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      {/* CREATE */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Product</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onCreate)} className="space-y-4">
              <Label>Name</Label>
              <Input placeholder="Name" {...form.register("name")} />
              <Label>Category</Label>
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>

                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id.toString()}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />

              <Label>Purchase Price</Label>
              <Input
                type="number"
                placeholder="Purchase Price"
                {...form.register("purchasePrice")}
              />
              <Label>Sale Price</Label>
              <Input
                type="number"
                placeholder="Sale Price"
                {...form.register("salePrice")}
              />
              <Label>Total Stock</Label>
              <Input
                type="number"
                placeholder="Stock"
                {...form.register("totalStock")}
              />

              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* EDIT */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          {editProduct && (
            <div className="space-y-4">
              <Label>Name</Label>
              <Input
                value={editProduct.name}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, name: e.target.value })
                }
              />

              <Select
                value={editProduct.categoryId.toString()}
                onValueChange={(v) =>
                  setEditProduct({
                    ...editProduct,
                    categoryId: Number(v),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>

                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id.toString()}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Label>Purchase Price</Label>
              <Input
                type="number"
                value={editProduct.purchasePrice}
                onChange={(e) =>
                  setEditProduct({
                    ...editProduct,
                    purchasePrice: Number(e.target.value),
                  })
                }
              />

              <Label>Sale Price</Label>
              <Input
                type="number"
                value={editProduct.salePrice}
                onChange={(e) =>
                  setEditProduct({
                    ...editProduct,
                    salePrice: Number(e.target.value),
                  })
                }
              />

              <Label>Total Stock</Label>
              <Input
                type="number"
                value={editProduct.arrivalQty}
                onChange={(e) =>
                  setEditProduct({
                    ...editProduct,
                    arrivalQty: Number(e.target.value),
                  })
                }
              />

              <DialogFooter>
                <Button variant="outline" onClick={() => setEditOpen(false)}>
                  Cancel
                </Button>

                <Button onClick={updateProduct}>Update</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* TRANSFER */}
      <Dialog open={transferOpen} onOpenChange={setTransferOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transfer Stock</DialogTitle>
          </DialogHeader>

          {selectedProduct && (
            <div className="space-y-4">
              <p>Product : {selectedProduct.name}</p>
              <p>Main Stock : {selectedProduct.arrivalQty}</p>

              <Select
                onValueChange={(v) =>
                  setTransferData({
                    ...transferData,
                    branchId: Number(v),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Branch" />
                </SelectTrigger>

                <SelectContent>
                  {branches.map((b) => (
                    <SelectItem key={b.id} value={b.id.toString()}>
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                type="number"
                placeholder="Quantity"
                onChange={(e) =>
                  setTransferData({
                    ...transferData,
                    quantity: Number(e.target.value),
                  })
                }
              />

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setTransferOpen(false)}
                >
                  Cancel
                </Button>

                <Button onClick={transferStock}>Transfer</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
