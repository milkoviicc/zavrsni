'use server'

import { cookies } from 'next/headers'

export const getCookieServer = async (cookieName: string) => {
  const cookieStore = await cookies()
  return cookieStore.get(cookieName)?.value
}