export function shopMoney(value: number, currency = "GBP") {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency }).format(
    value,
  );
}
export function conditionLabel(condition: string) {
  return (
    (
      {
        new: "New",
        used_like_new: "Pre-owned · Like new",
        used_good: "Pre-owned · Good",
        used_fair: "Pre-owned · Fair",
      } as Record<string, string>
    )[condition] ?? condition.replace(/_/g, " ")
  );
}
