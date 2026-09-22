import './globals.css'
import './style-v2.css'
import './h5.css'
import './gacha.css'
import './professional.css'
import './premium.css'
import './opensea.css'
import './opensea-fixes.css'
import { AppShell } from '@/components/layout/AppShell'
export const metadata={title:'POPTIX — Trade Live Experiences',description:'Buy, draw, trade and redeem verified tickets for the world’s biggest live events.'}
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><AppShell>{children}</AppShell></body></html>}
