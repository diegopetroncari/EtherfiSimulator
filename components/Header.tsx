export function Header() {
  return (
    <header className="mx-auto mb-12 max-w-5xl border-b border-stone-800 pb-8 sm:mb-16">
      <div className="mb-6 flex items-center gap-3">
        <div className="h-px w-8 bg-amber-600/70" aria-hidden />
        <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-amber-600/90">
          ether.fi Cash · Simulação · BRL · USD · EUR
        </span>
      </div>
      <h1
        className="mb-4 font-serif text-4xl font-light leading-[0.95] tracking-tight text-stone-50 sm:text-6xl"
        style={{ fontVariationSettings: "'opsz' 144" }}
      >
        O custo real de gastar
        <br />
        em <em className="font-normal italic text-amber-200/90">qualquer moeda</em>
        <br />
        com um cartão denominado em dólar.
      </h1>
      <p
        className="max-w-2xl font-serif text-sm leading-relaxed text-stone-300 sm:text-base"
        style={{ fontVariationSettings: "'opsz' 14" }}
      >
        Modelo construído a partir da documentação oficial do ether.fi (Help Center,
        atualizado em 2026): conversão Visa, FX fee de 1% para BRL, 0% FX para EUR, sem
        conversão para USD, juros de 4% APY no Borrow Mode, ATM fee de 2% e tabela
        progressiva de cashback em wETH com tier EUR ajustado.
      </p>
    </header>
  );
}
