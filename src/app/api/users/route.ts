import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server"

export async function POST(req: Request) {

  const { username } = await req.json();
  const supabaseAdmin = createClient(process.env.SUPABASE_URL!, process.env.SERVICE_ROLE_KEY!, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  })

  var response = {};

  try {
    const { data: userQuery, error: userError } = await supabaseAdmin.from('accounts').select().eq('username', username).maybeSingle();

    if (userQuery == null || userError) {
      return NextResponse.json(
        { error: userError?.message || 'Something went wrong' },
        { status: 500 }
      );
    }

    const { data: { user }, error } = await supabaseAdmin.auth.admin.getUserById(userQuery.user_id);

    if (error) {
      throw new Error(error.message);
    }

    response = {
      status: true,
      data: {
        email_verified: user?.user_metadata.email_verified,
        last_sign_in_at: user?.identities![0].last_sign_in_at
      }
    } 
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }

  return NextResponse.json(response);
}