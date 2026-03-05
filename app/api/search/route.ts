import { searchFilms } from "@/lib/api";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get("q")?.trim() ?? "";

  if (keyword.length < 2) {
    return Response.json({ items: [], total: 0 });
  }

  const data = await searchFilms(keyword, 1);
  return Response.json({
    items: data.items.slice(0, 8),
    total: data.paginate.total_items,
  });
}
