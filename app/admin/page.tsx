"use client"
import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { ShoppingCart, Store, Package, DollarSign, AlertTriangle } from "lucide-react"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

// ===== Fake Data =====
const dashboardData = {
  totalShops: 5,
  totalProducts: 18,
  remainingStockValue: 1250000,
  totalSoldValue: 980000,
}

const salesData = [
  { day: "Mon", sales: 120000 },
  { day: "Tue", sales: 90000 },
  { day: "Wed", sales: 150000 },
  { day: "Thu", sales: 110000 },
  { day: "Fri", sales: 200000 },
  { day: "Sat", sales: 180000 },
  { day: "Sun", sales: 130000 },
]

const topProducts = [
  { name: "Coca Cola", sold: 120 },
  { name: "Pepsi", sold: 95 },
  { name: "Potato Chips", sold: 80 },
]

const lowStockProducts = [
  { name: "Sprite", qty: 3 },
  { name: "Energy Drink", qty: 2 },
]

const shopPerformance = [
  { shop: "Shop A", sales: 420000 },
  { shop: "Shop B", sales: 310000 },
  { shop: "Shop C", sales: 250000 },
]

export default function AdminDashboardPage() {
  return (
    <section className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard title="Total Shops" value={dashboardData.totalShops} icon={<Store />} badge="Active" />
        <DashboardCard title="Total Products" value={dashboardData.totalProducts} icon={<Package />} badge="Inventory" />
        <DashboardCard title="Remaining Stock Value" value={`${dashboardData.remainingStockValue.toLocaleString()} Ks`} icon={<DollarSign />} badge="Current" />
        <DashboardCard title="Total Sold Value" value={`${dashboardData.totalSoldValue.toLocaleString()} Ks`} icon={<ShoppingCart />} badge="Revenue" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Daily Sales</CardTitle>
          </CardHeader>
          <CardContent className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="sales" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Shop Performance</CardTitle>
          </CardHeader>
          <CardContent className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={shopPerformance}>
                <XAxis dataKey="shop" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock */}
        <Card className="rounded-2xl border-red-200">
          <CardHeader className="flex flex-row items-center gap-2">
            <AlertTriangle className="text-red-500" />
            <CardTitle>Low Stock Alert</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Qty</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lowStockProducts.map((p) => (
                  <TableRow key={p.name}>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>
                      <Badge variant="destructive">{p.qty}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Top Selling */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Sold Qty</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topProducts.map((p) => (
                  <TableRow key={p.name}>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{p.sold}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

function DashboardCard({ title, value, icon, badge }) {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{value}</p>
        <Badge variant="secondary" className="mt-2">{badge}</Badge>
      </CardContent>
    </Card>
  )
}
