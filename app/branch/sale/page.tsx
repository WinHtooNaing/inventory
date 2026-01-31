// "use client"

// import React, { useState } from "react"
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Badge } from "@/components/ui/badge"

// type Product = {
//   id: number
//   name: string
//   price: number
//   qty: number
// }

// type CartItem = {
//   id: number
//   name: string
//   price: number
//   qty: number
// }

// export default function ShopSalesPage() {
//   const [products, setProducts] = useState<Product[]>([
//     { id: 1, name: "Football Jersey", price: 25000, qty: 8 },
//     { id: 2, name: "Boots", price: 50000, qty: 3 },
//     { id: 3, name: "Socks", price: 5000, qty: 20 },
//   ])

//   const [cart, setCart] = useState<CartItem[]>([])
//   const [search, setSearch] = useState("")

//   /* ---------------- Products ---------------- */

//   const filteredProducts = products.filter(p =>
//     p.name.toLowerCase().includes(search.toLowerCase())
//   )

//   const addToCart = (product: Product) => {
//     if (product.qty <= 0) return

//     const item = cart.find(c => c.id === product.id)

//     if (item) {
//       if (item.qty >= product.qty) return
//       setCart(cart.map(c =>
//         c.id === product.id ? { ...c, qty: c.qty + 1 } : c
//       ))
//     } else {
//       setCart([...cart, { ...product, qty: 1 }])
//     }
//   }

//   /* ---------------- Cart ---------------- */

//   const increaseQty = (id: number) => {
//     const product = products.find(p => p.id === id)
//     const item = cart.find(c => c.id === id)
//     if (!product || !item || item.qty >= product.qty) return

//     setCart(cart.map(c =>
//       c.id === id ? { ...c, qty: c.qty + 1 } : c
//     ))
//   }

//   const decreaseQty = (id: number) => {
//     setCart(cart
//       .map(c =>
//         c.id === id ? { ...c, qty: c.qty - 1 } : c
//       )
//       .filter(c => c.qty > 0)
//     )
//   }

//   const checkout = () => {
//     setProducts(products.map(p => {
//       const item = cart.find(c => c.id === p.id)
//       return item ? { ...p, qty: p.qty - item.qty } : p
//     }))
//     setCart([])
//   }

//   const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0)

//   return (
//     <section className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

//       {/* PRODUCTS TABLE */}
//       <div className="lg:col-span-2 space-y-4">
//         <h1 className="text-2xl font-bold">🏬 Products</h1>

//         <Input
//           placeholder="Search product..."
//           value={search}
//           onChange={e => setSearch(e.target.value)}
//         />

//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Name</TableHead>
//               <TableHead>Price</TableHead>
//               <TableHead>Stock</TableHead>
//               <TableHead className="text-right">Action</TableHead>
//             </TableRow>
//           </TableHeader>

//           <TableBody>
//             {filteredProducts.map(p => (
//               <TableRow key={p.id}>
//                 <TableCell>{p.name}</TableCell>
//                 <TableCell>{p.price.toLocaleString()}</TableCell>
//                 <TableCell>
//                   <Badge variant={p.qty < 5 ? "destructive" : "secondary"}>
//                     {p.qty}
//                   </Badge>
//                 </TableCell>
//                 <TableCell className="text-right">
//                   <Button
//                     size="sm"
//                     disabled={p.qty === 0}
//                     onClick={() => addToCart(p)}
//                   >
//                     Add
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>

//       {/* CART TABLE */}
//       <div className="space-y-4">
//         <h2 className="text-xl font-bold">🛒 Cart</h2>

//         {cart.length === 0 && (
//           <p className="text-sm text-muted-foreground">
//             Cart is empty
//           </p>
//         )}

//         {cart.length > 0 && (
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Product</TableHead>
//                 <TableHead>Qty</TableHead>
//                 <TableHead>Subtotal</TableHead>
//               </TableRow>
//             </TableHeader>

//             <TableBody>
//               {cart.map(c => (
//                 <TableRow key={c.id}>
//                   <TableCell>{c.name}</TableCell>
//                   <TableCell>
//                     <div className="flex items-center gap-2">
//                       <Button size="sm" onClick={() => decreaseQty(c.id)}>-</Button>
//                       <span>{c.qty}</span>
//                       <Button size="sm" onClick={() => increaseQty(c.id)}>+</Button>
//                     </div>
//                   </TableCell>
//                   <TableCell>
//                     {(c.qty * c.price).toLocaleString()}
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         )}

//         <div className="border-t pt-2 space-y-2">
//           <p className="font-bold">
//             Total: {total.toLocaleString()} MMK
//           </p>
//           <Button
//             className="w-full"
//             disabled={cart.length === 0}
//             onClick={checkout}
//           >
//             Checkout
//           </Button>
//         </div>
//       </div>
//     </section>
//   )
// }


