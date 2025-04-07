import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server';
import { updateSession } from '@/utils/supabase/middleware';

export async function middleware(request: NextRequest) {

    const supabase = createClient();
    const { data: { session } } = await (await supabase).auth.getSession();

    const isAuthPage = request.nextUrl.pathname.startsWith('/auth/login')

    if (!isAuthPage) {
      if (!session) {
        return NextResponse.redirect(new URL('/auth/login', request.url))
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
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}