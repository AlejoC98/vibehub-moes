import { signup } from "@/app/(public)/auth/login/actions";
import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { accountType, defaultData, newData, selectedRoles } = await req.json()

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  var response = {
    status: false,
    message: ''
  };

  try {
    const { data: currentUsers, error } = await supabase.from('accounts').select('*, accounts_roles(*)').not('deleted', 'eq', true);

    const filteredUsers = (currentUsers ?? []).filter(account => {
      const roles = account.accounts_roles ?? []
      const hasRole1 = roles.some((role: any) => role.role_id === 1)
      return !hasRole1
    })

    if (error) {
      return NextResponse.json(
        { error: error.message || 'Something went wrong' },
        { status: 500 }
      );
    }

  if (filteredUsers.length < 25) {
    var userId = undefined;

    if (Object.keys(defaultData!).length == 0) {
      const userData = await signup(accountType == 'manager' ? newData['email'].toLowerCase() : `${newData['username'].toLowerCase()}@vibehubapp.com`, accountType == 'manager' ? process.env.DEFAULT_PASSWORD! : newData['password'], false);

      userId = userData?.user?.id;
    } else {
      userId = defaultData?.user_id;
    }

    if (userId != undefined) {
      const { data: newAccount, error } = await supabase.from('accounts').upsert({
        'first_name': newData['first_name'],
        'last_name': newData['last_name'],
        'user_id': userId,
        'location_id': 1,
        'email': accountType == 'manager' ? newData['email'].toLowerCase() : `${newData['username'].toLowerCase()}@vibehubapp.com`,
        'username': newData['username'].toLowerCase(),
        'created_by': userData.user?.id
      }, { onConflict: 'email' }).select().single();

      if (error) {
        throw new Error(error.message);
      }

      await supabase.from('accounts_roles').delete().eq('account_id', newAccount.id);
      // Assing Roles
      for (var role of selectedRoles) {
        const { error } = await supabase.from('accounts_roles').insert({
          account_id: newAccount.id,
          role_id: role
        });

        if (error) {
          throw new Error(error.message);
        }
      }

      response = {
        status: true,
        message: `User ${Object.keys(defaultData!).length > 0 ? 'updated' : 'created'}!`
      } 
    }
  } else {
    response = {
      status: false,
      message: 'You\'ve reached the maximum number of users allowed for your current plan. To add more users, please upgrade your subscription.'
    }  
  }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }

  return NextResponse.json(response)
}