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
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { useForm } from "react-hook-form";
import { shopSchema } from "@/types/shop-schema";
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

type Shop = {
  id: number;
  name: string;
  userId: string;
  password: string;
};

const ShopPage = () => {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [shops, setShops] = useState<Shop[]>([]);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [search, setSearch] = useState("");

  const filteredShops = shops.filter(
    (shop) =>
      shop.name.toLowerCase().includes(search.toLowerCase()) ||
      shop.userId.toLowerCase().includes(search.toLowerCase()),
  );

  const form = useForm<z.infer<typeof shopSchema>>({
    resolver: zodResolver(shopSchema),
    defaultValues: {
      name: "",
      userId: "",
      password: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof shopSchema>) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/branches`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (data.success) {
        setOpen(false);
        toast.success(data.message, {
          style: {
            background: "#16a34a", // green
            color: "#fff",
          },
        });
        form.reset();
        fetchShops();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const onSubmitEdit = async (values: z.infer<typeof shopSchema>) => {
    if (!selectedShop) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/branches/${selectedShop.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        },
      );

      const data = await res.json();

      if (data.success) {
        setEditOpen(false);
        setSelectedShop(null);
        toast.success(data.message, {
          style: {
            background: "#16a34a", // green
            color: "#fff",
          },
        });
        fetchShops();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const deleteShop = async (id: number) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/branches/${id}`,
        {
          method: "DELETE",
        },
      );

      const data = await res.json();

      if (data.success) {
        fetchShops();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchShops = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/branches`);
      const data = await res.json();
      setShops(data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchShops();
  }, []);

  return (
    <section className="p-6">
      <h1 className="text-2xl font-bold mb-6">Shop Branch Management</h1>

      {/* Top Bar */}
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search shop..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Shop
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-background shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Shop Name</TableHead>
              <TableHead>UserId</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredShops.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-6 text-muted-foreground"
                >
                  No shops found
                </TableCell>
              </TableRow>
            )}

            {filteredShops.map((shop) => (
              <TableRow key={shop.id} className="hover:bg-muted/40">
                <TableCell className="font-medium">{shop.name}</TableCell>
                <TableCell className="font-medium">{shop.userId}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => {
                      setSelectedShop(shop);

                      form.reset({
                        name: shop.name,
                        userId: shop.userId,
                        password: "", // 🔥 password blank
                      });

                      setEditOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
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
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          variant={"destructive"}
                          onClick={() => deleteShop(shop.id)}
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

      {/* Create Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{"Add Shop"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-6">
                  <div className="grid ">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Shop name"
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid ">
                    <FormField
                      control={form.control}
                      name="userId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>UserId</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Shop userId"
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid ">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Shop password"
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">{"Create"}</Button>
                  </DialogFooter>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{"Edit Shop"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmitEdit)}>
                <div className="flex flex-col gap-6">
                  <div className="grid ">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Shop name"
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid ">
                    <FormField
                      control={form.control}
                      name="userId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>UserId</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Shop userId"
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid ">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Shop password"
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">{"Edit Shop"}</Button>
                  </DialogFooter>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ShopPage;