"use client"

import React, { useState, useRef } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type Product = {
  id: number
  name: string
  price: number
  qty: number
}

type CartItem = {
  id: number
  name: string
  price: number
  qty: number
}

export default function ShopSalesPage() {
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "Football Jersey", price: 25000, qty: 8 },
    { id: 2, name: "Boots", price: 50000, qty: 3 },
    { id: 3, name: "Socks", price: 5000, qty: 20 },
  ])

  const [cart, setCart] = useState<CartItem[]>([])
  const [search, setSearch] = useState("")
  const [openInvoice, setOpenInvoice] = useState(false)

  const printRef = useRef<HTMLDivElement>(null)

  /* ---------------- Products ---------------- */

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  const addToCart = (product: Product) => {
    if (product.qty <= 0) return

    const item = cart.find(c => c.id === product.id)

    if (item) {
      if (item.qty >= product.qty) return
      setCart(cart.map(c =>
        c.id === product.id ? { ...c, qty: c.qty + 1 } : c
      ))
    } else {
      setCart([...cart, { ...product, qty: 1 }])
    }
  }

  /* ---------------- Cart ---------------- */

  const increaseQty = (id: number) => {
    const product = products.find(p => p.id === id)
    const item = cart.find(c => c.id === id)
    if (!product || !item || item.qty >= product.qty) return

    setCart(cart.map(c =>
      c.id === id ? { ...c, qty: c.qty + 1 } : c
    ))
  }

  const decreaseQty = (id: number) => {
    setCart(
      cart
        .map(c => (c.id === id ? { ...c, qty: c.qty - 1 } : c))
        .filter(c => c.qty > 0)
    )
  }

  const checkout = () => {
    setProducts(products.map(p => {
      const item = cart.find(c => c.id === p.id)
      return item ? { ...p, qty: p.qty - item.qty } : p
    }))
    setOpenInvoice(true)
  }

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0)

  const printInvoice = () => {
    const printContent = printRef.current?.innerHTML
    if (!printContent) return

    const win = window.open("", "", "width=800,height=600")
    if (!win) return

    win.document.write(`
      <html>
        <head>
          <title>Invoice</title>
          <style>
            body { font-family: Arial; padding: 20px }
            table { width: 100%; border-collapse: collapse }
            th, td { border: 1px solid #000; padding: 8px; text-align: left }
            h2, h3 { text-align: center }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `)
    win.document.close()
    win.print()
    win.close()
  }

  return (
    <section className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* PRODUCTS */}
      <div className="lg:col-span-2 space-y-4">
        <h1 className="text-2xl font-bold">🏬 Products</h1>

        <Input
          placeholder="Search product..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map(p => (
              <TableRow key={p.id}>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.price.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant={p.qty < 5 ? "destructive" : "secondary"}>
                    {p.qty}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button size="sm" disabled={p.qty === 0} onClick={() => addToCart(p)}>
                    Add
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* CART */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">🛒 Cart</h2>

        {cart.length === 0 && <p className="text-sm text-muted-foreground">Cart is empty</p>}

        {cart.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cart.map(c => (
                <TableRow key={c.id}>
                  <TableCell>{c.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button size="sm" onClick={() => decreaseQty(c.id)}>-</Button>
                      <span>{c.qty}</span>
                      <Button size="sm" onClick={() => increaseQty(c.id)}>+</Button>
                    </div>
                  </TableCell>
                  <TableCell>{(c.qty * c.price).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <div className="border-t pt-2 space-y-2">
          <p className="font-bold">Total: {total.toLocaleString()} MMK</p>
          <Button className="w-full" disabled={cart.length === 0} onClick={checkout}>
            Checkout
          </Button>
        </div>
      </div>

      {/* INVOICE DIALOG */}
      <Dialog open={openInvoice} onOpenChange={setOpenInvoice}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>🧾 Invoice</DialogTitle>
          </DialogHeader>

          <div ref={printRef}>
            <h2>Shop Invoice</h2>
            <p>Date: {new Date().toLocaleString()}</p>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.map(c => (
                  <TableRow key={c.id}>
                    <TableCell>{c.name}</TableCell>
                    <TableCell>{c.qty}</TableCell>
                    <TableCell>{c.price.toLocaleString()}</TableCell>
                    <TableCell>{(c.qty * c.price).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <h3>Total: {total.toLocaleString()} MMK</h3>
          </div>

          <Button onClick={printInvoice}>🖨 Print</Button>
        </DialogContent>
      </Dialog>
    </section>
  )
}
