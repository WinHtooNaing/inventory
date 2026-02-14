"use client";

import React, { useState } from "react";
import {
  adminProfileSchema,
  adminPasswordSchema,
} from "@/types/admin-settings-schema";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function AdminSettingsPage() {
  const [admin, setAdmin] = useState({
    name: "Main Admin",
    userId: "admin01",
  });

  const [form, setForm] = useState({
    name: admin.name,
    userId: admin.userId,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<any>({});

  // ✅ PROFILE UPDATE
  const updateProfile = () => {
    const result = adminProfileSchema.safeParse({
      name: form.name,
      userId: form.userId,
    });

    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return;
    }

    setErrors({});

    // ✅ API READY STRUCTURE
    const payload = {
      name: form.name,
      userId: form.userId,
    };

    console.log("PROFILE API PAYLOAD =>", payload);

    setAdmin(payload);
  };

  // ✅ PASSWORD UPDATE
  const updatePassword = () => {
    const result = adminPasswordSchema.safeParse({
      currentPassword: form.currentPassword,
      newPassword: form.newPassword,
      confirmPassword: form.confirmPassword,
    });

    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return;
    }

    setErrors({});

    // ✅ API READY STRUCTURE
    const payload = {
      currentPassword: form.currentPassword,
      newPassword: form.newPassword,
    };

    console.log("PASSWORD API PAYLOAD =>", payload);
  };

  return (
    <section className="p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      {/* PROFILE */}
      <Card className="rounded-2xl shadow-sm mb-6">
        <CardHeader>
          <CardTitle>Admin Profile</CardTitle>
          <CardDescription>Update your account information</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            {errors?.name && (
              <p className="text-red-500 text-sm">{errors.name[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>User ID</Label>
            <Input
              value={form.userId}
              onChange={(e) => setForm({ ...form, userId: e.target.value })}
            />
            {errors?.userId && (
              <p className="text-red-500 text-sm">{errors.userId[0]}</p>
            )}
          </div>

          <div className="flex justify-end">
            <Button onClick={updateProfile}>Save Changes</Button>
          </div>
        </CardContent>
      </Card>

      {/* PASSWORD */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Keep your account secure</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Current Password</Label>
            <Input
              type="password"
              onChange={(e) =>
                setForm({ ...form, currentPassword: e.target.value })
              }
            />
            {errors?.currentPassword && (
              <p className="text-red-500 text-sm">
                {errors.currentPassword[0]}
              </p>
            )}
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>New Password</Label>
            <Input
              type="password"
              onChange={(e) =>
                setForm({ ...form, newPassword: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Confirm New Password</Label>
            <Input
              type="password"
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
            />
            {errors?.confirmPassword && (
              <p className="text-red-500 text-sm">
                {errors.confirmPassword[0]}
              </p>
            )}
          </div>

          <div className="flex justify-between items-center">
            <Badge variant="secondary">Last updated: just now</Badge>
            <Button variant="destructive" onClick={updatePassword}>
              Update Password
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
