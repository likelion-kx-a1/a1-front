import AuthStatus from "@/features/auth/components/AuthStatus";

export default function Header() {
  return (
    <header className="flex justify-end px-8 py-5">
      <AuthStatus />
    </header>
  );
}
