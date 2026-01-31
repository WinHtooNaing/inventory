"use client"

import React, { useState } from "react"
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
import { Button } from "@/components/ui/button"

const PRODUCTS_PER_PAGE = 5

export default function ProductPage() {
  const products = [
    { id: 1, name: "Football Jersey", qty: 10 },
    { id: 2, name: "Boots", qty: 2 },
    { id: 3, name: "Socks", qty: 8 },
    { id: 4, name: "Gloves", qty: 1 },
    { id: 5, name: "Cap", qty: 12 },
    { id: 6, name: "Bag", qty: 4 },
    { id: 7, name: "Water Bottle", qty: 20 },
  ]

  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  /** FILTER (no useMemo) */
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  /** PAGINATION */
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)

  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + PRODUCTS_PER_PAGE
  )

  return (
    <section className="p-6">
      <h1 className="text-2xl font-bold mb-4">📦 Product List</h1>

      {/* SEARCH */}
      <div className="mb-4 w-1/3">
        <Input
          placeholder="Search product..."
          value={search}
          onChange={e => {
            setSearch(e.target.value)
            setCurrentPage(1)
          }}
        />
      </div>

      {/* TABLE */}
      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead className="text-center">Qty</TableHead>
              <TableHead className="text-center">Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedProducts.map(p => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell className="text-center">{p.qty}</TableCell>
                <TableCell className="text-center">
                  <Badge variant={p.qty < 5 ? "destructive" : "secondary"}>
                    {p.qty < 5 ? "Low Stock" : "OK"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}

            {paginatedProducts.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={3}
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
  )
}
