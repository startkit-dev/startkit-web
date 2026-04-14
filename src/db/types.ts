export interface Database {
  users: UsersTable
  sessions: SessionsTable
  accounts: AccountsTable
  verification: VerificationTable
}

export interface UsersTable {
  id: string
  name: string
  email: string
  email_verified: number
  image: string | null
  created_at: number
  updated_at: number
}

export interface SessionsTable {
  id: string
  expires_at: number
  token: string
  created_at: number
  updated_at: number
  ip_address: string | null
  user_agent: string | null
  user_id: string
}

export interface AccountsTable {
  id: string
  account_id: string
  provider_id: string
  user_id: string
  access_token: string | null
  refresh_token: string | null
  id_token: string | null
  access_token_expires_at: number | null
  refresh_token_expires_at: number | null
  scope: string | null
  password: string | null
  created_at: number
  updated_at: number
}

export interface VerificationTable {
  id: string
  identifier: string
  value: string
  expires_at: number
  created_at: number
  updated_at: number
}
