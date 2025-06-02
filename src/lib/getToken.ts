'use server'

import { cookies } from 'next/headers'

// funkcija za dohvat cookie-a na serveru
export const getCookieServer = async (cookieName: string) => {
  const cookieStore = await cookies()
  return cookieStore.get(cookieName)?.value
}