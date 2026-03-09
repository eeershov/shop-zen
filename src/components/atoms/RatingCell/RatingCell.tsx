interface RatingCellProps {
  rating: number;
}

export function RatingCell({ rating }: RatingCellProps) {
  return (
    <span
      style={{
        fontFamily: "'Open Sans', sans-serif",
        ...(rating < 3 ? { color: "rgb(255, 77, 79)" } : {}),
      }}
    >
      {rating.toFixed(1)}/5
    </span>
  );
}
