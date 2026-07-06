import LoginButton from "@/features/auth/components/LoginButton";

export default function Header() {
  return (
    <header className="flex justify-end px-8 py-5">
      <LoginButton />
    </header>
  );
}
