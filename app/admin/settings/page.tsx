"use client";

import React, { useEffect, useState } from "react";
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
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const { user, setUser } = useAuth();

  const [profileForm, setProfileForm] = useState({
    name: "",
    userId: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<any>({});
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const router = useRouter();

  const forceLogout = () => {
    localStorage.clear(); // or removeItem("token")
    setUser(null);
    router.push("/");
  };
  const API = "http://localhost:8080/admin";

  /* ================= PROFILE UPDATE ================= */

  const updateProfile = async () => {
    const result = adminProfileSchema.safeParse(profileForm);

    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return;
    }

    setProfileLoading(true);

    try {
      const res = await fetch(`${API}/update-info`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileForm),
      });

      const data = await res.json();

      if (data.success) {
        forceLogout();
        toast.success("Profile Updated", {
          style: {
            background: "#16a34a", // green
            color: "#fff",
          },
        });
      }
    } catch (error) {
      toast.error("Server Error");
    }

    setProfileLoading(false);
  };
  /* ================= PASSWORD UPDATE ================= */

  const updatePassword = async () => {
    const result = adminPasswordSchema.safeParse(passwordForm);

    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return;
    }

    setPasswordLoading(true);

    try {
      const res = await fetch(`${API}/change-password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          oldPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const data = await res.json();

      if (data.success) {
        forceLogout();
        toast.success(data.message, {
          style: {
            background: "#16a34a", // green
            color: "#fff",
          },
        });
      } else {
        toast.error(data.message, {
          style: {
            background: "#dc2626", // red
            color: "#fff",
          },
        });
      }
    } catch (error) {
      toast.error("Server Error");
      console.log(error);
    }

    setPasswordLoading(false);
  };
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name,
        userId: user.userId,
      });
    }
  }, [user]);

  /* ================= UI ================= */

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
              value={profileForm.name}
              onChange={(e) =>
                setProfileForm({ ...profileForm, name: e.target.value })
              }
            />
            {errors?.name && (
              <p className="text-red-500 text-sm">{errors.name[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>User ID</Label>
            <Input
              value={profileForm.userId}
              onChange={(e) =>
                setProfileForm({ ...profileForm, userId: e.target.value })
              }
            />
            {errors?.userId && (
              <p className="text-red-500 text-sm">{errors.userId[0]}</p>
            )}
          </div>

          <div className="flex justify-end">
            <Button disabled={profileLoading} onClick={updateProfile}>
              {profileLoading ? "Saving..." : "Save Changes"}
            </Button>
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
              value={passwordForm.currentPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  currentPassword: e.target.value,
                })
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
              value={passwordForm.newPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  newPassword: e.target.value,
                })
              }
            />
            {errors?.newPassword && (
              <p className="text-red-500 text-sm">{errors.newPassword[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Confirm New Password</Label>
            <Input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  confirmPassword: e.target.value,
                })
              }
            />
            {errors?.confirmPassword && (
              <p className="text-red-500 text-sm">
                {errors.confirmPassword[0]}
              </p>
            )}
          </div>

          <div className="flex justify-between items-center">
            <Badge variant="secondary">Security Settings</Badge>
            <Button
              disabled={passwordLoading}
              variant="destructive"
              onClick={updatePassword}
            >
              {passwordLoading ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
