export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Auth layout - no navbar, completely clean for login/authentication pages
  return <>{children}</>
}

