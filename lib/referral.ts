/**
 * Programa de referral oficial ether.fi.
 *
 * Fonte: ether.fi Help Center + cobertura Cryptopolitan (Jan 2026).
 *
 * - Quem se cadastra com um link de referral ganha pontos bônus em direção ao tier Luxe.
 * - O referrer recebe 10% de cashback adicional sobre seus próprios gastos.
 * - Acima de 10 referrals: VIP gold card por 12 meses no programa.
 * - Em campanhas promocionais (ex.: "Spend, Eat, Earn" Jan 2026), referees podem
 *   ganhar até 15% de desconto em categorias como restaurantes.
 *
 * Atenção: este simulador não é oficial e não tem qualquer relação com a ether.fi
 * além do uso público das tabelas documentadas. O link é o referral pessoal de
 * Diego Petroncari (diegopetroncari).
 */
export const REFERRAL = {
  url: "https://www.ether.fi/@43a73160",
  code: "@43a73160",
  referrer: "diegopetroncari",
  benefits: {
    forNewUser: "Pontos bônus em direção ao tier Luxe ao se cadastrar.",
    forReferrer: "10% de cashback adicional sobre os próprios gastos.",
  },
} as const;

export const VIDEO_URL = "https://www.ether.fi/videos/cash/cash_1.webm";
