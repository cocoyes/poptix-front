'use client'

import {useMemo,useState} from 'react'
import {CalendarRange,Search,X} from 'lucide-react'
import {events} from '@/mock/data'
import {EventCard} from '@/components/shared/Cards'

export default function Events(){
  const [cat,setCat]=useState('all')
  const [query,setQuery]=useState('')
  const [location,setLocation]=useState('all')
  const [sort,setSort]=useState('soonest')
  const filtered=useMemo(()=>events.filter(event=>(cat==='all'||event.category===cat)&&(location==='all'||event.city===location)&&(!query||`${event.name} ${event.artist} ${event.venue}`.toLowerCase().includes(query.toLowerCase()))).sort((a,b)=>sort==='soonest'?new Date(a.startAt).getTime()-new Date(b.startAt).getTime():a.name.localeCompare(b.name)),[cat,query,location,sort])
  const reset=()=>{setCat('all');setQuery('');setLocation('all')}
  return <div className="content">
    <div className="page-heading"><div><div className="eyebrow">DISCOVER LIVE EXPERIENCES</div><h1 className="title">Events</h1><p className="subtitle">Find a date, compare the market and buy with verified ownership.</p></div><div className="heading-stat"><span>LIVE MARKETS</span><strong>328</strong><small>Across 18 countries</small></div></div>
    <div className="tabs event-tabs">{[['all','All events'],['concert','Concerts'],['sports','Sports'],['festival','Festivals'],['theater','Theater']].map(([id,label])=><button key={id} className={`tab ${cat===id?'active':''}`} onClick={()=>setCat(id)}>{label}</button>)}</div>
    <div className="discovery-toolbar"><div className="market-search"><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search events or artists"/>{query&&<button onClick={()=>setQuery('')} aria-label="Clear search"><X size={14}/></button>}</div><select className="select" value={location} onChange={e=>setLocation(e.target.value)}><option value="all">All locations</option>{[...new Set(events.map(e=>e.city))].map(city=><option key={city}>{city}</option>)}</select><label className="sort-control"><CalendarRange size={15}/><select value={sort} onChange={e=>setSort(e.target.value)}><option value="soonest">Soonest first</option><option value="name">Event name</option></select></label></div>
    <div className="result-summary"><span><strong>{filtered.length}</strong> events</span><span>Prices include available resale inventory</span></div>
    {filtered.length?<div className="grid grid-4">{filtered.map(event=><EventCard key={event.id} event={event}/>)}</div>:<div className="empty-state"><span><Search size={23}/></span><h2>No matching events</h2><p>Adjust the category, location or search term.</p><button className="btn primary" onClick={reset}>Reset filters</button></div>}
  </div>
}
