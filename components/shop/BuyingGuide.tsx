export default function BuyingGuide() {
  return (
    <section
      id="buying-guide"
      className="scroll-mt-40 border-t border-white/10 py-16 md:py-24"
    >
      <div className="grid gap-8 md:grid-cols-[1fr_1.5fr]">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[.25em] text-lime-400">
            Before you pick your pair
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight">
            A closer look.
            <br />A better decision.
          </h2>
          <p className="mt-4 max-w-xs text-sm leading-7 text-[#aaa49a]">
            Every listing is an individual pair. Get to know its size, condition
            and details before adding it to your rotation.
          </p>
        </div>
        <div className="divide-y divide-white/10 border-y border-white/10">
          {[
            [
              "The pair in the photos",
              "Listing photos show the individual pair being offered. Use the enlarged gallery and condition notes to inspect the details.",
            ],
            [
              "New or pre-owned?",
              "The condition label tells you whether the pair is new or pre-owned. For a pre-owned pair, read its condition notes alongside the photos; every pair has its own history.",
            ],
            [
              "Finding your size",
              "Sizes are listed for each individual pair. Check the UK, US or EU label shown on the product page against a pair you already wear; fit can vary between models.",
            ],
            [
              "Your bag and checkout",
              "Adding a pair to your bag does not reserve it. Availability and the final total are checked when checkout starts. You can check out as a guest without a Nextsole app account.",
            ],
          ].map(([title, body]) => (
            <details key={title} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold">
                {title}
                <span
                  className="text-lg font-normal text-lime-400 group-open:rotate-45"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-xl text-sm leading-7 text-[#aaa49a]">
                {body}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
