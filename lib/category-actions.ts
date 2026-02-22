"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

export async function createCategory(formData: FormData) {
    const supabase = await createClient();

    const name = formData.get("name") as string;
    const data = {
        name,
        slug: slugify(name),
        image_url: (formData.get("image_url") as string) || "",
        description: (formData.get("description") as string) || null,
    };

    const { error } = await supabase.from("categories").insert(data);

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin/categories");
    return { success: true };
}

export async function updateCategory(id: string, formData: FormData) {
    const supabase = await createClient();

    const name = formData.get("name") as string;
    const data = {
        name,
        slug: slugify(name),
        image_url: (formData.get("image_url") as string) || "",
        description: (formData.get("description") as string) || null,
    };

    const { error } = await supabase
        .from("categories")
        .update(data)
        .eq("id", id);

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin/categories");
    return { success: true };
}

export async function deleteCategory(id: string) {
    const supabase = await createClient();

    const { error } = await supabase.from("categories").delete().eq("id", id);

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin/categories");
    return { success: true };
}
