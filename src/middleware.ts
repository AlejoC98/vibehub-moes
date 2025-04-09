import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server';
import { updateSession } from '@/utils/supabase/middleware';

export async function middleware(request: NextRequest) {

  const supabase = await createClient();

  var userData = null;
  const destinyPath = request.nextUrl.pathname;
  const { data: { user } } = await supabase.auth.getUser();
  const publicUrls = ['/', '/auth/reset-password', '/auth/login'];
  var roleIds: number[] = [];

  if (user) {
    const { data: userQuery, error } = await supabase
      .from('accounts')
      .select('*, locations!accounts_location_id_fkey(*), accounts_roles(*, roles(id, name))')
      .eq('user_id', user?.id)
      .single();
    roleIds = userQuery.accounts_roles?.map((item: any) => item.role_id) || [];

    if (error) {
      await supabase.auth.signOut();
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    userData = userQuery;
  }

  switch (destinyPath) {
    case '/auth/login':
      if (user) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
      break;
    case '/dashboard':
      if (!user) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
      }
      break;
    case '/inventory':
      if (!roleIds.includes(1) && !roleIds.includes(2) && !roleIds.includes(3) && !roleIds.includes(4)) {
        return NextResponse.redirect(new URL('/access-denied', request.url))
      }
      break;
    case '/shipping':
      if (!roleIds.includes(1) && !roleIds.includes(2) && !roleIds.includes(3) && !roleIds.includes(7)) {
        return NextResponse.redirect(new URL('/access-denied', request.url))
      }
      break;
    case '/receiving':
      if (!roleIds.includes(1) && !roleIds.includes(2) && !roleIds.includes(3) && !roleIds.includes(8)) {
        return NextResponse.redirect(new URL('/access-denied', request.url))
      }
      break;
    case '/replenishment':
      if (!roleIds.includes(1) && !roleIds.includes(2) && !roleIds.includes(3) && !roleIds.includes(9)) {
        return NextResponse.redirect(new URL('/access-denied', request.url))
      }
      break;
    case '/picking':
      if (!roleIds.includes(1) && !roleIds.includes(2) && !roleIds.includes(3) && !roleIds.includes(5)) {
        return NextResponse.redirect(new URL('/access-denied', request.url))
      }
      break;
    case '/orders':
      if (!roleIds.includes(1) && !roleIds.includes(2) && !roleIds.includes(3)) {
        return NextResponse.redirect(new URL('/access-denied', request.url))
      }
      break;
    case '/returns':
      if (!roleIds.includes(1) && !roleIds.includes(2) && !roleIds.includes(3)) {
        return NextResponse.redirect(new URL('/access-denied', request.url))
      }
      break;
    case '/carriers':
      if (!roleIds.includes(1) && !roleIds.includes(2) && !roleIds.includes(3)) {
        return NextResponse.redirect(new URL('/access-denied', request.url))
      }
      break;
    case '/vendors':
      if (!roleIds.includes(1) && !roleIds.includes(2) && !roleIds.includes(3)) {
        return NextResponse.redirect(new URL('/access-denied', request.url))
      }
      break;
    case '/users':
      if (!roleIds.includes(1) && !roleIds.includes(2)) {
        return NextResponse.redirect(new URL('/access-denied', request.url))
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