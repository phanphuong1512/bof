import CategoryListPage from "@/components/CategoryListPage";
import { getMoviesByCategory } from "@/lib/api";

type SearchParams = Promise<{ page?: string }>;

export default async function UpcomingPage({ searchParams }: { searchParams: SearchParams }) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, Number(page ?? 1));

  const data = await getMoviesByCategory("phim-dang-chieu", currentPage);

  return (
    <CategoryListPage
      label="Danh sách"
      catTitle={data.cat?.title ?? "Phim Đang Chiếu"}
      movies={data.items}
      paginate={data.paginate}
      baseHref="/upcoming"
    />
  );
}
