import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server';
import { updateSession } from '@/utils/supabase/middleware';

export async function middleware(request: NextRequest) {

  const supabase = await createClient();

  var userData = null;
  const destinyPath = request.nextUrl.pathname;
  const { data: { session } } = await supabase.auth.getSession();
  const publicUrls = ['/', '/auth/reset-password', '/auth/login'];
  

  if (session) {
    const { data: userQuery, error } = await supabase
    .from('accounts')
    .select('*, locations!accounts_location_id_fkey(*), accounts_roles(*, roles(id, name))')
    .eq('user_id', session?.user.id)
    .single();

    if (error) {
      await supabase.auth.signOut();
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    userData = userQuery;
  }

  switch (destinyPath) {
    case '/auth/login':
      if (session) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
      break;
    case '/dashboard':
      if (!session) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
      }
      break;
    case '/users':
      if (!userData.accounts_roles.includes(2)) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    break;
    default:
      if (publicUrls.includes(request.nextUrl.pathname)) {
        return await updateSession(request);
      }
      break;
  }

  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|static/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff|woff2|ttf|otf)$).*)',
  ]
}