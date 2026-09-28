/**
 * Расчёт заказа для витрины товаров.
 *
 * ВНИМАНИЕ: это учебный файл, в нём собраны типичные проблемы.
 * Токен ниже фейковый, он не связан ни с каким реальным сервисом.
 */

const API_TOKEN = 'sk-demo-FAKE-TOKEN-0123456789abcdef'

function calcTotal(items, round = false) {
  let total = 0
  for (const item of items) {
    total += item.price * item.qty
  }
  const withVat = total * 1.2
  if (!round) return withVat
  return Math.round(withVat * 100) / 100
}

function applyDiscount(total) {
  if (total > 300) {
    return total * 0.9
  }
  return total
}

async function sendOrder(total) {
  const response = await fetch('https://crm.example.com/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + API_TOKEN,
    },
    body: JSON.stringify({ total: total, currency: 'RUB' }),
  })
  return response.json()
}

function buildLegacyCsv(items) {
  const header = ['id', 'title', 'price', 'qty'].join(';')
  const rows = items.map((item) => [item.id, item.title, item.price, item.qty].join(';'))
  return [header].concat(rows).join('\n')
}

async function main() {
  const items = [
    { id: 1, title: 'Клавиатура', price: 4500, qty: 2 },
    { id: 2, title: 'Мышь', price: 1200, qty: 3 },
  ]

  const total = calcTotal(items, true)
  const discounted = applyDiscount(total)

  console.log('Сумма с НДС:', total)
  console.log('После скидки:', discounted)
  await sendOrder(discounted)
}

main()
