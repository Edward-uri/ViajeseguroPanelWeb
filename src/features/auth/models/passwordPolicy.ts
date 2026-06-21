export interface PasswordRule {
  label: string
  met: boolean
}

export interface PasswordPolicyResult {
  valid: boolean
  rules: PasswordRule[]
}

/**
 * Refleja la política del backend (POST /auth/password):
 * mínimo 8 caracteres, con al menos una mayúscula, una minúscula y un número.
 */
export function checkPasswordPolicy(password: string): PasswordPolicyResult {
  const rules: PasswordRule[] = [
    { label: 'Mínimo 8 caracteres', met: password.length >= 8 },
    { label: 'Una letra mayúscula', met: /[A-Z]/.test(password) },
    { label: 'Una letra minúscula', met: /[a-z]/.test(password) },
    { label: 'Un número', met: /\d/.test(password) },
  ]
  return { valid: rules.every((r) => r.met), rules }
}
