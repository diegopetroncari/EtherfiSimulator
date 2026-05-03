# ether.fi Cash · simulador BR

Simulador independente do cartão **[ether.fi Cash](https://ether.fi)** focado em quem gasta em **BRL, USD ou EUR** e quer entender o custo real de usar um cartão cripto denominado em dólar comparado a um cartão brasileiro tradicional.

> ⚠️ **Não-oficial.** Este projeto não tem relação com a Ether.fi. As regras numéricas vêm do [Help Center público](https://help.ether.fi) e podem mudar a qualquer momento — confira sempre antes de tomar decisões financeiras.

## Visão geral

- Calcula a cadeia completa: BRL → USD via Visa, FX fee de 1%, cashback progressivo, juros do Borrow Mode e custo líquido em R$.
- Compara lado a lado com um cartão brasileiro (IOF + spread bancário configuráveis).
- Cotações ao vivo (USD/BRL e EUR/BRL) via AwesomeAPI, com fallback e cache de 1h.
- Estado serializado na URL (compartilhável) e persistido em `localStorage`.
- 44 testes garantindo aderência ao spec da ether.fi e ao bug histórico já corrigido do cashback.

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 + TypeScript strict |
| Estilo | Tailwind CSS 4 + CSS variables, sem dark mode |
| Estado | Hooks custom (`useSimulatorState`, `useLiveRates`) + SWR + zod |
| Testes | Vitest + Testing Library + jsdom |
| Deploy | Vercel (Fluid Compute, Node 24) |

## Começando

Requer Node 20+ e npm.

```bash
git clone https://github.com/diegopetroncari/EtherfiSimulator.git
cd EtherfiSimulator
npm install
npm run dev      # http://localhost:3000
```

### Scripts

```bash
npm run dev          # Turbopack dev server
npm run build        # build de produção
npm run start        # roda o build
npm run typecheck    # tsc --noEmit (strict + noUncheckedIndexedAccess)
npm run lint         # eslint-config-next
npm test             # vitest run (44 testes)
npm run test:watch   # vitest watch
npm run test:ui      # interface Vitest UI
```

### Variáveis de ambiente (opcional)

```env
NEXT_PUBLIC_DEFAULT_USD_BRL=5.00
NEXT_PUBLIC_DEFAULT_EUR_BRL=5.45
```

Usadas apenas como fallback quando a AwesomeAPI falha. Sem `.env`, o app cai nos defaults hardcoded.

## Modelo financeiro

O coração do projeto. Lógica isolada em [`lib/simulator/`](lib/simulator/), pura, sem dependência de UI.

### Regras implementadas

| Cenário | FX fee | Tabela cashback | Moeda do cashback |
|---|---|---|---|
| BRL | 1% sobre USD pós-Visa | Standard | USD |
| USD | 0% | Standard | USD |
| EUR | 0% (programa beta) | EUR | EUR (creditado em wETH no vault) |

- **Cashback Standard** (Core/Luxe/Pinnacle): slabs progressivos `3% → 1% → 0,5%`.
- **Cashback EUR**: slabs progressivos `3% → 1% → 0,1%` com thresholds menores.
- **ATM**: taxa 2%, sem cashback.
- **Borrow Mode**: 4% APY efetivo. Exemplo da doc: `$100` emprestados → `$104` em 365 dias. Implementado como `(1 + 0.04)^(d/365) − 1`.
- **Cartão BR comparativo**: `nominalBRL × (1 + IOF% + spread%)`.

### Conferência contra a doc

Antes de cada release, validar:

1. `npm test` (todos os 44 verdes).
2. Constantes em [`lib/simulator/constants.ts`](lib/simulator/constants.ts) batem com o [Help Center](https://help.ether.fi/en/articles/262374-how-does-cashback-work).
3. `lib/__tests__/cashback.test.ts` mantém o **regression test do bug do cursor** (label `BUG REGRESSION`). Não remover.
4. `lib/__tests__/parity.test.ts` confronta `simulate()` com a interpretação spec da doc — atualizado em maio/2026 após auditoria.

### Bug histórico do cashback

A versão original tinha um cursor regressivo em `calcCashback`: quando `monthlyAcc` já estava além de um slab, o cursor "voltava" para `slab.upTo`, fazendo a transação ser cobrada na alíquota errada. Caso clínico: `monthlyAcc=5000, tx=$100, Core` retornava `$1,00` (1%) em vez do correto `$0,50` (0,5%). O fix está em [`lib/simulator/cashback.ts`](lib/simulator/cashback.ts) e tem teste explícito.

## Arquitetura

```
.
├── app/                      Next.js App Router (Server Components)
│   ├── api/rates/route.ts    Vercel Function · cotações ao vivo (revalidate 1h)
│   ├── layout.tsx            fontes Google + globals.css
│   └── page.tsx              renderiza <Simulator/>
├── components/               UI client-side (modernismo brasileiro)
│   ├── Simulator.tsx         orquestrador
│   ├── Hero.tsx              wordmark + vídeo curvo
│   ├── InputBlock.tsx        bloco 01 · valor heroico
│   ├── CostBlock.tsx         bloco 02 · custo em R$ + CTA referral
│   ├── ParamsColumn.tsx      tier, modo, cotações, cartão BR
│   ├── Decomposition.tsx     cadeia transparente USD → R$
│   ├── Scenarios.tsx         comparativo cripto vs cartão BR
│   ├── ReferralBanner.tsx    benefícios oficiais Luxe
│   └── Notes.tsx             8 notas técnicas
├── hooks/
│   ├── useSimulatorState.ts  hidrata URL > localStorage > defaults
│   └── useLiveRates.ts       SWR contra /api/rates
├── lib/
│   ├── simulator/            modelo financeiro puro
│   │   ├── constants.ts      tabelas, FX, ATM, BORROW_APY
│   │   ├── cashback.ts       slabs progressivos
│   │   ├── model.ts          simulate(): SimulationResult
│   │   └── types.ts
│   ├── __tests__/            44 testes (cashback, model, url-state, parity)
│   ├── rates.ts              fetch AwesomeAPI + cache
│   ├── url-state.ts          encode/decode com chaves curtas + zod
│   └── referral.ts           link e benefícios oficiais
└── public/                   ícones, favicon
```

## Estado e persistência

`useSimulatorState` hidrata na ordem **URL > localStorage > defaults**:

- URL é fonte da verdade para compartilhamento (chaves curtas `c=BRL&v=500&t=Core&m=DP&...`, sincronizada via `history.replaceState`).
- `localStorage` salva com debounce 300ms para preservar entre sessões.
- `useLiveRates` usa SWR contra `/api/rates`, refresh de 1h, sem revalidação no foco.

Cotações ao vivo só são aplicadas se o usuário não personalizou o campo — respeita override manual.

## Direção estética

**Modernismo brasileiro** (Niemeyer + Lina Bo Bardi). Não é dashboard, fintech corporativo nem editorial dark. Detalhes:

- Paleta cream/concreto + acento tijolo SESC Pompéia, fixa em `app/globals.css`.
- Três famílias tipográficas com papéis distintos: **Bricolage Grotesque** (display orgânico), **Instrument Serif** italic (números heróis), **JetBrains Mono** (valores tabulares).
- Curvas intencionais, não rounded uniforme: blocos principais com **um único canto** curvo de 24px, espelhado entre input e output.
- Grid assimétrico (`0.85fr · 1.15fr`), numeração lateral em `vertical-rl`, regras horizontais com peso variável.
- Animações sutis com `prefers-reduced-motion: reduce` respeitado.

## Deploy na Vercel

O projeto já vem configurado para Vercel:

```bash
npx vercel link
npx vercel --prod
```

A rota `app/api/rates/route.ts` roda em Fluid Compute (Node.js 24) com `revalidate = 3600` e headers `s-maxage=3600, stale-while-revalidate=86400`.

## Programa de referral

O CTA principal aponta para o referral pessoal de [@diegopetroncari](https://www.ether.fi/@43a73160). Documentado publicamente:

- **Novo usuário** ganha pontos bônus em direção ao tier Luxe.
- **Referrer** ganha 10% de cashback adicional sobre os próprios gastos.
- **Mais de 10 referrals** liberam VIP gold card por 12 meses.

Centralizado em [`lib/referral.ts`](lib/referral.ts).

## Histórico

- **Origem:** um único arquivo `etherfi-simulador.jsx` de 887 linhas.
- **Refactor:** modelo financeiro extraído para `lib/simulator/` antes do redesign, com regression test para o bug do cashback descoberto na refatoração.
- **Maio/2026:** redesign modernista brasileiro (substituiu a v1 editorial dark) e auditoria contra a doc oficial — tabela EUR e fórmula Borrow corrigidas.

## Contribuindo

PRs são bem-vindos, especialmente para:

- Atualizar constantes quando a Ether.fi mudar regras (com fonte oficial citada).
- Adicionar moedas ou modos de pagamento.
- Melhorar acessibilidade.

Antes de abrir PR: `npm test && npm run typecheck && npm run lint`.

## Licença

MIT. Use por sua conta e risco. Não há garantia de exatidão dos cálculos.

---

Feito por [@diegopetroncari](https://github.com/diegopetroncari) · sem afiliação com a Ether.fi.
