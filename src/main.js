import './style.css'
import { defaultProducts } from './products.js'

const state = {
  products: defaultProducts,
  sales: JSON.parse(localStorage.getItem('market-sales') || '[]'),
  cart: {},
  receivedAmount: 0,
  cartOpen: false,
}

const yen = (value) => `¥${value.toLocaleString('ja-JP')}`
const app = document.querySelector('#app')

function save() {
  localStorage.setItem('market-sales', JSON.stringify(state.sales))
}

function cartItems() {
  return state.products
    .map((product) => ({ product, quantity: state.cart[product.id] || 0 }))
    .filter((item) => item.quantity > 0)
}

function render() {
  const items = cartItems()
  if (!items.length) state.receivedAmount = 0
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const canCheckout = items.length > 0 && state.receivedAmount >= totalPrice
  const today = new Date().toLocaleDateString('ja-JP')
  const todaySales = state.sales.filter((sale) => new Date(sale.time).toLocaleDateString('ja-JP') === today)
  const todayRevenue = todaySales.reduce((sum, sale) => sum + sale.total, 0)

  app.innerHTML = `
    <header class="topbar">
      <div class="brand"><span class="brand-mark">謎</span><div><p class="eyebrow">NAZOTOKI MARKET 2026</p><h1>レジカウンター</h1></div></div>
      <div class="header-date"><span class="live-dot"></span>本日の営業記録 <strong>${today}</strong></div>
    </header>
    <main class="workspace">
      <div class="mobile-cart-summary" aria-live="polite"><div class="mobile-cart-summary-heading"><strong>カートの中身</strong><span>${totalQuantity}点</span></div><div class="mobile-cart-items">${items.length ? items.map(({ product, quantity }) => `<div class="mobile-cart-item"><span>${product.name}</span><div><button data-summary-minus="${product.id}" type="button" aria-label="${product.name}を1点減らす">−</button><b>${quantity}</b><button data-summary-plus="${product.id}" type="button" aria-label="${product.name}を1点増やす">＋</button></div></div>`).join('') : '<span class="mobile-cart-empty">まだ商品がありません</span>'}</div><strong class="mobile-cart-total">${yen(totalPrice)}</strong></div>
      <button class="mobile-cart-trigger" id="open-cart" type="button">会計を見る <span>${totalQuantity}</span></button>
      <div class="drawer-backdrop ${state.cartOpen ? 'is-open' : ''}" id="drawer-backdrop"></div>
      <div class="content-grid">
        <section class="products-panel">
          <div class="section-heading"><div><p class="eyebrow">PRODUCTS</p><h2>商品を選ぶ</h2></div><span class="hint">タップでカートに追加</span></div>
          <div class="product-grid">
            ${state.products.map((product) => `<button class="product-card ${product.color}" data-add="${product.id}" type="button"><img class="product-thumbnail" src="${product.image}" alt="${product.name}"><span class="product-name">${product.name}</span><span class="product-note">${product.note}</span><strong>${yen(product.price)}</strong><span class="add-mark">＋</span></button>`).join('')}
          </div>
          <div class="recent-section"><div class="section-heading compact"><div><p class="eyebrow">RECENT SALES</p><h2>直近の会計</h2></div><span>${state.sales.length}件保存中</span></div>${renderSales(today)}</div>
        </section>
        <aside class="cart-panel ${state.cartOpen ? 'is-open' : ''}"><div class="cart-heading"><div><p class="eyebrow">CURRENT ORDER</p><h2>今回のお会計</h2></div><div class="cart-heading-actions"><span class="cart-count">${totalQuantity}</span><button class="drawer-close" id="close-cart" type="button" aria-label="会計画面を閉じる">×</button></div></div><div class="cart-list">${renderCart(items)}</div><div class="cart-total"><span>合計</span><strong>${yen(totalPrice)}</strong></div><div class="payment-box"><label for="received-amount">受け取った金額</label><div class="amount-input"><span>¥</span><input id="received-amount" type="number" min="0" step="50" inputmode="none" placeholder="0" value="${state.receivedAmount || ''}" ${items.length ? '' : 'disabled'}></div><div class="keypad" aria-label="受取金額テンキー"><button data-key="7" type="button">7</button><button data-key="8" type="button">8</button><button data-key="9" type="button">9</button><button data-key="backspace" type="button">⌫</button><button data-key="4" type="button">4</button><button data-key="5" type="button">5</button><button data-key="6" type="button">6</button><button data-key="clear" type="button">C</button><button data-key="1" type="button">1</button><button data-key="2" type="button">2</button><button data-key="3" type="button">3</button><button data-key="00" type="button">00</button><button data-key="0" class="zero-key" type="button">0</button></div><div class="change-row"><span>お釣り</span><strong id="change-value">${yen(Math.max(0, state.receivedAmount - totalPrice))}</strong></div><p id="payment-status">${items.length ? (state.receivedAmount < totalPrice ? `あと ${yen(totalPrice - state.receivedAmount)} 必要です` : '会計を確定できます') : '商品を選ぶと入力できます'}</p></div><button class="checkout-button" id="checkout" type="button" ${canCheckout ? '' : 'disabled'}>会計を確定する <span>→</span></button><button class="clear-button" id="clear-cart" type="button" ${items.length ? '' : 'disabled'}>カートを空にする</button></aside>
      </div>
      <details class="summary-drawer">
        <summary>管理用集計を表示</summary>
        <div class="summary-row" aria-label="本日の集計">
          <div class="summary-card"><span>本日の会計</span><strong>${todaySales.length}<small>件</small></strong></div>
          <div class="summary-card accent"><span>本日の売上</span><strong>${yen(todayRevenue)}</strong></div>
          <div class="summary-card"><span>販売点数</span><strong>${todaySales.reduce((sum, sale) => sum + sale.quantity, 0)}<small>点</small></strong></div>
          <button class="export-button" id="export-csv" type="button"><span class="button-icon">↓</span>CSVを書き出す</button>
        </div>
      </details>
    </main>
    <footer><span>この端末に自動保存されています</span><button id="clear-history" type="button">履歴を全消去</button></footer>
    <div class="toast" id="toast" role="status"></div>
  `
  document.body.classList.toggle('cart-drawer-open', state.cartOpen)
  bindEvents()
}

