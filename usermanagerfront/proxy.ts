import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { usersApi } from '@/lib/api/users';

export async function proxy(request: NextRequest) {
    const currentUser = await usersApi.getCurrentUser();

    if (!currentUser) {
        return NextResponse.redirect(new URL('/login', request.url));
    };

    return NextResponse.next();
}

// Configurar qué rutas proteger
export const config = {
    matcher: ['/user/:id*', '/account'],
};