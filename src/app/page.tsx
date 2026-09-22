'use client'

import Link from 'next/link'
import {useEffect, useRef, useState} from 'react'
import type {MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent} from 'react'
import {ArrowLeft, ArrowRight, ChevronRight, Ticket, TrendingUp} from 'lucide-react'
import {classes, events, pools} from '@/mock/data'

const featuredEvents = events.slice(0, 4)
const formatDate = (value: string) => new Intl.DateTimeFormat('en-US', {month: 'short', day: 'numeric'}).format(new Date(value))

function RailControls({onPrevious, onNext, canPrevious}:{onPrevious:()=>void;onNext:()=>void;canPrevious:boolean}){
  return <>
    {canPrevious&&<button className="icon-btn home-rail-arrow previous" aria-label="Previous items" onClick={onPrevious}><ArrowLeft size={16}/></button>}
    <button className="icon-btn home-rail-arrow next" aria-label="Next items" onClick={onNext}><ArrowRight size={16}/></button>
  </>
}

export default function Home(){
  const [visualSlide, setVisualSlide] = useState(1)
  const [dragOffset, setDragOffset] = useState(0)
  const [carouselTransition, setCarouselTransition] = useState(true)
  const [trendingAtStart, setTrendingAtStart] = useState(true)
  const [poolsAtStart, setPoolsAtStart] = useState(true)
  const heroRef = useRef<HTMLDivElement>(null)
  const trendingRef = useRef<HTMLDivElement>(null)
  const poolsRef = useRef<HTMLDivElement>(null)
  const dragStartX = useRef(0)
  const dragOffsetRef = useRef(0)
  const dragged = useRef(false)
  const dragging = useRef(false)
  const carouselSlides = [featuredEvents[featuredEvents.length-1], ...featuredEvents, featuredEvents[0]]
  const activeSlide = ((visualSlide-1)%featuredEvents.length+featuredEvents.length)%featuredEvents.length

  useEffect(()=>{
    const timer = window.setInterval(()=>{if(!dragging.current){setCarouselTransition(true);setVisualSlide(current=>current+1)}},6000)
    return ()=>window.clearInterval(timer)
  },[])

  useEffect(()=>{
    if(visualSlide>0&&visualSlide<featuredEvents.length+1)return
    const timer=window.setTimeout(()=>{
      const normalized=((visualSlide-1)%featuredEvents.length+featuredEvents.length)%featuredEvents.length+1
      setCarouselTransition(false)
      setVisualSlide(normalized)
      window.requestAnimationFrame(()=>window.requestAnimationFrame(()=>setCarouselTransition(true)))
    },540)
    return ()=>window.clearTimeout(timer)
  },[visualSlide])

  const scrollRail = (ref: React.RefObject<HTMLDivElement | null>, direction: number) => ref.current?.scrollBy({left: direction * 330, behavior:'smooth'})
  const startHeroDrag = (event:ReactPointerEvent<HTMLDivElement>)=>{
    if(event.button!==0)return
    dragStartX.current=event.clientX
    dragged.current=false
    dragging.current=true
    dragOffsetRef.current=0
    setCarouselTransition(false)
    event.currentTarget.setPointerCapture(event.pointerId)
    event.currentTarget.classList.add('is-dragging')
  }
  const moveHeroDrag = (event:ReactPointerEvent<HTMLDivElement>)=>{
    if(!event.currentTarget.hasPointerCapture(event.pointerId))return
    const distance=event.clientX-dragStartX.current
    if(Math.abs(distance)>5)dragged.current=true
    if(dragged.current)event.preventDefault()
    dragOffsetRef.current=distance
    setDragOffset(distance)
  }
  const endHeroDrag = (event:ReactPointerEvent<HTMLDivElement>)=>{
    if(event.currentTarget.hasPointerCapture(event.pointerId))event.currentTarget.releasePointerCapture(event.pointerId)
    event.currentTarget.classList.remove('is-dragging')
    dragging.current=false
    const threshold=Math.min(90,event.currentTarget.clientWidth*.12)
    setCarouselTransition(true)
    const finalOffset=dragOffsetRef.current
    if(Math.abs(finalOffset)>threshold)setVisualSlide(current=>current+(finalOffset<0?1:-1))
    dragOffsetRef.current=0
    setDragOffset(0)
    window.setTimeout(()=>{dragged.current=false},0)
  }
  const preventDraggedNavigation=(event:ReactMouseEvent<HTMLDivElement>)=>{
    if(!dragged.current)return
    event.preventDefault()
    event.stopPropagation()
  }
  const normalizeCarousel=()=>{
    if(visualSlide>0&&visualSlide<featuredEvents.length+1)return
    const normalized=((visualSlide-1)%featuredEvents.length+featuredEvents.length)%featuredEvents.length+1
    setCarouselTransition(false)
    setVisualSlide(normalized)
    window.requestAnimationFrame(()=>window.requestAnimationFrame(()=>setCarouselTransition(true)))
  }

  return <div className="content home-content">
    <section className="home-carousel" aria-label="Featured events">
      <div className="home-carousel-track" ref={heroRef} onDragStart={event=>event.preventDefault()} onPointerDown={startHeroDrag} onPointerMove={moveHeroDrag} onPointerUp={endHeroDrag} onPointerCancel={endHeroDrag} onClickCapture={preventDraggedNavigation}>
        <div className="home-carousel-strip" onTransitionEnd={normalizeCarousel} style={{transform:`translate3d(calc(-${visualSlide*100}% + ${dragOffset}px),0,0)`,transition:carouselTransition?'transform 520ms cubic-bezier(.22,.72,.22,1)':'none'}}>
        {carouselSlides.map((event,index)=> <Link draggable={false} href={`/events/${event.id}`} className="home-slide" key={`${event.id}-${index}`} style={{backgroundImage:`url(${event.cover})`}} aria-label={`View ${event.name}`}>
          <div className="home-slide-shade"/>
          <div className="home-slide-content">
            <span className="home-kicker">Featured event</span>
            <h1>{event.name}</h1>
            <p>{event.artist} · {event.city} · {event.venue}</p>
            <div className="home-slide-details"><span>From ${classes.find(item=>item.eventId===event.id)?.marketPrice ?? 0}</span><span>{formatDate(event.startAt)}</span></div>
            <span className="btn primary home-slide-button">View event <ArrowRight size={15}/></span>
          </div>
        </Link>)}
        </div>
      </div>
      <div className="home-carousel-dots" aria-hidden="true">{featuredEvents.map((event,index)=><span key={event.id} className={index===activeSlide?'active':''}/>)}</div>
    </section>

    <section className="home-discovery-section">
      <div className="home-section-heading"><div><span className="home-kicker">Discover what is moving</span><h2>Trending now</h2></div><Link className="home-view-all" href="/events">View all <ChevronRight size={14}/></Link></div>
      <div className="home-rail-wrap"><div className="home-rail" ref={trendingRef} onScroll={event=>setTrendingAtStart(event.currentTarget.scrollLeft<8)}>{events.slice(0,6).map(event=><Link href={`/events/${event.id}`} className="home-event-card" key={event.id}>
        <div className="home-card-image" style={{backgroundImage:`url(${event.cover})`}}><span>{event.category}</span><span className="home-card-arrow" aria-hidden="true"><ArrowRight size={15}/></span></div>
        <div className="home-card-body"><h3>{event.name}</h3><p>{event.city} · {event.venue}</p><div><strong>From ${classes.find(item=>item.eventId===event.id)?.marketPrice ?? 0}</strong><span>{formatDate(event.startAt)}</span></div></div>
      </Link>)}</div><RailControls canPrevious={!trendingAtStart} onPrevious={()=>scrollRail(trendingRef,-1)} onNext={()=>scrollRail(trendingRef,1)}/></div>
    </section>

    <section className="home-discovery-section home-pools-section">
      <div className="home-section-heading"><div><span className="home-kicker">Draw into the best seats</span><h2>Popular pools</h2></div><Link className="home-view-all" href="/pools">View all <ChevronRight size={14}/></Link></div>
      <div className="home-rail-wrap"><div className="home-rail" ref={poolsRef} onScroll={event=>setPoolsAtStart(event.currentTarget.scrollLeft<8)}>{pools.slice(0,6).map(pool=><Link href={`/pools/${pool.id}`} className="home-pool-card" key={pool.id}>
        <div className="home-pool-image" style={{backgroundImage:`url(${pool.cover})`}}><span className="home-pool-live"><i/> Live pool</span><span className="home-pool-icon"><Ticket size={18}/></span></div>
        <div className="home-card-body"><h3>{pool.name}</h3><p>{pool.topPrize} top prize · {pool.remainingTickets.toLocaleString()} tickets left</p><div><strong>${pool.drawPrice} / draw</strong><span><TrendingUp size={13}/> ${pool.nav.toLocaleString()} NAV</span></div></div>
      </Link>)}</div><RailControls canPrevious={!poolsAtStart} onPrevious={()=>scrollRail(poolsRef,-1)} onNext={()=>scrollRail(poolsRef,1)}/></div>
    </section>
  </div>
}
