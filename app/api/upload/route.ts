import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: Request) {
  try {

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: "Server error: Missing Supabase keys in .env file." }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 })
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File size exceeds the limit of 10MB." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`

    // Upload to Supabase Storage bucket named "notes"
    const { data, error } = await supabase.storage
      .from("notes")
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Supabase upload error:", error)
      return NextResponse.json({ error: `Supabase Error: ${error.message}` }, { status: 500 })
    }

    // Get the public URL to save in your database
    const { data: publicUrlData } = supabase.storage.from("notes").getPublicUrl(filename)

    return NextResponse.json({ url: publicUrlData.publicUrl })
  } catch (error: any) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: error?.message || "An unexpected error occurred during upload." }, { status: 500 })
  }
}