function renderCart(items) {
  if (!items.length) return '<div class="empty-cart"><span>＋</span><p>商品を選ぶと<br>ここに表示されます</p></div>'
  return items.map(({ product, quantity }) => `<div class="cart-item"><div><strong>${product.name}</strong><span>${yen(product.price)} / 点</span></div><div class="quantity"><button data-minus="${product.id}" type="button" aria-label="${product.name}を減らす">−</button><b>${quantity}</b><button data-plus="${product.id}" type="button" aria-label="${product.name}を増やす">＋</button></div><strong class="line-total">${yen(product.price * quantity)}</strong></div>`).join('')
}

function renderSales(today) {
  const sales = state.sales.filter((sale) => new Date(sale.time).toLocaleDateString('ja-JP') === today).slice(0, 5)
  if (!sales.length) return '<div class="empty-sales">まだ会計履歴はありません</div>'
  return `<div class="sales-table"><div class="sales-row table-header"><span>時刻</span><span>内容</span><span>合計</span></div>${sales.map((sale) => `<div class="sales-row"><span>${new Date(sale.time).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}</span><span>${sale.items.map((item) => `${item.name} ×${item.quantity}`).join('、')}</span><strong>${yen(sale.total)}</strong></div>`).join('')}</div>`
}

function showToast(message) {
  const toast = document.querySelector('#toast')
  toast.textContent = message
  toast.classList.add('show')
  setTimeout(() => toast.classList.remove('show'), 2200)
}

