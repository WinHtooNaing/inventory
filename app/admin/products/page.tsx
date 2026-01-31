"use client"
import React, { useMemo, useState } from "react"
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
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// fake shops
const shops = [
  { id: 1, name: "Shop A" },
  { id: 2, name: "Shop B" },
]

const PAGE_SIZE = 5

export default function AdminProductPage() {
  const [products, setProducts] = useState([
    { id: 1, name: "Football Jersey", category: "Sports", price: 25000, totalStock: 20 },
    { id: 2, name: "Boots", category: "Sports", price: 50000, totalStock: 3 },
    { id: 3, name: "Bag", category: "Accessories", price: 15000, totalStock: 12 },
    { id: 4, name: "Cap", category: "Accessories", price: 8000, totalStock: 7 },
    { id: 5, name: "Socks", category: "Sports", price: 3000, totalStock: 2 },
    { id: 6, name: "Shoes", category: "Fashion", price: 60000, totalStock: 10 },
  ])

  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)

  const [assignQty, setAssignQty] = useState(1)
  const [selectedShop, setSelectedShop] = useState("")

  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: 0,
    totalStock: 0,
  })
  const [editProduct, setEditProduct] = useState<any>(null)

  /** CATEGORY LIST */
  const categories = useMemo(() => {
    return Array.from(new Set(products.map(p => p.category)))
  }, [products])

  /** FILTER */
  const filteredProducts = products.filter(p => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())

    const matchCategory =
      categoryFilter === "all" || p.category === categoryFilter

    return matchSearch && matchCategory
  })

  /** PAGINATION */
  const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE)
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  /** CRUD */
  const addProduct = () => {
    if (newProduct.totalStock < 0) return
    setProducts([...products, { id: Date.now(), ...newProduct }])
    setNewProduct({ name: "", category: "", price: 0, totalStock: 0 })
  }

  const updateProduct = () => {
    setProducts(products.map(p => (p.id === editProduct.id ? editProduct : p)))
    setEditProduct(null)
  }

  const deleteProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id))
  }

  const assignProduct = (id: number) => {
    setProducts(products.map(p =>
      p.id === id ? { ...p, totalStock: p.totalStock - assignQty } : p
    ))
    setAssignQty(1)
    setSelectedShop("")
  }

  return (
    <section className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Main Admin – Products</h1>

      {/* FILTER BAR */}
      <div className="flex gap-4 items-center">
        <Input
          placeholder="Search product..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-1/3"
        />

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-56">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(c => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* ADD PRODUCT */}
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add Product</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Product</DialogTitle>
            </DialogHeader>
            <Input placeholder="Name" onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
            <Input placeholder="Category" onChange={e => setNewProduct({ ...newProduct, category: e.target.value })} />
            <Input type="number" placeholder="Price" onChange={e => setNewProduct({ ...newProduct, price: Number(e.target.value) })} />
            <Input type="number" min={0} placeholder="Stock" onChange={e => setNewProduct({ ...newProduct, totalStock: Number(e.target.value) })} />
            <Button onClick={addProduct}>Save</Button>
          </DialogContent>
        </Dialog>
      </div>

      {/* TABLE */}
      <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-center">Stock</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProducts.map(p => (
              <TableRow key={p.id}>
                <TableCell className="font-semibold">{p.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{p.category}</Badge>
                </TableCell>
                <TableCell>{p.price.toLocaleString()} Ks</TableCell>
                <TableCell className="text-center">
                  <Badge variant={p.totalStock < 5 ? "destructive" : "secondary"}>
                    {p.totalStock}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">

                  {/* EDIT */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline">Edit</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Product</DialogTitle>
                      </DialogHeader>
                      <Input defaultValue={p.name} onChange={e => setEditProduct({ ...p, name: e.target.value })} />
                      <Input defaultValue={p.category} onChange={e => setEditProduct({ ...p, category: e.target.value })} />
                      <Input type="number" defaultValue={p.price} onChange={e => setEditProduct({ ...p, price: Number(e.target.value) })} />
                      <Input type="number" min={0} defaultValue={p.totalStock} onChange={e => setEditProduct({ ...p, totalStock: Number(e.target.value) })} />
                      <Button onClick={updateProduct}>Update</Button>
                    </DialogContent>
                  </Dialog>

                  {/* ASSIGN */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="secondary">Assign</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Assign to Shop</DialogTitle>
                      </DialogHeader>
                      <Select onValueChange={setSelectedShop}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select shop" />
                        </SelectTrigger>
                        <SelectContent>
                          {shops.map(s => (
                            <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        type="number"
                        min={1}
                        max={p.totalStock}
                        value={assignQty}
                        onChange={e => setAssignQty(Number(e.target.value))}
                      />
                      <Button
                        disabled={!selectedShop || assignQty > p.totalStock}
                        onClick={() => assignProduct(p.id)}
                      >
                        Assign
                      </Button>
                    </DialogContent>
                  </Dialog>

                  {/* DELETE */}
                  <Button size="sm" variant="destructive" onClick={() => deleteProduct(p.id)}>
                    Delete
                  </Button>

                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-end gap-2">
        <Button
          size="sm"
          variant="outline"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(p => p - 1)}
        >
          Prev
        </Button>
        <span className="text-sm mt-1">
          Page {currentPage} / {totalPages}
        </span>
        <Button
          size="sm"
          variant="outline"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(p => p + 1)}
        >
          Next
        </Button>
      </div>
    </section>
  )
}
