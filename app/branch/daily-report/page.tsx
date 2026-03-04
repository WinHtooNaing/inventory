"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/context/AuthContext";

type DailySaleReportRow = {
  productId?: number;
  productName?: string;
  quantity?: number;
  qty?: number;
  soldQty?: number;
  totalQty?: number;
  salePrice?: number;
  price?: number;
  totalAmount?: number;
  totalPrice?: number;
  subtotal?: number;
  totalValue?: number;
};

type DailySaleReportResponse = {
  success?: boolean;
  branchId?: number;
  date?: string;
  items?: DailySaleReportRow[];
};

const toNumber = (value: unknown): number => {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
};

const getQty = (row: DailySaleReportRow) =>
  toNumber(row.totalQty ?? row.quantity ?? row.qty ?? row.soldQty);

const getPrice = (row: DailySaleReportRow) => toNumber(row.salePrice ?? row.price);

const getTotal = (row: DailySaleReportRow) =>
  toNumber(row.totalValue ?? row.totalAmount ?? row.totalPrice ?? row.subtotal);

export default function DailySaleReportPage() {
  const { user } = useAuth();

  const [userId, setUserId] = useState<number | null>(null);
  const [rows, setRows] = useState<DailySaleReportRow[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reportDate, setReportDate] = useState("");

  useEffect(() => {
    if (user?.id) {
      setUserId(user.id);
    }
  }, [user]);

  useEffect(() => {
    const fetchDailyReport = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        setError("");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/branch-report/${userId}/daily-products`,
        );

        if (!res.ok) throw new Error("Failed to fetch daily sale report");

        const data: DailySaleReportResponse | DailySaleReportRow[] =
          await res.json();

        if (Array.isArray(data)) {
          setRows(data);
          setReportDate("");
          return;
        }

        if (data?.success && Array.isArray(data.items)) {
          setRows(data.items);
          setReportDate(data.date || "");
          return;
        }

        setRows([]);
        setReportDate("");
        setError("Could not load daily report");
      } catch (err) {
        console.log("DAILY REPORT FETCH ERROR =>", err);
        setRows([]);
        setReportDate("");
        setError("Could not load daily report");
      } finally {
        setLoading(false);
      }
    };

    fetchDailyReport();
  }, [userId]);

  const filteredRows = useMemo(() => {
    return rows.filter((row) =>
      (row.productName || "").toLowerCase().includes(search.toLowerCase()),
    );
  }, [rows, search]);

  const grandTotal = useMemo(
    () => filteredRows.reduce((sum, row) => sum + getTotal(row), 0),
    [filteredRows],
  );

  return (
    <section className="p-6 space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Daily Sale Report</h1>
          {reportDate && (
            <p className="text-sm text-muted-foreground">Date: {reportDate}</p>
          )}
        </div>
        <p className="text-sm font-semibold">
          Total: {grandTotal.toLocaleString()} MMK
        </p>
      </div>

      <div className="w-full max-w-sm">
        <Input
          placeholder="Search product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead className="text-center">Qty Sold</TableHead>
              <TableHead className="text-center">Unit Price</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6">
                  Loading...
                </TableCell>
              </TableRow>
            )}

            {!loading && error && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-6 text-destructive"
                >
                  {error}
                </TableCell>
              </TableRow>
            )}

            {!loading &&
              !error &&
              filteredRows.map((row, idx) => (
                <TableRow key={`${row.productId ?? "p"}-${idx}`}>
                  <TableCell className="font-medium">
                    {row.productName || "-"}
                  </TableCell>
                  <TableCell className="text-center">{getQty(row)}</TableCell>
                  <TableCell className="text-center">
                    {getPrice(row).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {getTotal(row).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}

            {!loading && !error && filteredRows.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-6 text-muted-foreground"
                >
                  No daily sale data found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
