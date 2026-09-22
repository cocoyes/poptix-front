'use client'

import Link from 'next/link'
import {useMemo,useState} from 'react'
import {ArrowDownUp,ArrowUpRight,Check,Grid2X2,List,MapPin,Search,ShieldCheck,SlidersHorizontal,TicketCheck,X} from 'lucide-react'
import {classes,events,listings} from '@/mock/data'

type View='grid'|'list'

export default function Marketplace(){
  const [query,setQuery]=useState('')
  const [category,setCategory]=useState('all')
  const [price,setPrice]=useState('all')
  const [sort,setSort]=useState('value')
  const [view,setView]=useState<View>('grid')
  const [filtersOpen,setFiltersOpen]=useState(false)
  const filtered=useMemo(()=>listings.filter(listing=>{const event=events.find(item=>item.id===listing.eventId)!;const matchesQuery=!query||`${event.name} ${event.artist} ${event.city}`.toLowerCase().includes(query.toLowerCase());const matchesCategory=category==='all'||event.category===category;const matchesPrice=price==='all'||price==='under300'&&listing.price<300||price==='300to500'&&listing.price>=300&&listing.price<=500||price==='over500'&&listing.price>500;return matchesQuery&&matchesCategory&&matchesPrice}).sort((a,b)=>sort==='lowest'?a.price-b.price:sort==='recent'?Number(b.id.split('-')[1])-Number(a.id.split('-')[1]):(a.price/a.officialPrice)-(b.price/b.officialPrice)),[query,category,price,sort])
  const reset=()=>{setQuery('');setCategory('all');setPrice('all');setSort('value')}
  const activeFilters=[category!=='all',price!=='all',query!==''].filter(Boolean).length

  return <div className="content marketplace-page opensea-market">
    <section className="market-featured" style={{backgroundImage:`url(${events[4].cover})`}}>
      <div className="featured-copy"><div className="eyebrow"><span className="live-pip"/> FEATURED MARKET</div><h1>Collect the moment.</h1><p>{events[4].name} returns to {events[4].venue}. Own a verified ticket, trade it freely, or redeem it at the gate.</p><div className="featured-actions"><Link className="btn primary" href={`/events/${events[4].id}`}>Explore tickets</Link><Link className="btn glass" href="/trade">View market <ArrowUpRight size={14}/></Link></div><div className="featured-stats"><span><small>Floor</small><strong>$338</strong></span><span><small>Owners</small><strong>2.4K</strong></span><span><small>Volume</small><strong>$486K</strong></span></div></div>
      <div className="featured-badge"><ShieldCheck size={15}/><span><strong>Verified collection</strong><small>Issued ticket assets</small></span></div>
    </section>

    <section className="trending-collections"><div className="collection-title"><div><h2>Trending collections</h2><p>Ticket markets moving right now</p></div><Link href="/events">View all <ArrowUpRight size={14}/></Link></div><div className="collection-grid">{events.slice(0,5).map((event,index)=>{const floor=220+event.id.length*11+index*9;return <Link href={`/events/${event.id}`} className="collection-row" key={event.id}><b>{index+1}</b><span className="collection-art" style={{backgroundImage:`url(${event.cover})`}}/><span className="collection-name"><strong>{event.name}</strong><small>{event.category} · {event.city}</small></span><span><small>Floor</small><strong>${floor}</strong></span><span><small>24h volume</small><strong>${[84.2,63.8,48.1,36.4,28.9][index]}K</strong></span><span className={index===3?'negative':'positive'}>{index===3?'−2.4%':`+${[18.4,12.9,9.6,0,6.2][index]}%`}</span></Link>})}</div></section>

    <div className="browse-heading"><div><h2>Explore tickets</h2><p>Discover verified assets across every live market</p></div><div className="category-pills">{[['all','All'],['concert','Music'],['sports','Sports'],['festival','Festivals'],['theater','Theater']].map(([id,label])=><button key={id} className={category===id?'active':''} onClick={()=>setCategory(id)}>{label}</button>)}</div></div>

    <section className="market-toolbar" aria-label="Marketplace filters">
      <div className="market-search"><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search event, artist or city"/><kbd>{filtered.length}</kbd></div>
      <select className="select" value={category} onChange={e=>setCategory(e.target.value)} aria-label="Category"><option value="all">All categories</option><option value="concert">Concerts</option><option value="sports">Sports</option><option value="festival">Festivals</option><option value="theater">Theater</option></select>
      <select className="select" value={price} onChange={e=>setPrice(e.target.value)} aria-label="Price"><option value="all">Any price</option><option value="under300">Under $300</option><option value="300to500">$300 – $500</option><option value="over500">$500+</option></select>
      <button className={`btn secondary mobile-filter ${filtersOpen?'active':''}`} onClick={()=>setFiltersOpen(v=>!v)}><SlidersHorizontal size={15}/> Filters {activeFilters?`(${activeFilters})`:''}</button>
    </section>

    <div className="market-result-bar"><span><strong>{filtered.length}</strong> verified listings <i>·</i> Updated just now</span><div className="market-controls"><label><ArrowDownUp size={14}/><select value={sort} onChange={e=>setSort(e.target.value)}><option value="value">Best value</option><option value="lowest">Lowest price</option><option value="recent">Recently listed</option></select></label><div className="segmented" aria-label="View mode"><button className={view==='list'?'active':''} onClick={()=>setView('list')} aria-label="List view"><List size={16}/></button><button className={view==='grid'?'active':''} onClick={()=>setView('grid')} aria-label="Grid view"><Grid2X2 size={16}/></button></div></div></div>

    {activeFilters>0&&<div className="filter-chips">{query&&<button onClick={()=>setQuery('')}>“{query}” <X size={12}/></button>}{category!=='all'&&<button onClick={()=>setCategory('all')}>{category} <X size={12}/></button>}{price!=='all'&&<button onClick={()=>setPrice('all')}>{price==='under300'?'Under $300':price==='300to500'?'$300 – $500':'$500+'} <X size={12}/></button>}<button className="clear-filter" onClick={reset}>Clear all</button></div>}

    {filtered.length?<div className={`market-inventory ${view}`}><div className="inventory-head"><span>Event</span><span>Seat</span><span>Trust & delivery</span><span>Price</span><span/></div>{filtered.slice(0,24).map((listing,index)=>{const event=events.find(item=>item.id===listing.eventId)!;const ticketClass=classes.find(item=>item.id===listing.ticketClassId)!;const delta=Math.round((listing.price/listing.officialPrice-1)*100);return <article className="market-listing" key={listing.id}>
      <Link className="listing-event" href={`/events/${event.id}`}><span className="listing-thumb" style={{backgroundImage:`url(${event.cover})`}}/><span><strong>{event.name}</strong><small><MapPin size={12}/>{event.city} · {new Date(event.startAt).toLocaleDateString('en-US',{month:'short',day:'numeric'})}</small></span></Link>
      <div className="listing-seat"><span className="badge">{ticketClass.name}</span><strong>Section {listing.section}</strong><small>Row {listing.row} · Seats together</small></div>
      <div className="listing-trust"><span><ShieldCheck size={14}/> Ownership verified</span><small><TicketCheck size={13}/> Mobile transfer before event</small></div>
      <div className="listing-cost"><strong>${listing.price}</strong><span className={delta<=0?'deal':'premium'}>{delta<=0?`${Math.abs(delta)}% below face`:`${delta}% above face`}</span><small>All fees shown at checkout</small></div>
      <div className="listing-cta">{index<3&&<span className="value-tag"><Check size={12}/> Popular pick</span>}<Link className="btn primary" href={`/events/${event.id}#listings`}>Buy now</Link></div>
    </article>})}</div>:<div className="empty-state"><span><Search size={23}/></span><h2>No tickets found</h2><p>Try removing a filter or searching for another event.</p><button className="btn primary" onClick={reset}>Reset filters</button></div>}
  </div>
}
