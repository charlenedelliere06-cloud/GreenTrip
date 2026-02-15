import { createSupabaseBrowser } from "./supabase-browser";

const BUCKET_NAME = "place-photos";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function uploadPlacePhoto(
  file: File,
  placeId: string
): Promise<string> {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Le fichier dépasse la taille maximale de 5MB");
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    throw new Error("Format non supporté. Utilisez JPG, PNG ou WebP.");
  }

  const supabase = createSupabaseBrowser();
  const fileExt = file.name.split(".").pop();
  const fileName = `${placeId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) throw error;

  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

export async function deletePlacePhoto(path: string): Promise<void> {
  const supabase = createSupabaseBrowser();
  const { error } = await supabase.storage.from(BUCKET_NAME).remove([path]);
  if (error) throw error;
}
