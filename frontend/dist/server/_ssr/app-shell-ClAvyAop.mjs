import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useNavigate, f as useRouterState, L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useAuth, j as cn, D as Dialog, a as DialogContent, c as DialogHeader, d as DialogTitle, B as Button, L as Label, I as Input, b as DialogFooter, s as supabase } from "./router-ZrQEyTVT.mjs";
import { R as Root, I as Image, F as Fallback } from "../_libs/radix-ui__react-avatar.mjs";
import { c as Root2, T as Trigger, P as Portal2, a as Content2, L as Label2, S as Separator2, I as Item2, e as SubTrigger2, d as SubContent2, C as CheckboxItem2, b as ItemIndicator2, R as RadioItem2 } from "../_libs/radix-ui__react-dropdown-menu.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { P as Pencil, K as KeyRound, m as LogOut, U as User, f as ChevronRight, c as Check, h as Circle, C as Calendar, D as DoorOpen, k as ClipboardList, S as Shield } from "../_libs/lucide-react.mjs";
const Avatar = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Root,
  {
    ref,
    className: cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className),
    ...props
  }
));
Avatar.displayName = Root.displayName;
const AvatarImage = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Image,
  {
    ref,
    className: cn("aspect-square h-full w-full", className),
    ...props
  }
));
AvatarImage.displayName = Image.displayName;
const AvatarFallback = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Fallback,
  {
    ref,
    className: cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    ),
    ...props
  }
));
AvatarFallback.displayName = Fallback.displayName;
const DropdownMenu = Root2;
const DropdownMenuTrigger = Trigger;
const DropdownMenuSubTrigger = reactExports.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  SubTrigger2,
  {
    ref,
    className: cn(
      "flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      inset && "pl-8",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "ml-auto" })
    ]
  }
));
DropdownMenuSubTrigger.displayName = SubTrigger2.displayName;
const DropdownMenuSubContent = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  SubContent2,
  {
    ref,
    className: cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)",
      className
    ),
    ...props
  }
));
DropdownMenuSubContent.displayName = SubContent2.displayName;
const DropdownMenuContent = reactExports.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Portal2, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
  Content2,
  {
    ref,
    sideOffset,
    className: cn(
      "z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)",
      className
    ),
    ...props
  }
) }));
DropdownMenuContent.displayName = Content2.displayName;
const DropdownMenuItem = reactExports.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Item2,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0",
      inset && "pl-8",
      className
    ),
    ...props
  }
));
DropdownMenuItem.displayName = Item2.displayName;
const DropdownMenuCheckboxItem = reactExports.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  CheckboxItem2,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    checked,
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ItemIndicator2, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }) }) }),
      children
    ]
  }
));
DropdownMenuCheckboxItem.displayName = CheckboxItem2.displayName;
const DropdownMenuRadioItem = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  RadioItem2,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ItemIndicator2, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Circle, { className: "h-2 w-2 fill-current" }) }) }),
      children
    ]
  }
));
DropdownMenuRadioItem.displayName = RadioItem2.displayName;
const DropdownMenuLabel = reactExports.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Label2,
  {
    ref,
    className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
    ...props
  }
));
DropdownMenuLabel.displayName = Label2.displayName;
const DropdownMenuSeparator = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Separator2,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
DropdownMenuSeparator.displayName = Separator2.displayName;
function ProfileMenu() {
  const { profile, signOut, refreshProfile, user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = reactExports.useRef(null);
  const [editOpen, setEditOpen] = reactExports.useState(false);
  const [passwordOpen, setPasswordOpen] = reactExports.useState(false);
  const [fullName, setFullName] = reactExports.useState("");
  const [avatarPreview, setAvatarPreview] = reactExports.useState(null);
  const [avatarFile, setAvatarFile] = reactExports.useState(null);
  const [savingProfile, setSavingProfile] = reactExports.useState(false);
  const [newPassword, setNewPassword] = reactExports.useState("");
  const [confirmPassword, setConfirmPassword] = reactExports.useState("");
  const [savingPassword, setSavingPassword] = reactExports.useState(false);
  const initials = (profile?.full_name || profile?.email || "?").split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  const openEdit = () => {
    setFullName(profile?.full_name ?? "");
    setAvatarPreview(profile?.avatar_url ?? null);
    setAvatarFile(null);
    setEditOpen(true);
  };
  const onAvatarPick = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };
  const uploadAvatar = async (uid, file) => {
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${uid}/avatar.${ext}`;
    const { error } = await supabase.storage.from("avatars").upload(path, file, {
      upsert: true,
      contentType: file.type
    });
    if (error) throw error;
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    return `${data.publicUrl}?t=${Date.now()}`;
  };
  const saveProfile = async () => {
    if (!user) return;
    const trimmed = fullName.trim();
    if (!trimmed) {
      toast.error("Username is required");
      return;
    }
    setSavingProfile(true);
    try {
      let avatarUrl = profile?.avatar_url ?? null;
      if (avatarFile) {
        avatarUrl = await uploadAvatar(user.id, avatarFile);
      }
      const { error } = await supabase.from("user_profiles").update({ full_name: trimmed, avatar_url: avatarUrl }).eq("id", user.id);
      if (error) throw error;
      await refreshProfile();
      toast.success("Profile updated");
      setEditOpen(false);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Could not update profile";
      toast.error(msg);
    } finally {
      setSavingProfile(false);
    }
  };
  const savePassword = async () => {
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setSavingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setSavingPassword(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Password updated");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordOpen(false);
  };
  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/auth" });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          className: "flex items-center gap-3 rounded-md px-1 py-1 transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E7A8A]",
          "aria-label": "Open profile menu",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden text-right sm:block", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium leading-tight", children: profile?.full_name || profile?.email }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs leading-tight text-slate-400", children: profile?.user_role === "admin" ? "Administrator" : "Employee" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "h-9 w-9 border border-slate-700", children: [
              profile?.avatar_url ? /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: profile.avatar_url, alt: "" }) : null,
              /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-[#0E7A8A] text-xs text-white", children: initials })
            ] })
          ]
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuContent, { align: "end", className: "w-52", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuLabel, { className: "font-normal", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-sm font-medium", children: profile?.full_name || profile?.email }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-xs text-muted-foreground", children: profile?.email })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuSeparator, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: openEdit, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "mr-2 h-4 w-4" }),
          "Edit profile"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: () => setPasswordOpen(true), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, { className: "mr-2 h-4 w-4" }),
          "Change password"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuSeparator, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: handleSignOut, className: "text-destructive focus:text-destructive", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "mr-2 h-4 w-4" }),
          "Sign out"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: editOpen, onOpenChange: setEditOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Edit profile" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "h-16 w-16 border", children: [
            avatarPreview ? /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: avatarPreview, alt: "" }) : null,
            /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-[#0E7A8A] text-lg text-white", children: initials })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                variant: "outline",
                size: "sm",
                onClick: () => fileInputRef.current?.click(),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "mr-2 h-4 w-4" }),
                  "Change photo"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                ref: fileInputRef,
                type: "file",
                accept: "image/*",
                className: "hidden",
                onChange: (e) => onAvatarPick(e.target.files?.[0] ?? null)
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "JPG, PNG or WebP" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "profile-name", children: "Username" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "profile-name",
              value: fullName,
              onChange: (e) => setFullName(e.target.value),
              placeholder: "Your display name"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setEditOpen(false), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: saveProfile, disabled: savingProfile, children: savingProfile ? "Saving…" : "Save" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: passwordOpen, onOpenChange: setPasswordOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Change password" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "new-password", children: "New password" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "new-password",
              type: "password",
              value: newPassword,
              onChange: (e) => setNewPassword(e.target.value),
              autoComplete: "new-password"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "confirm-password", children: "Confirm password" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "confirm-password",
              type: "password",
              value: confirmPassword,
              onChange: (e) => setConfirmPassword(e.target.value),
              autoComplete: "new-password"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setPasswordOpen(false), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: savePassword, disabled: savingPassword, children: savingPassword ? "Updating…" : "Update password" })
      ] })
    ] }) })
  ] });
}
function AppNavbar() {
  const { profile } = useAuth();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const navItem = (to, label, Icon) => {
    const active = path === to || to !== "/" && path.startsWith(to);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Link,
      {
        to,
        className: cn(
          "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
          active ? "bg-[#0E7A8A] text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"
        ),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" }),
          label
        ]
      }
    );
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-30 w-full border-b border-slate-800 bg-slate-900 text-white shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex h-14 max-w-7xl items-center justify-between px-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "flex items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/fincor-logo.webp", alt: "Fincor Logo", className: "h-8 w-auto object-contain" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "hidden items-center gap-1 md:flex", children: [
        navItem("/", "Desk Booking", Calendar),
        navItem("/rooms", "Room Booking", DoorOpen),
        navItem("/my-bookings", "My Bookings", ClipboardList),
        profile?.user_role === "admin" && navItem("/admin", "Admin", Shield)
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ProfileMenu, {})
  ] }) });
}
function AppShell({
  children,
  adminOnly = false
}) {
  const { loading, user, profile } = useAuth();
  const navigate = useNavigate();
  reactExports.useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate({ to: "/auth" });
      return;
    }
    if (adminOnly && profile && profile.user_role !== "admin") {
      navigate({ to: "/" });
    }
  }, [loading, user, profile, adminOnly, navigate]);
  if (loading || !user) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Loading…" }) });
  }
  if (adminOnly && profile?.user_role !== "admin") {
    return null;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AppNavbar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "mx-auto max-w-7xl px-4 py-6", children })
  ] });
}
export {
  AppShell as A
};
