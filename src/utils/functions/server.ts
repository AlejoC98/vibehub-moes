'use server';

import { headers } from "next/headers";
import { toast } from "react-toastify";
import { createClient } from "../supabase/server";

export const resetPassword = async (email: string) => {
    const pageHeaders = await headers();
    const origin = pageHeaders.get('origin');
    const supabase = await createClient();
    try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${origin}/auth/reset-password`,
        });

        if (error) {
            throw new Error(error.message);
        }

        return true;
    } catch (error: any) {
        toast.warning(error.message);
    }
    return false;
}