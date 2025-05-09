import { generateRandomNumberString } from "@/utils/functions/main";
import { PickListContent, ShippingContent } from "@/utils/interfaces";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server"

export async function POST(req: Request) {

    const { orderId }: { orderId: string } = await req.json();

    const supabase = await createClient();
    var response = {
        status: false,
        message: 'Something went wrong!'
    }

    const { data: { user } } = await supabase.auth.getUser()

    try {
        const { data, error } = await supabase
            .from('shippings_orders')
            .select('*, shippings_pick_list(*, shippings_products(*, shippings_products_serials(*)))')
            .eq('id', orderId)
            .maybeSingle();

        if (error) {
            throw new Error(error.message);
        }

        for (const pickList of data.shippings_pick_list) {
            for (const pickProduct of pickList.shippings_products) {
                if (pickProduct.is_ready == false) {
                    for (let index = 0; index < (pickProduct.product_quantity - pickProduct.shippings_products_serials); index++) {
                        const randomSerial = generateRandomNumberString(10);
    
                        const { error: serialError } = await supabase
                            .from('shippings_products_serials')
                            .insert({
                                shipping_product_id: pickProduct.id,
                                serial_number: randomSerial,
                                picked_by: user?.id
                            });
    
                        if (serialError) {
                            throw new Error(serialError.message);
                        }
                    }
    
                    const { error: spError } = await supabase
                        .from('shippings_products')
                        .update({
                            is_ready: true,
                        })
                        .eq('id', pickProduct.id);
    
                    if (spError) {
                        throw new Error(spError.message);
                    }
                }
            }

            const { error: plError } = await supabase
                .from('shippings_pick_list')
                .update({
                    picked_by: user?.id,
                    verified_by: user?.id,
                    status: 'Completed',
                    notes: 'Order completed by support'
                })
                .eq('id', pickList.id);

            if (plError) {
                throw new Error(plError.message);
            }
        }

        const { error: soError } = await supabase
            .from('shippings_orders')
            .update({
                closed_by: user?.id,
                closed_at: new Date().toISOString(),
                status: 'Shipped'
            })
            .eq('id', data.id);

        if (soError) {
            throw new Error(soError.message);
        }

        response = {
            status: true,
            message: 'Order Completed'
        };

    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Something went wrong' },
            { status: 500 }
        );
    }
    return NextResponse.json(response);
}