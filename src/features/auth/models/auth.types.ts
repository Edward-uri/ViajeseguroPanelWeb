export interface LoginCredentials {
  emailOrPhone: string
}

export interface CodeVerificationData {
  code: string
  emailOrPhone: string
}

export type AuthStep = 'login' | 'verification'
