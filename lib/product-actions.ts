"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

export async function createProduct(formData: FormData) {
    const supabase = await createClient();

    const name = formData.get("name") as string;
    const data = {
        name,
        slug: slugify(name),
        description: formData.get("description") as string,
        short_description: formData.get("short_description") as string,
        category_id: formData.get("category_id") as string,
        price: Number(formData.get("price")),
        mrp: Number(formData.get("mrp")),
        images: (formData.get("images") as string)
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean),
        tags: (formData.get("tags") as string)
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        amazon_url: (formData.get("amazon_url") as string) || null,
        flipkart_url: (formData.get("flipkart_url") as string) || null,
        meesho_url: (formData.get("meesho_url") as string) || null,
        is_featured: formData.get("is_featured") === "on",
        is_trending: formData.get("is_trending") === "on",
        is_active: formData.get("is_active") !== "off",
    };

    const { error } = await supabase.from("products").insert(data);

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin/products");
    redirect("/admin/products");
}

export async function updateProduct(id: string, formData: FormData) {
    const supabase = await createClient();

    const name = formData.get("name") as string;
    const data = {
        name,
        slug: slugify(name),
        description: formData.get("description") as string,
        short_description: formData.get("short_description") as string,
        category_id: formData.get("category_id") as string,
        price: Number(formData.get("price")),
        mrp: Number(formData.get("mrp")),
        images: (formData.get("images") as string)
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean),
        tags: (formData.get("tags") as string)
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        amazon_url: (formData.get("amazon_url") as string) || null,
        flipkart_url: (formData.get("flipkart_url") as string) || null,
        meesho_url: (formData.get("meesho_url") as string) || null,
        is_featured: formData.get("is_featured") === "on",
        is_trending: formData.get("is_trending") === "on",
        is_active: formData.get("is_active") !== "off",
    };

    const { error } = await supabase.from("products").update(data).eq("id", id);

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin/products");
    redirect("/admin/products");
}

export async function deleteProduct(id: string) {
    const supabase = await createClient();

    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin/products");
}

export async function toggleProductField(
    id: string,
    field: "is_active" | "is_featured" | "is_trending",
    currentValue: boolean
) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("products")
        .update({ [field]: !currentValue })
        .eq("id", id);

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin/products");
}
