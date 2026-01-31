"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Plus, Pencil, Trash2, Search } from "lucide-react"

type Shop = {
  id: number
  name: string
  address: string
  phone: string
  email: string
  password: string
}

const initialShops: Shop[] = [
  {
    id: 1,
    name: "Aung Mobile",
    address: "Yangon",
    phone: "09-1111111",
    email: "aung@shop.com",
    password: "123456",
  },
  {
    id: 2,
    name: "Hlaing Store",
    address: "Mandalay",
    phone: "09-2222222",
    email: "hlaing@shop.com",
    password: "123456",
  },
]

const ShopPage = () => {
  const [shops, setShops] = useState<Shop[]>(initialShops)
  const [search, setSearch] = useState("")
  const [open, setOpen] = useState(false)
  const [editingShop, setEditingShop] = useState<Shop | null>(null)

  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    password: "",
  })

  // 🔍 Search (name, address, email)
  const filteredShops = shops.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.address.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
  )

  // ➕ / ✏ Submit
  const handleSubmit = () => {
    if (editingShop) {
      setShops(
        shops.map((s) =>
          s.id === editingShop.id ? { ...editingShop, ...form } : s
        )
      )
    } else {
      setShops([...shops, { id: Date.now(), ...form }])
    }

    setForm({
      name: "",
      address: "",
      phone: "",
      email: "",
      password: "",
    })
    setEditingShop(null)
    setOpen(false)
  }

  // ✏ Edit
  const handleEdit = (shop: Shop) => {
    setEditingShop(shop)
    setForm(shop)
    setOpen(true)
  }

  // ❌ Delete
  const handleDelete = (id: number) => {
    setShops(shops.filter((s) => s.id !== id))
  }

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
              <TableHead>Address</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredShops.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  No shops found
                </TableCell>
              </TableRow>
            )}

            {filteredShops.map((shop) => (
              <TableRow key={shop.id} className="hover:bg-muted/40">
                <TableCell className="font-medium">{shop.name}</TableCell>
                <TableCell>{shop.address}</TableCell>
                <TableCell>{shop.phone}</TableCell>
                <TableCell>{shop.email}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button size="icon" variant="outline" onClick={() => handleEdit(shop)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="destructive" onClick={() => handleDelete(shop.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingShop ? "Edit Shop" : "Add Shop"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <Input
              placeholder="Shop Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              placeholder="Address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
            <Input
              placeholder="Phone Number"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <Input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <Input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingShop ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}

export default ShopPage
