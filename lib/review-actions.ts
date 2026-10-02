"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "./supabase/server";

export async function addReview(formData: FormData) {
    const supabase = await createClient();

    const data = {
        customer_name: (formData.get("customer_name") as string) || null,
        platform: formData.get("platform") as string,
        rating: Number(formData.get("rating")),
        content: (formData.get("content") as string) || null,
        image_url: (formData.get("image_url") as string) || null,
        is_active: formData.get("is_active") === "on",
    };

    const { error } = await supabase.from("testimonials").insert(data);

    if (error) {
        return {
            error: "Could not add review. Please try again.",
            detail: error.message,
        };
    }

    revalidatePath("/");
    revalidatePath("/admin/reviews");
    return { success: true };
}

export async function updateReview(id: string, formData: FormData) {
    const supabase = await createClient();

    const data = {
        customer_name: (formData.get("customer_name") as string) || null,
        platform: formData.get("platform") as string,
        rating: Number(formData.get("rating")),
        content: (formData.get("content") as string) || null,
        image_url: (formData.get("image_url") as string) || null,
        is_active: formData.get("is_active") === "on",
    };

    const { error } = await supabase.from("testimonials").update(data).eq("id", id);

    if (error) {
        return {
            error: "Could not update review. Please try again.",
            detail: error.message,
        };
    }

    revalidatePath("/");
    revalidatePath("/admin/reviews");
    return { success: true };
}

export async function deleteReview(id: string) {
    const supabase = await createClient();

    const { error } = await supabase.from("testimonials").delete().eq("id", id);

    if (error) {
        return {
            error: "Could not delete review. Please try again.",
            detail: error.message,
        };
    }

    revalidatePath("/");
    revalidatePath("/admin/reviews");
    return { success: true };
}
