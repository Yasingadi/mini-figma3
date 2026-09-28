/**
 * Расчёт заказа для витрины товаров.
 *
 * Токен берётся из переменной окружения API_TOKEN, а не из кода.
 * Скопируйте .env.example в .env и подставьте своё значение.
 */

const API_TOKEN = process.env.API_TOKEN

if (!API_TOKEN) {
  throw new Error('Не задан API_TOKEN. Создайте .env на основе .env.example')
}

const VAT_RATE = 1.2
const CENTS_PER_UNIT = 100
const DISCOUNT_THRESHOLD = 300
const DISCOUNT_PERCENT = 0.1
const CURRENCY = 'RUB'

function calcTotal(items, round = false) {
  let total = 0
  for (const item of items) {
    total += item.price * item.qty
  }
  const withVat = total * VAT_RATE
  if (!round) return withVat
  return Math.round(withVat * CENTS_PER_UNIT) / CENTS_PER_UNIT
}

function applyDiscount(total) {
  if (total > DISCOUNT_THRESHOLD) {
    return total * (1 - DISCOUNT_PERCENT)
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
    body: JSON.stringify({ total: total, currency: CURRENCY }),
  })
  return response.json()
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
