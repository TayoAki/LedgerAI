import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:'Ledger — Agent Workspace',description:'A shared workspace for your bookkeeping agents, deliverables and handoffs.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
