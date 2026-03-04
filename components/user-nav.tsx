"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { CreditCard, LogOut, User } from "lucide-react";
import { useEffect, useState } from "react";

export function UserNav() {
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState({
    name: "",
    userId: "",
    role: "",
  });

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };
  const handleAccount = () => {
    window.location.href = "/admin/settings";
  };

  useEffect(() => {
    setUserInfo({
      name: user?.name || "",
      userId: user?.userId || "",
      role: user?.role || "",
    });
  }, [user]);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="size-12 rounded-xl hover:rounded-lg transition-all duration-200 bg-background/50 border-border/50 hover:bg-accent hover:text-accent-foreground"
          variant={"outline"}
          size={"icon"}
        >
          <Avatar>
            <AvatarImage
              src={"https://github.com/shadcn.png"}
              alt="User Image"
              className="object-cover"
            />
            <AvatarFallback>{userInfo.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        side="left"
        sideOffset={8}
        className="w-50"
      >
        <DropdownMenuLabel className="font-normal flex items-center gap-2 px-1 py-1.5 text-left text-sm">
          <Avatar className="relative size-8 rounded-lg">
            <AvatarImage
              src={"https://github.com/shadcn.png"}
              alt="User Image"
              className="object-cover"
            />
            <AvatarFallback>Win</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <p className="font-medium truncate">{userInfo.name}</p>
            <p className="text-muted-foreground truncate text-xs">
              {userInfo.userId}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {userInfo.role === "ADMIN" && (
          <DropdownMenuGroup onClick={handleAccount}>
            <DropdownMenuItem>
              <User />
              Account
            </DropdownMenuItem>
          </DropdownMenuGroup>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
