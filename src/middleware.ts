import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server';
import { updateSession } from '@/utils/supabase/middleware';

export async function middleware(request: NextRequest) {

    const supabase = await createClient();

    const publicUrls = ['/', '/auth/reset-password', '/auth/login'];

    if (publicUrls.includes(request.nextUrl.pathname)) {
      return await updateSession(request);
    }

    const { data: { session } } = await supabase.auth.getSession();

    const isAuthPage = request.nextUrl.pathname.startsWith('/auth/login');

    if (!isAuthPage) {
      if (!session) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
      }
    } else {
      if (session) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }

  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|static/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff|woff2|ttf|otf)$).*)',
  ]
}