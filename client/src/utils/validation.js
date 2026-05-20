const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateRegister({ name, email, password }) {
  const errors = {}
  if (!name?.trim()) errors.name = 'Name is required'
  if (!email?.trim()) errors.email = 'Email is required'
  else if (!EMAIL_REGEX.test(email)) errors.email = 'Enter a valid email'
  if (!password) errors.password = 'Password is required'
  else if (password.length < 6) errors.password = 'Password must be at least 6 characters'
  return errors
}

export function validateLogin({ email, password }) {
  const errors = {}
  if (!email?.trim()) errors.email = 'Email is required'
  else if (!EMAIL_REGEX.test(email)) errors.email = 'Enter a valid email'
  if (!password) errors.password = 'Password is required'
  return errors
}

export function validateTransaction({ description, amount, type }) {
  const errors = {}
  if (!description?.trim()) errors.description = 'Description is required'
  if (!amount || Number(amount) <= 0) errors.amount = 'Amount must be greater than 0'
  if (!type) errors.type = 'Type is required'
  return errors
}

export function validateInvoice({ client, amount, status }) {
  const errors = {}
  if (!client?.trim()) errors.client = 'Client is required'
  if (!amount || Number(amount) <= 0) errors.amount = 'Amount must be greater than 0'
  if (!status) errors.status = 'Status is required'
  return errors
}

export function inputClass(hasError) {
  return `w-full bg-background border rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-accent ${
    hasError ? 'border-red-500' : 'border-border'
  }`
}
