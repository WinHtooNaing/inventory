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
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { categorySchema } from "@/types/category-schema";
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
import { toast } from "sonner";
import { da } from "zod/v4/locales";

type Shop = {
  id: number;
  name: string;
};

export default function CategoriesPage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "" },
  });

  // ================= LOAD DATA =================
  const loadCategories = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`);

    const data = await res.json();
    setShops(data);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // ================= CREATE =================
  const onSubmit = async (values: z.infer<typeof categorySchema>) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const data = await res.json();

    if (data.success) {
      toast.success(data.message, {
        style: {
          background: "#16a34a", // green
          color: "#fff",
        },
      });
      loadCategories();
      setOpen(false);
      form.reset();
    } else {
      toast.error(data.message);
    }
  };

  // ================= EDIT =================
  const onSubmitEdit = async (values: z.infer<typeof categorySchema>) => {
    if (!selectedId) return;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/categories/${selectedId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      },
    );

    const data = await res.json();

    if (data.success) {
      toast.success(data.message, {
        style: {
          background: "#16a34a", // green
          color: "#fff",
        },
      });
      loadCategories();
      setEditOpen(false);
    } else {
      toast.error(data.message);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id: number) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`,
      { method: "DELETE" },
    );
    const data = await res.json();

    if (data.success) loadCategories();
    else
      toast.error(data.message, {
        style: {
          background: "#dc2626", // red
          color: "#fff",
        },
      });
  };

  return (
    <section className="p-6">
      <h1 className="text-2xl font-bold mb-6">Category Management</h1>

      {/* Top Bar */}
      <div className="flex justify-between items-center mb-4">
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-background shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Category Name</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {shops.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  No Category Found
                </TableCell>
              </TableRow>
            )}

            {shops.map((shop) => (
              <TableRow key={shop.id}>
                <TableCell>{shop.name}</TableCell>

                <TableCell className="text-right space-x-2">
                  {/* EDIT */}
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => {
                      setSelectedId(shop.id);
                      form.setValue("name", shop.name);
                      setEditOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>

                  {/* DELETE */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="icon" variant="destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you sure to delete?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(shop.id)}
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
      </div>

      {/* CREATE */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Category name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="mt-4">
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
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitEdit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Category name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => setEditOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Update</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
