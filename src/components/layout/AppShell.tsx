'use client'

import Link from 'next/link'
import {usePathname, useRouter} from 'next/navigation'
import {useEffect, useMemo, useRef, useState} from 'react'
import {BarChart3, Bell, ChevronDown, Compass, Gift, Home, LogOut, Menu, Search, Settings, ShieldCheck, ShoppingBag, Ticket, TrendingUp, UserRound, Wallet, WalletCards, X} from 'lucide-react'
import {events} from '@/mock/data'
import {useAppStore} from '@/stores/app'

const links=[['/','Home',Home],['/events','Events',Compass],['/pools','Ticket Pools',Ticket],['/marketplace','Marketplace',ShoppingBag],['/trade','Trade Center',TrendingUp],['/portfolio','Portfolio',Wallet],['/wallet','Wallet',WalletCards],['/seller','Seller Studio',BarChart3],['/rewards','Rewards',Gift],['/profile','Profile',UserRound]] as const

export function AppShell({children}:{children:React.ReactNode}){
  const path=usePathname()
  const router=useRouter()
  const {sidebarOpen,toggleSidebar,login,logout,authenticated,toast,clearToast}=useAppStore()
  const [query,setQuery]=useState('')
  const [searchOpen,setSearchOpen]=useState(false)
  const [notificationsOpen,setNotificationsOpen]=useState(false)
  const [accountOpen,setAccountOpen]=useState(false)
  const shellRef=useRef<HTMLDivElement>(null)
  const results=useMemo(()=>query.trim()?events.filter(e=>`${e.name} ${e.artist} ${e.venue} ${e.city}`.toLowerCase().includes(query.toLowerCase())).slice(0,5):events.slice(0,3),[query])

  useEffect(()=>{if(!toast)return;const timer=setTimeout(clearToast,2800);return()=>clearTimeout(timer)},[toast,clearToast])
  useEffect(()=>{const close=(event:MouseEvent)=>{if(shellRef.current&&!shellRef.current.contains(event.target as Node)){setSearchOpen(false);setNotificationsOpen(false);setAccountOpen(false)}};document.addEventListener('mousedown',close);return()=>document.removeEventListener('mousedown',close)},[])
  const submitSearch=(event:React.FormEvent)=>{event.preventDefault();if(results[0]){router.push(`/events/${results[0].id}`);setSearchOpen(false);setQuery('')}}

  return <div className="app-shell">
    <aside className={`sidebar ${sidebarOpen?'open':''}`}>
      <Link href="/" className="brand"><span className="brand-mark">P</span><span>POPTIX</span><small>MARKETS</small></Link>
      <nav className="nav" aria-label="Primary navigation">{links.map(([href,label,Icon])=><Link key={href} href={href} className={path===href||href!=='/'&&path.startsWith(href)?'active':''} onClick={()=>sidebarOpen&&toggleSidebar()}><Icon size={17}/><span>{label}</span></Link>)}</nav>
      <div className="sidebar-foot"><div className="network-status"><span/><div><strong>Polygon</strong><small>Network operational</small></div><b>24ms</b></div><div className="rewards-callout"><div className="row"><span className="badge cyan">PXT REWARDS</span><Gift size={16}/></div><div className="strong rewards-title">12,450 points</div><div className="small muted rewards-copy">2,550 points until Platinum benefits.</div><Link className="btn secondary rewards-link" href="/rewards">View rewards</Link></div></div>
    </aside>
    <main className="main">
      <header className="header" ref={shellRef}>
        <button className="icon-btn mobile-menu" onClick={toggleSidebar} aria-label="Toggle navigation">{sidebarOpen?<X size={18}/>:<Menu size={18}/>}</button>
        <Link href="/" className="top-brand"><span className="brand-mark">P</span><strong>POPTIX</strong></Link>
        <nav className="top-nav" aria-label="Marketplace navigation">{links.filter(([,label])=>['Marketplace','Events','Ticket Pools','Trade Center'].includes(label)).map(([href,label])=><Link key={href} href={href} className={path===href||path.startsWith(`${href}/`)?'active':''}>{label==='Ticket Pools'?'Pools':label==='Trade Center'?'Activity':label}</Link>)}</nav>
        <form className="global-search" onSubmit={submitSearch} role="search">
          <Search size={17}/><input value={query} onFocus={()=>setSearchOpen(true)} onChange={e=>{setQuery(e.target.value);setSearchOpen(true)}} placeholder="Search events, artists or venues" aria-label="Search"/><kbd>/</kbd>
          {searchOpen&&<div className="search-popover">
            <div className="popover-label">{query?'Search results':'Popular now'}</div>
            {results.length?results.map(event=><Link href={`/events/${event.id}`} className="search-result" key={event.id} onClick={()=>{setSearchOpen(false);setQuery('')}}><span className="result-image" style={{backgroundImage:`url(${event.cover})`}}/><span><strong>{event.name}</strong><small>{event.city} · {event.venue}</small></span><span className="result-price">From ${220+event.id.length*11}</span></Link>):<div className="search-empty">No events match “{query}”.</div>}
            <Link href={`/events${query?`?q=${encodeURIComponent(query)}`:''}`} className="search-all" onClick={()=>setSearchOpen(false)}>Browse all events</Link>
          </div>}
        </form>
        <div className="header-actions">
          <div className="popover-anchor"><button className="icon-btn notification-button" onClick={()=>{setNotificationsOpen(v=>!v);setAccountOpen(false)}} aria-label="Notifications"><Bell size={17}/><i/></button>{notificationsOpen&&<div className="header-popover notification-popover"><div className="popover-title"><strong>Notifications</strong><span className="badge cyan">2 new</span></div><div className="notification-item"><span className="notification-icon success"><ShieldCheck size={15}/></span><span><strong>Ticket verified on-chain</strong><small>Your BLACKPINK CAT1 ticket is ready.</small><time>8 min ago</time></span></div><div className="notification-item"><span className="notification-icon"><TrendingUp size={15}/></span><span><strong>Price alert triggered</strong><small>Coldplay listings are now below $400.</small><time>2 hr ago</time></span></div></div>}</div>
          <div className="popover-anchor"><button className="account-trigger" onClick={()=>{setAccountOpen(v=>!v);setNotificationsOpen(false)}}><span className="avatar">AL</span><span className="account-copy"><strong>Alex Lee</strong><small>{authenticated?'Connected':'Guest mode'}</small></span><ChevronDown size={14}/></button>{accountOpen&&<div className="header-popover account-popover"><div className="wallet-summary"><span>Wallet balance</span><strong>$1,980.00</strong><small>0x8B7...93A1 · Polygon</small></div><Link href="/profile"><Settings size={15}/> Account settings</Link><Link href="/portfolio"><Wallet size={15}/> Portfolio</Link>{authenticated?<button onClick={()=>{logout();setAccountOpen(false)}}><LogOut size={15}/> Sign out</button>:<button onClick={()=>{login();setAccountOpen(false)}}><Wallet size={15}/> Connect account</button>}</div>}</div>
        </div>
      </header>
      {children}
    </main>
    <nav className="mobile-bottom-nav" aria-label="Mobile navigation">{links.filter(([,label])=>['Home','Events','Ticket Pools','Portfolio','Profile'].includes(label)).map(([href,label,Icon])=><Link key={href} href={href} className={path===href||href!=='/'&&path.startsWith(href)?'active':''}><Icon size={18}/><span>{label==='Ticket Pools'?'Pools':label}</span></Link>)}</nav>
    {toast&&<div className={`toast ${toast.kind}`} role="status"><span>{toast.kind==='success'?<ShieldCheck size={16}/>:<Bell size={16}/>}</span>{toast.message}</div>}
  </div>
}
