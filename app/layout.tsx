import type { Metadata } from 'next'
import ServiceWorker from './components/ServiceWorker'
import './globals.css'

export const metadata: Metadata = {
  title: 'ZoneBuddy - Time Zone Converter',
  description: 'Interactive time zone picker and converter',
  manifest: '/manifest.json',
  themeColor: '#FF9AA2',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'ZoneBuddy',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon-192.png" type="image/png" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body>
        {children}
        <ServiceWorker />
      </body>
    </html>
  )
}
