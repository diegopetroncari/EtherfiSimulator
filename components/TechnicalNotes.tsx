export function TechnicalNotes() {
  return (
    <footer className="mx-auto mt-16 max-w-5xl border-t border-stone-800/70 pt-10">
      <div className="mb-5 font-sans text-[10px] uppercase tracking-[0.25em] text-stone-400">
        §4 · Notas técnicas
      </div>
      <div
        className="grid gap-x-10 gap-y-6 font-serif text-sm leading-relaxed text-stone-300 sm:grid-cols-2"
        style={{ fontVariationSettings: "'opsz' 14" }}
      >
        <div>
          <span className="font-medium text-stone-100">BRL.</span> Visa converte BRL→USD ao
          câmbio do dia da liquidação (1–2 dias após a compra), com spread típico entre 0,1%
          e 0,5% sobre o mid-market. ether.fi adiciona 1% sobre o USD resultante. IOF não é
          cobrado: ether.fi não é instituição financeira brasileira.
        </div>
        <div>
          <span className="font-medium text-stone-100">USD.</span> Cartão é nativamente
          USD-denominado, então compras em USD não passam por nenhuma conversão. Zero FX,
          zero spread. Cashback aplica na tabela Standard cheia. Cenário ideal do produto.
        </div>
        <div>
          <span className="font-medium text-stone-100">EUR.</span> Beneficia do 0% FX rate
          em beta: ether.fi não adiciona markup quando o merchant cobra em EUR. Funciona com
          USDC ou EURC. Em contrapartida, a tabela de cashback EUR é mais conservadora — o
          terceiro escalão cai para 0,1% (vs 0,5% no Standard).
        </div>
        <div>
          <span className="font-medium text-stone-100">
            DCC: nunca aceite mudar a moeda na maquininha.
          </span>{" "}
          Se uma maquininha em Lisboa oferecer cobrar em USD ou em BRL em vez de EUR,
          recuse. O DCC embute spread do estabelecimento e elimina o 0% FX. Mesmo em
          terminais brasileiros para cartões USD: pague na moeda local.
        </div>
        <div>
          <span className="font-medium text-stone-100">Borrow Mode.</span> Os juros começam
          a render no instante da compra, sem grace period, com capitalização contínua a 4%
          APY. Reembolsos não abatem automaticamente o saldo devedor — caem no vault e
          exigem repagamento manual.
        </div>
        <div>
          <span className="font-medium text-stone-100">MCCs sem cashback.</span> Saques
          (6011), plataformas de investimento (6012), corretoras (6211), aluguéis e
          imobiliárias (6513), instituições financeiras (6532) e jogos de azar (7995) não
          geram cashback, mesmo que a transação seja aprovada.
        </div>
        <div>
          <span className="font-medium text-stone-100">Cashback em wETH.</span> Pago
          automaticamente no vault, sem claim manual. O valor em USD/EUR é convertido para
          wETH no momento do crédito, então o resultado real depende da variação do ETH.
        </div>
        <div>
          <span className="font-medium text-stone-100">Receita Federal.</span> O fato de
          não haver IOF não te exime das obrigações brasileiras: declaração anual de cripto
          na DIRPF, recolhimento mensal de ganho de capital quando aplicável (DARF código
          4600) e, se a custódia for entendida como exterior, declaração de bens e direitos
          no exterior.
        </div>
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-stone-800/40 pt-6 font-sans text-[10px] uppercase tracking-[0.25em] text-stone-500">
        <span>Modelo informativo · não substitui simulação oficial</span>
        <a
          href="/v2"
          className="text-amber-400 underline-offset-4 hover:text-amber-300 hover:underline"
        >
          Ver v2 · modernismo brasileiro →
        </a>
        <span>v3.0 · maio 2026</span>
      </div>
    </footer>
  );
}
