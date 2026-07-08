"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import AuthModal from "./AuthModal";

export default function LoginButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        로그인
      </Button>
      <AuthModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