function exportCsv() {
  const headers = ['購入日時', '商品名', '数量', '単価', '小計', '会計合計']
  const rows = state.sales.flatMap((sale) => sale.items.map((item) => [sale.time, item.name, item.quantity, item.price, item.price * item.quantity, sale.total]))
  const csv = [headers, ...rows].map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\n')
  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `nazotoki-market-${new Date().toISOString().slice(0, 10)}.csv`
  link.hidden = true
  document.body.append(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(link.href), 1000)
  showToast('CSVを書き出しました')
}

function bindEvents() {
  document.querySelector('#open-cart').addEventListener('click', () => { state.cartOpen = true; render() })
  document.querySelector('#close-cart').addEventListener('click', () => { state.cartOpen = false; render() })
  document.querySelector('#drawer-backdrop').addEventListener('click', () => { state.cartOpen = false; render() })
  document.querySelectorAll('[data-add]').forEach((button) => button.addEventListener('click', () => { const id = button.dataset.add; state.cart[id] = (state.cart[id] || 0) + 1; render() }))
  document.querySelectorAll('[data-plus]').forEach((button) => button.addEventListener('click', () => { const id = button.dataset.plus; state.cart[id] += 1; render() }))
  document.querySelectorAll('[data-minus]').forEach((button) => button.addEventListener('click', () => { const id = button.dataset.minus; state.cart[id] -= 1; if (state.cart[id] <= 0) delete state.cart[id]; render() }))
  document.querySelectorAll('[data-summary-plus]').forEach((button) => button.addEventListener('click', () => { const id = button.dataset.summaryPlus; state.cart[id] = (state.cart[id] || 0) + 1; render() }))
  document.querySelectorAll('[data-summary-minus]').forEach((button) => button.addEventListener('click', () => { const id = button.dataset.summaryMinus; state.cart[id] -= 1; if (state.cart[id] <= 0) delete state.cart[id]; render() }))
  document.querySelector('#clear-cart').addEventListener('click', () => { state.cart = {}; state.receivedAmount = 0; render() })
  document.querySelector('#received-amount').addEventListener('input', (event) => {
    state.receivedAmount = Math.max(0, Number(event.target.value) || 0)
    updatePaymentDisplay()
  })
  document.querySelectorAll('[data-key]').forEach((button) => button.addEventListener('click', () => {
    const key = button.dataset.key
    if (key === 'clear') state.receivedAmount = 0
    else if (key === 'backspace') state.receivedAmount = Number(String(state.receivedAmount).slice(0, -1)) || 0
    else state.receivedAmount = Number(`${state.receivedAmount || ''}${key}`) || 0
    updatePaymentDisplay()
  }))
  document.querySelector('#export-csv').addEventListener('click', exportCsv)
  document.querySelector('#checkout').addEventListener('click', () => {
    const items = cartItems()
    if (!items.length) return
    state.sales.unshift({ time: new Date().toISOString(), quantity: items.reduce((sum, item) => sum + item.quantity, 0), total: items.reduce((sum, item) => sum + item.product.price * item.quantity, 0), items: items.map(({ product, quantity }) => ({ name: product.name, quantity, price: product.price })) })
    state.cart = {}
    state.receivedAmount = 0
    state.cartOpen = false
    save()
    render()
    showToast('会計を記録しました')
  })
  document.querySelector('#clear-history').addEventListener('click', () => { if (state.sales.length && confirm('購入履歴をすべて削除しますか？')) { state.sales = []; save(); render() } })
}

function updatePaymentDisplay() {
  const items = cartItems()
  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const input = document.querySelector('#received-amount')
  const change = Math.max(0, state.receivedAmount - totalPrice)
  input.value = state.receivedAmount || ''
  document.querySelector('#change-value').textContent = yen(change)
  document.querySelector('#payment-status').textContent = state.receivedAmount < totalPrice ? `あと ${yen(totalPrice - state.receivedAmount)} 必要です` : '会計を確定できます'
  document.querySelector('#checkout').disabled = !items.length || state.receivedAmount < totalPrice
}

render()
