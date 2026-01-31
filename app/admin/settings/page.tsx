"use client"
import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

export default function AdminSettingsPage() {
  // fake admin data
  const [admin, setAdmin] = useState({
    name: "Main Admin",
    email: "admin@example.com",
    password: "********",
  })

  const [form, setForm] = useState({
    name: admin.name,
    email: admin.email,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const updateProfile = () => {
    setAdmin({ ...admin, name: form.name, email: form.email })
    alert("Profile updated (fake)")
  }

  const updatePassword = () => {
    if (form.newPassword !== form.confirmPassword) {
      alert("Password not match")
      return
    }
    alert("Password updated (fake)")
  }

  return (
    <section className="p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      {/* Profile Info */}
      <Card className="rounded-2xl shadow-sm mb-6">
        <CardHeader>
          <CardTitle>Admin Profile</CardTitle>
          <CardDescription>Update your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="flex justify-end">
            <Button onClick={updateProfile}>Save Changes</Button>
          </div>
        </CardContent>
      </Card>

      {/* Password */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Keep your account secure</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Current Password</Label>
            <Input type="password" onChange={e => setForm({ ...form, currentPassword: e.target.value })} />
          </div>
          <Separator />
          <div className="space-y-2">
            <Label>New Password</Label>
            <Input type="password" onChange={e => setForm({ ...form, newPassword: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Confirm New Password</Label>
            <Input type="password" onChange={e => setForm({ ...form, confirmPassword: e.target.value })} />
          </div>
          <div className="flex justify-between items-center">
            <Badge variant="secondary">Last updated: just now</Badge>
            <Button variant="destructive" onClick={updatePassword}>Update Password</Button>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
