import Image from "next/image";
import { CastMember } from "@/types/movie";

interface Props {
  cast: CastMember[];
}

export default function CastSection({ cast }: Props) {
  if (!cast.length) return null;

  return (
    <div>
      <h3 className="text-sm font-bold text-white mb-4">Cast</h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
        {cast.map((actor) => (
          <div key={actor.id} className="flex flex-col items-center gap-2 group cursor-pointer">
            <div
              className="relative w-16 h-16 rounded-full overflow-hidden transition-all group-hover:ring-2 group-hover:ring-purple-500"
              style={{ border: "2px solid rgba(255,255,255,0.08)" }}
            >
              <Image
                src={actor.avatar}
                alt={actor.name}
                fill
                style={{ objectFit: "cover" }}
                unoptimized
              />
            </div>
            <div className="text-center">
              <p className="text-xs font-medium text-white group-hover:text-purple-300 transition-colors leading-tight truncate max-w-[80px]">
                {actor.name}
              </p>
              {actor.role && (
                <p className="text-[10px] text-[#8892b0] leading-tight truncate max-w-[80px]">
                  {actor.role}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
