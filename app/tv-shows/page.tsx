import CategoryListPage from "@/components/CategoryListPage";
import { getMoviesByCategory } from "@/lib/api";

type SearchParams = Promise<{ page?: string }>;

export default async function TvShowsPage({ searchParams }: { searchParams: SearchParams }) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, Number(page ?? 1));

  const data = await getMoviesByCategory("tv-shows", currentPage);

  return (
    <CategoryListPage
      label="Danh sách"
      catTitle={data.cat?.title ?? "TV Shows"}
      movies={data.items}
      paginate={data.paginate}
      baseHref="/tv-shows"
    />
  );
}
