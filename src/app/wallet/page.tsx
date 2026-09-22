'use client'

import {useState} from 'react'
import {ArrowDownToLine,ArrowUpFromLine,Building2,Check,ChevronRight,CreditCard,ShieldCheck,WalletCards,Zap} from 'lucide-react'
import {useAppStore} from '@/stores/app'

const transactions=[
  ['Ticket sale · BLACKPINK CAT1','+$328.00','Pending settlement','pending'],
  ['Ticket Pool draw · VIP2','-$224.00','Completed · Polygon','complete'],
  ['USDC deposit','+$500.00','Completed · 2 min ago','complete'],
  ['Marketplace purchase · F1','-$317.00','Completed · 1 hr ago','complete'],
] as const

export default function WalletPage(){
  const {showToast}=useAppStore()
  const [flow,setFlow]=useState<'deposit'|'withdraw'|null>(null)
  const [method,setMethod]=useState('card')
  const [amount,setAmount]=useState('500')
  const submit=()=>{if(!Number(amount))return;showToast(`${flow==='deposit'?'Deposit':'Withdrawal'} request submitted · $${amount}`,'success');setFlow(null)}
  return <div className="content wallet-page">
    <div className="page-heading"><div><div className="eyebrow">FUNDS & SETTLEMENT</div><h1 className="title">Wallet</h1><p className="subtitle">One USD balance for tickets, draws, offers and cash-out.</p></div><div className="wallet-pill"><span className="status-dot"/>Polygon · Operational <strong>24ms</strong></div></div>
    <section className="balance-hero"><div><span className="eyebrow">TOTAL BALANCE</span><strong>$1,980.00</strong><small>≈ 1,980 USD · updated just now</small></div><div className="balance-actions"><button className="btn primary" onClick={()=>setFlow('deposit')}><ArrowDownToLine size={15}/> Deposit</button><button className="btn secondary" onClick={()=>setFlow('withdraw')}><ArrowUpFromLine size={15}/> Withdraw</button></div></section>
    <section className="balance-grid"><div><span>Available</span><strong>$1,980.00</strong><small>Ready for Buy, Draw, Bid</small></div><div><span>Locked</span><strong>$330.00</strong><small>1 active offer · 1 draw</small></div><div><span>Pending</span><strong>$328.00</strong><small>Seller settlement reserve</small></div></section>
    <section className="section wallet-columns"><div><div className="section-head"><div><h2>Payment methods</h2><p className="small muted">Choose the easiest way to move funds.</p></div><button className="text-button" onClick={()=>showToast('Payment method manager opened')}>Manage</button></div><div className="payment-methods"><button className={`payment-method ${method==='card'?'selected':''}`} onClick={()=>setMethod('card')}><span className="payment-icon"><CreditCard size={17}/></span><span><strong>Visa ending 4242</strong><small>Instant · 2.9% processing</small></span><Check size={16}/></button><button className={`payment-method ${method==='wallet'?'selected':''}`} onClick={()=>setMethod('wallet')}><span className="payment-icon"><WalletCards size={17}/></span><span><strong>0x8B7...93A1</strong><small>USDC on Polygon · gas sponsored</small></span><Check size={16}/></button><button className={`payment-method ${method==='bank'?'selected':''}`} onClick={()=>setMethod('bank')}><span className="payment-icon"><Building2 size={17}/></span><span><strong>Bank account</strong><small>ACH / SEPA · 1–3 business days</small></span><ChevronRight size={16}/></button></div></div><div><div className="section-head"><div><h2>Balance protection</h2><p className="small muted">Built for real ticket settlement.</p></div><ShieldCheck size={18} color="var(--green)"/></div><div className="wallet-notice"><Zap size={18}/><span><strong>Escrow protected</strong><small>Funds for open orders stay locked until the ticket ownership transfer is confirmed.</small></span></div><div className="wallet-notice"><ShieldCheck size={18}/><span><strong>Identity level 1</strong><small>Complete KYC to unlock withdrawals and higher purchase limits.</small></span><button className="text-button" onClick={()=>showToast('KYC verification opened')}>Verify</button></div></div></section>
    <section className="section"><div className="section-head"><div><h2>Transaction history</h2><p className="small muted">Deposits, purchases and settlement activity.</p></div><button className="text-button" onClick={()=>showToast('Export prepared')}>Export CSV</button></div><div className="transaction-list">{transactions.map(([title,value,status,tone])=><div className="transaction-row" key={title}><span className={`transaction-icon ${tone}`}><ArrowDownToLine size={15}/></span><span><strong>{title}</strong><small>{status}</small></span><b className={value.startsWith('+')?'positive':'negative'}>{value}</b></div>)}</div></section>
    {flow&&<div className="dialog-overlay" onMouseDown={e=>e.currentTarget===e.target&&setFlow(null)}><div className="dialog-panel wallet-dialog"><button className="icon-btn dialog-close" onClick={()=>setFlow(null)} aria-label="Close">×</button><div className="eyebrow">{flow==='deposit'?'ADD FUNDS':'CASH OUT'}</div><h2>{flow==='deposit'?'Deposit to your balance':'Withdraw available funds'}</h2><p className="muted">Your market balance is always displayed in USD.</p><label className="price-field"><span>Amount</span><div><b>$</b><input inputMode="decimal" value={amount} onChange={e=>setAmount(e.target.value.replace(/[^0-9.]/g,''))}/><small>USD</small></div></label><div className="method-summary"><span>Method</span><strong>{method==='card'?'Visa ending 4242':method==='wallet'?'0x8B7...93A1':'Bank account'}</strong></div><button className="btn primary dialog-submit" onClick={submit}>{flow==='deposit'?'Deposit funds':'Request withdrawal'} · ${amount||'0'}</button></div></div>}
  </div>
}
