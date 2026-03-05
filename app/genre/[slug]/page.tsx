import CategoryListPage from "@/components/CategoryListPage";
import { getFilmsByGenre } from "@/lib/api";

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<{ page?: string }>;

export default async function GenrePage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { slug } = await params;
  const { page } = await searchParams;
  const currentPage = Math.max(1, Number(page ?? 1));

  const data = await getFilmsByGenre(slug, currentPage);

  return (
    <CategoryListPage
      label="Thể loại"
      catTitle={data.cat?.title ?? slug}
      movies={data.items}
      paginate={data.paginate}
      baseHref={`/genre/${slug}`}
    />
  );
}
