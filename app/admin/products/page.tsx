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

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { productSchema } from "@/types/product-schema";

/** ================= TYPES ================= */

type Product = {
  id: number;
  name: string;
  categoryId: number;
  categoryName: string;
  purchasePrice: number;
  salePrice: number;
  totalStock: number;
};

type Category = {
  id: number;
  name: string;
};

export default function AdminProductPage() {
  /** ================= STATES ================= */

  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [editProduct, setEditProduct] = useState<Product | null>(null);

  /** ================= CREATE FORM ================= */

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

  /** ================= MOCK API ================= */

  useEffect(() => {
    setProducts([
      {
        id: 1,
        name: "Football Jersey",
        categoryId: 1,
        categoryName: "Sports",
        purchasePrice: 20000,
        salePrice: 25000,
        totalStock: 20,
      },
    ]);

    setCategories([
      { id: 1, name: "Sports" },
      { id: 2, name: "Accessories" },
      { id: 3, name: "Fashion" },
    ]);
  }, []);

  /** ================= CREATE ================= */

  const onCreate = (values: z.infer<typeof productSchema>) => {
    const payload = {
      name: values.name,
      categoryId: Number(values.categoryId),
      purchasePrice: values.purchasePrice,
      salePrice: values.salePrice,
      totalStock: values.totalStock,
    };

    console.log("CREATE PRODUCT →", payload);
    setOpen(false);
    form.reset();
  };

  /** ================= EDIT ================= */

  const openEditDialog = (product: Product) => {
    setEditProduct(product);
    setEditOpen(true);
  };

  const updateProduct = () => {
    if (!editProduct) return;

    const payload = {
      id: editProduct.id,
      name: editProduct.name,
      categoryId: Number(editProduct.categoryId),
      purchasePrice: editProduct.purchasePrice,
      salePrice: editProduct.salePrice,
      totalStock: editProduct.totalStock,
    };

    console.log("UPDATE PRODUCT →", payload);
    setEditOpen(false);
  };

  /** ================= DELETE ================= */

  const deleteProduct = (id: number) => {
    console.log("DELETE PRODUCT ID →", id);
  };

  /** ================= UI ================= */

  return (
    <section className="p-6">
      <h1 className="text-2xl font-bold mb-6">Product Management</h1>

      <div className="flex justify-between mb-4">
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* TABLE */}
      <div className="rounded-xl border bg-background shadow-sm">
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
            {products.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.categoryName}</TableCell>
                <TableCell>{p.purchasePrice}</TableCell>
                <TableCell>{p.salePrice}</TableCell>
                <TableCell>{p.totalStock}</TableCell>

                <TableCell className="text-right space-x-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => openEditDialog(p)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>

                  {/* DELETE ALERT */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="icon" variant="destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Delete this product?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteProduct(p.id)}>
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
      </div>

      {/* CREATE DIALOG */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Product</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onCreate)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* CATEGORY */}
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>

                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {categories.map((c) => (
                          <SelectItem key={c.id} value={c.id.toString()}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormLabel>Purchase Price</FormLabel>
              <Input
                type="number"
                placeholder="Purchase Price"
                {...form.register("purchasePrice")}
              />
              <FormLabel>Sale Price</FormLabel>
              <Input
                type="number"
                placeholder="Sale Price"
                {...form.register("salePrice")}
              />
              <FormLabel>Total Stock</FormLabel>
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

      {/* EDIT DIALOG (SEPARATE STATE) */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>

          {editProduct && (
            <div className="space-y-4">
              <Input
                value={editProduct.name}
                onChange={(e) =>
                  setEditProduct({
                    ...editProduct,
                    name: e.target.value,
                  })
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
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id.toString()}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <label className="text-sm font-medium">Purchase Price</label>
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
              <label className="text-sm font-medium">Sale Price</label>
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
              <label className="text-sm font-medium">Total Stock</label>
              <Input
                type="number"
                value={editProduct.totalStock}
                onChange={(e) =>
                  setEditProduct({
                    ...editProduct,
                    totalStock: Number(e.target.value),
                  })
                }
              />

              <DialogFooter>
                <Button variant="outline" onClick={() => setEditOpen(false)}>
                  Cancel
                </Button>

                <Button onClick={updateProduct}>Update Product</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
