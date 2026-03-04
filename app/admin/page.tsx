"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { ShoppingCart, Store, Package, AlertTriangle } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState({});
  const [salesData, setSalesData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [shopPerformance, setShopPerformance] = useState([]);

  const fetchDashboard = async () => {
    try {
      const [summaryRes, salesRes, topRes, lowRes, shopRes] = await Promise.all(
        [
          fetch(`${API}/dashboard/summary`),
          fetch(`${API}/dashboard/daily-sales?days=7`),
          fetch(`${API}/dashboard/top-products?days=30&limit=5`),
          fetch(`${API}/dashboard/low-stock?threshold=5`),
          fetch(`${API}/dashboard/shop-performance?days=30`),
        ],
      );

      const summaryData = await summaryRes.json();
      const sales = await salesRes.json();
      const top = await topRes.json();
      const low = await lowRes.json();
      const shop = await shopRes.json();
      console.log(sales);
      setSummary(summaryData);

      // Chart format
      setSalesData(
        sales.map((s: any) => ({
          day: new Date(s.saleDate).toLocaleDateString(),
          sales: s.totalValue,
        })),
      );

      setTopProducts(top);
      setLowStockProducts(low);

      setShopPerformance(
        shop.map((s: any) => ({
          shop: s.branchName,
          sales: s.totalValue,
        })),
      );
    } catch (err) {
      console.log("Dashboard fetch error", err);
    }
  };
  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <section className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Shops"
          value={summary.totalShops || 0}
          icon={<Store />}
          badge="Active"
        />
        <DashboardCard
          title="Total Products"
          value={summary.totalProducts || 0}
          icon={<Package />}
          badge="Inventory"
        />
        {/* <DashboardCard
          title="Remaining Stock Value"
          value={`${(summary.remainingStockValue || 0).toLocaleString()} Ks`}
          icon={<DollarSign />}
          badge="Current"
        /> */}
        <DashboardCard
          title="Total Sold Value"
          value={`${(summary.totalSoldValue || 0).toLocaleString()} Ks`}
          icon={<ShoppingCart />}
          badge="Revenue"
        />
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
                {lowStockProducts.map((p: any) => (
                  <TableRow key={p.productId}>
                    <TableCell>{p.productName}</TableCell>
                    <TableCell>
                      <Badge variant="destructive">{p.arrivalQty}</Badge>
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
                {topProducts.map((p: any) => (
                  <TableRow key={p.productId}>
                    <TableCell>{p.productName}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{p.totalQty}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function DashboardCard({ title, value, icon, badge }: any) {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{value}</p>
        <Badge variant="secondary" className="mt-2">
          {badge}
        </Badge>
      </CardContent>
    </Card>
  );
}
