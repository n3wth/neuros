import SiteHeader from '@/components/layout/site-header'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <SiteHeader />
      {children}
    </>
  )
}