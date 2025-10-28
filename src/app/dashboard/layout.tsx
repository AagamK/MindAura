import Header from '@/components/layout/header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="p-4 sm:p-6 lg:p-8">{children}</main>
    </>
  );
}
