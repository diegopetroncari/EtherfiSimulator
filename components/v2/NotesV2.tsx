import { SoftArch } from "./Arch";

interface Note {
  marker: string;
  title: string;
  body: string;
}

const NOTES: Note[] = [
  {
    marker: "i.",
    title: "BRL",
    body: "Visa converte BRL→USD ao câmbio do dia da liquidação (1–2 dias após a compra), com spread típico entre 0,1% e 0,5% sobre o mid-market. ether.fi adiciona 1% sobre o USD resultante. IOF não é cobrado: ether.fi não é instituição financeira brasileira.",
  },
  {
    marker: "ii.",
    title: "USD",
    body: "Cartão é nativamente USD-denominado. Compras em USD não passam por nenhuma conversão. Zero FX, zero spread. Cashback aplica na tabela Standard cheia. Cenário ideal do produto.",
  },
  {
    marker: "iii.",
    title: "EUR",
    body: "Beneficia do 0% FX rate em beta: ether.fi não adiciona markup quando o merchant cobra em EUR. Em contrapartida, a tabela de cashback EUR é mais conservadora — o terceiro escalão cai para 0,1%.",
  },
  {
    marker: "iv.",
    title: "DCC · nunca",
    body: "Se uma maquininha em Lisboa oferecer cobrar em USD ou em BRL em vez de EUR, recuse. O DCC embute spread do estabelecimento e elimina o 0% FX. Mesmo em terminais brasileiros para cartões USD: pague na moeda local.",
  },
  {
    marker: "v.",
    title: "Borrow Mode",
    body: "Os juros começam a render no instante da compra, sem grace period, com capitalização contínua a 4% APY. Reembolsos não abatem automaticamente o saldo devedor — caem no vault e exigem repagamento manual.",
  },
  {
    marker: "vi.",
    title: "MCCs sem cashback",
    body: "Saques (6011), plataformas de investimento (6012), corretoras (6211), aluguéis e imobiliárias (6513), instituições financeiras (6532) e jogos de azar (7995) não geram cashback, mesmo que aprovados.",
  },
  {
    marker: "vii.",
    title: "Cashback em wETH",
    body: "Pago automaticamente no vault, sem claim manual. O valor em USD/EUR é convertido para wETH no momento do crédito; o resultado real depende da variação do ETH.",
  },
  {
    marker: "viii.",
    title: "Receita Federal",
    body: "Não cobrar IOF não te exime das obrigações brasileiras: declaração anual de cripto na DIRPF, ganho de capital quando aplicável (DARF 4600) e, se entendida como custódia exterior, declaração de bens no exterior.",
  },
];

export function NotesV2() {
  return (
    <footer className="relative mx-auto max-w-6xl px-6 pt-20 pb-16 sm:px-12">
      <SoftArch className="absolute left-1/2 top-12 h-12 w-[80%] -translate-x-1/2 opacity-40" />

      <div className="mb-10 flex items-center gap-4">
        <hr className="v2-rule-thick" />
        <span className="v2-meta">§ quatro · notas técnicas</span>
      </div>

      <div className="grid gap-x-12 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
        {NOTES.map((n) => (
          <article key={n.marker} className="relative">
            <div
              className="v2-mono mb-3 text-xs"
              style={{ color: "var(--tijolo)", letterSpacing: "0.1em" }}
            >
              {n.marker}
            </div>
            <h3
              className="v2-display-sans mb-2 text-xl"
              style={{ color: "var(--ink)", fontWeight: 600 }}
            >
              {n.title}
            </h3>
            <p
              className="text-sm leading-relaxed"
              style={{
                fontFamily: "var(--font-instrument-serif)",
                color: "var(--ink-soft)",
              }}
            >
              {n.body}
            </p>
          </article>
        ))}
      </div>

      <div
        className="v2-meta mt-16 flex flex-wrap items-center justify-between gap-4 pt-8"
        style={{ borderTop: "1px solid var(--rule)", color: "var(--ink-soft)" }}
      >
        <span>modelo informativo · não substitui simulação oficial</span>
        <a
          href="/"
          style={{ color: "var(--tijolo)", textDecoration: "underline", textUnderlineOffset: "4px" }}
        >
          ← voltar para v1 (editorial)
        </a>
        <span>v2 · maio 2026</span>
      </div>
    </footer>
  );
}
