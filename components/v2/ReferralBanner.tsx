"use client";

import { Arch } from "./Arch";
import { REFERRAL } from "@/lib/referral";

export function ReferralBanner() {
  return (
    <section
      aria-labelledby="referral-heading"
      className="relative overflow-hidden"
      style={{
        background: "var(--ink)",
        color: "var(--concrete)",
        borderRadius: "0 96px 0 0",
      }}
    >
      <Arch
        width={400}
        height={120}
        className="pointer-events-none absolute -bottom-2 left-1/2 -translate-x-1/2 opacity-30"
      />

      <div className="relative grid gap-8 px-8 py-12 sm:px-14 sm:py-16 lg:grid-cols-[1.2fr_1fr] lg:gap-12">
        <div>
          <div
            className="v2-mono text-xs"
            style={{ color: "var(--ochre)", letterSpacing: "0.2em" }}
          >
            referral · benefício oficial ether.fi
          </div>
          <h2
            id="referral-heading"
            className="v2-display mt-4 text-4xl sm:text-5xl"
            style={{ color: "var(--concrete)" }}
          >
            abra sua conta com{" "}
            <span style={{ color: "var(--ochre)" }}>pontos bônus</span>
            <br />
            rumo ao tier Luxe.
          </h2>
          <p
            className="mt-6 max-w-xl text-base leading-relaxed"
            style={{
              fontFamily: "var(--font-instrument-serif)",
              color: "var(--concrete)",
              opacity: 0.85,
            }}
          >
            Ao se cadastrar pelo link abaixo, sua conta entra com{" "}
            <em>pontos adicionais</em> em direção ao tier Luxe — onde o cashback de
            3% se estende até 10 mil USD/mês (vs 2 mil no Core). Eu, como referrer,
            recebo 10% de cashback adicional sobre meus próprios gastos. Programa
            documentado oficialmente pelo Help Center da ether.fi.
          </p>
        </div>

        <div
          className="flex flex-col justify-center gap-4"
          style={{ borderLeft: "1px solid rgba(236,228,210,0.2)", paddingLeft: "32px" }}
        >
          <div className="v2-meta" style={{ color: "var(--concrete)", opacity: 0.6 }}>
            link de referral · {REFERRAL.referrer}
          </div>
          <code
            className="v2-mono break-all text-sm"
            style={{ color: "var(--ochre)" }}
          >
            {REFERRAL.url}
          </code>
          <a
            href={REFERRAL.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-between gap-3 px-5 py-4 transition-all hover:scale-[1.01]"
            style={{
              background: "var(--tijolo)",
              color: "var(--concrete)",
              fontFamily: "var(--font-bricolage)",
              fontWeight: 600,
              letterSpacing: "0.05em",
              borderRadius: "0 24px 0 0",
            }}
          >
            <span>criar conta na ether.fi</span>
            <span aria-hidden>→</span>
          </a>
          <div
            className="v2-mono text-[10px] leading-relaxed"
            style={{ color: "var(--concrete)", opacity: 0.5 }}
          >
            sujeito aos termos oficiais ether.fi · este simulador não é afiliado nem
            endossado pela ether.fi
          </div>
        </div>
      </div>
    </section>
  );
}
