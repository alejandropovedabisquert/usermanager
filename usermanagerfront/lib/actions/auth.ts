'use server'
import { cookies } from 'next/headers';

export async function setAuthToken(token: string) {
  const cookieStore = await cookies();
  cookieStore.set('token', token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60, 
    path: '/',
  });
}

export async function setRefreshToken(refreshToken: string) {
  const cookieStore = await cookies();
  cookieStore.set('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });
}

export async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get('token')?.value;
}

export async function getRefreshToken() {
  const cookieStore = await cookies();
  return cookieStore.get('refreshToken')?.value;
}

export async function removeAuthToken() {
  const cookieStore = await cookies();
  cookieStore.delete('token');
  cookieStore.delete('refreshToken');
}