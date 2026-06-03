import { getAllPhotos } from "../../lib/cloudinary";

export async function GET() {
  const photos = await getAllPhotos();
  return Response.json(photos.map((p) => p.src));
}
