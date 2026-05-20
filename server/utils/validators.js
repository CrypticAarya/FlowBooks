const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const INVOICE_STATUSES = ['Paid', 'Pending', 'Overdue']
const TRANSACTION_TYPES = ['Income', 'Expense']

export function validateRegister({ name, email, password }) {
  const errors = {}

  if (!name?.trim()) errors.name = 'Name is required'
  if (!email?.trim()) errors.email = 'Email is required'
  else if (!EMAIL_REGEX.test(email)) errors.email = 'Enter a valid email'
  if (!password) errors.password = 'Password is required'
  else if (password.length < 6) errors.password = 'Password must be at least 6 characters'

  return { valid: Object.keys(errors).length === 0, errors }
}

export function validateLogin({ email, password }) {
  const errors = {}

  if (!email?.trim()) errors.email = 'Email is required'
  else if (!EMAIL_REGEX.test(email)) errors.email = 'Enter a valid email'
  if (!password) errors.password = 'Password is required'

  return { valid: Object.keys(errors).length === 0, errors }
}

export function validateTransaction({ description, amount, type }) {
  const errors = {}

  if (!description?.trim()) errors.description = 'Description is required'
  if (amount === undefined || amount === '' || Number(amount) <= 0) {
    errors.amount = 'Amount must be greater than 0'
  }
  if (!type || !TRANSACTION_TYPES.includes(type)) errors.type = 'Type is required'

  return { valid: Object.keys(errors).length === 0, errors }
}

export function validateInvoice({ client, amount, status }) {
  const errors = {}

  if (!client?.trim()) errors.client = 'Client is required'
  if (amount === undefined || amount === '' || Number(amount) <= 0) {
    errors.amount = 'Amount must be greater than 0'
  }
  if (!status || !INVOICE_STATUSES.includes(status)) {
    errors.status = 'Valid status is required'
  }

  return { valid: Object.keys(errors).length === 0, errors }
}
