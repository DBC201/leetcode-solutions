export const metadata = {
  title: 'LeetCode Solutions',
  icons: {
    icon: [
      { url: '/favicon.ico?q=31', rel: 'shortcut icon' },
      { url: '/favicon-96x96.png?q=31', type: 'image/png', sizes: '96x96' },
      { url: '/favicon.svg?q=31', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.png?q=31', sizes: '180x180' },
    ],
  },
  manifest: '/site.webmanifest?q=31',
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
