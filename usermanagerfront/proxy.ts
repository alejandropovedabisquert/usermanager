import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { usersApi } from '@/lib/api/users';

export async function proxy(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const currentUser = await usersApi.getCurrentUser();

    const isPublicPath = publicPaths.some(publicPath => path === publicPath || path.startsWith(publicPath + '/'));
    const isAuthenticatedPath = authenticatedPaths.some(authenticatedPath => path === authenticatedPath || path.startsWith(authenticatedPath + '/'));
    const isAdminPath = adminPaths.some(adminPath => path === adminPath || path.startsWith(adminPath + '/'));
    const isProtectedPath = protectedPaths.some(protectedPath => path === protectedPath || path.startsWith(protectedPath + '/'));

    if (!currentUser && isAuthenticatedPath) {
        return NextResponse.redirect(new URL('/login', request.url));
    };

    if (currentUser && isPublicPath) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    if (currentUser && isAdminPath && currentUser.role !== 'admin') {
        return NextResponse.redirect(new URL('/not-found', request.url));
    };

    if (!currentUser && isProtectedPath) {
        return NextResponse.redirect(new URL('/not-found', request.url));
    }

    return NextResponse.next();
}

// Configurar qué rutas proteger
export const authenticatedPaths = ['/user/:id*', '/account'];
export const adminPaths = ['/create'];
export const publicPaths = ['/login', '/register'];
export const protectedPaths = ['/user/:id*', '/account', '/create'];
export const config = {
    matcher: ['/user/:id*', '/account', '/create', '/login', '/register'],
};