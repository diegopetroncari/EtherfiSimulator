import { Arch } from "./Arch";

export function HeroV2() {
  return (
    <header className="relative mx-auto max-w-6xl px-6 pt-12 pb-8 sm:px-12 sm:pt-20 sm:pb-12">
      <div className="v2-stagger">
        <div className="v2-meta flex items-center gap-3">
          <span style={{ background: "var(--tijolo)", width: "32px", height: "1.5px" }} />
          ether.fi Cash · simulação · São Paulo · maio 2026
        </div>

        <h1
          className="v2-display mt-8 text-[14vw] sm:text-[10vw] lg:text-[8.5rem]"
          style={{ color: "var(--ink)", maxWidth: "20ch" }}
        >
          o custo
          <br />
          <span style={{ color: "var(--tijolo)" }}>real</span> de gastar
          <br />
          em qualquer
          <br />
          moeda<span style={{ color: "var(--tijolo)" }}>.</span>
        </h1>

        <div className="absolute right-6 top-24 hidden lg:block">
          <Arch width={280} height={120} />
        </div>

        <p
          className="mt-12 max-w-2xl text-base leading-relaxed sm:text-lg"
          style={{ fontFamily: "var(--font-instrument-serif)", color: "var(--ink-soft)" }}
        >
          Modelo construído sobre a documentação ether.fi (2026): conversão Visa, FX fee de
          1% para BRL, isento em USD e EUR (beta), juros de 4% APY no Borrow Mode, ATM fee
          de 2% e a tabela progressiva de cashback em wETH.{" "}
          <em>O número à direita é o que sai do seu vault.</em>
        </p>

        <hr className="v2-rule-thick mt-10" />
      </div>
    </header>
  );
}
