"use client"
import React, { useState } from "react"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function ShopStockTabsPage() {
  const [shopStocks] = useState([
    {
      shopId: 1,
      shopName: "Shop A",
      items: [
        { productId: 1, productName: "Football Jersey", qty: 5 },
        { productId: 2, productName: "Boots", qty: 2 },
      ],
    },
    {
      shopId: 2,
      shopName: "Shop B",
      items: [
        { productId: 1, productName: "Football Jersey", qty: 3 },
        { productId: 3, productName: "Bag", qty: 6 },
      ],
    },
  ])

  return (
    <section className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">
        🏬 Shop-wise Remaining Stock
      </h1>

      <Tabs defaultValue={shopStocks[0].shopName} className="w-full">
        <TabsList className="mb-4">
          {shopStocks.map(shop => (
            <TabsTrigger
              key={shop.shopId}
              value={shop.shopName}
            >
              {shop.shopName}
            </TabsTrigger>
          ))}
        </TabsList>

        {shopStocks.map(shop => (
          <TabsContent
            key={shop.shopId}
            value={shop.shopName}
          >
            <div className="rounded-xl border bg-white shadow-sm">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-center">
                      Remaining Qty
                    </TableHead>
                    <TableHead className="text-center">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {shop.items.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground">
                        No products assigned
                      </TableCell>
                    </TableRow>
                  ) : (
                    shop.items.map(item => (
                      <TableRow key={item.productId}>
                        <TableCell className="font-medium">
                          {item.productName}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.qty}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant={item.qty < 5 ? "destructive" : "secondary"}
                          >
                            {item.qty < 5 ? "Low Stock" : "OK"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  )
}
