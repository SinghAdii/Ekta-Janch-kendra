"use client";

export type ReviewData = {
  rating: number; // strictly 1–5
};

interface RatingDistributionProps {
  ratings?: ReviewData[];
}

export default function RatingDistribution({
  ratings = [],
}: RatingDistributionProps) {
  const total = ratings.length;

  if (total === 0) {
    return <p className="text-sm text-gray-500">No ratings available yet.</p>;
  }

  const counts = [1, 2, 3, 4, 5].reduce<Record<number, number>>((acc, star) => {
    acc[star] = ratings.filter((r) => r.rating === star).length;
    return acc;
  }, {});

  const maxCount = Math.max(...Object.values(counts));

  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: counts[star],
    percent: maxCount ? (counts[star] / maxCount) * 100 : 0,
  }));

  return (
    <div
      className="
        w-full
        md:w-100
        space-y-3
        shrink-0
      "
    >
      {distribution.map(({ star, count, percent }) => (
        <div key={star} className="flex items-center gap-3">
          {/* Star label */}
          <span className="w-14 text-sm font-medium text-gray-700 flex items-center gap-1">
            {star}
            <span className="text-yellow-400">★</span>
          </span>

          {/* Bar */}
          <div className="flex-1 h-2 bg-yellow-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-yellow-400 rounded-full transition-all duration-300"
              style={{ width: `${percent}%` }}
            />
          </div>

          {/* Count */}
          <span className="w-10 text-center text-sm text-gray-600">
            {count}
          </span>
        </div>
      ))}
    </div>
  );
}
