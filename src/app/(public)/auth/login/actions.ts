'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(username: string, password: string) {
  const supabase = await createClient();

  var data = {
    email: '',
    password: '',
  }

  if (username.toLocaleLowerCase() == 'alejoc98' || username == 'alegomezc98@icloud.com') {
    if (username.includes('@')) {
      data = {
        email: username,
        password: password,
      }
  
    } else {
      const { data: userQuery, error: userError } = await supabase.from('accounts').select().eq('username', username.toUpperCase()).maybeSingle();
  
      if (userError) {
        return userError.message;
      }
  
      if (userQuery != null) {
        data = {
          email: userQuery.email,
          password: password,
        }
      }
    }
  
    const { error } = await supabase.auth.signInWithPassword(data)
  
    if (error) {
      return error.message;
    }
  } else {
    return "Access has been removed. Please contact support for further assistance.";
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(username: string, password: string, redirectTo: boolean = true) {
  const supabase = await createClient()

  const userData = {
    email: username,
    password: password,
  }

  const { data, error } = await supabase.auth.signUp(userData)

  if (error) {
    throw new Error(error.message);
  }

  if (redirectTo == true) {
    revalidatePath('/', 'layout')
    redirect('/account')
  } else {
    return data;
  }
}
export async function signout() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (user) {
    await supabase.auth.signOut()
  }
  revalidatePath('/', 'layout')
  redirect('/auth/login')
}