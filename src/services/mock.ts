import { classes, events, listings, pools } from '@/mock/data'
const wait=(ms=320)=>new Promise(r=>setTimeout(r,ms))
export async function getEvents(){await wait();return events}
export async function getEvent(id:string){await wait();return events.find(e=>e.id===id) ?? events[0]}
export async function getClasses(eventId:string){await wait();return classes.filter(c=>c.eventId===eventId)}
export async function getPools(){await wait();return pools}
export async function getPool(id:string){await wait();return pools.find(p=>p.id===id) ?? pools[0]}
export async function getListings(){await wait();return listings}
