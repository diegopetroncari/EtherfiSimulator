"use client";

import { Arch } from "./Arch";
import { VIDEO_URL } from "@/lib/referral";

export function Hero() {
  return (
    <header className="relative mx-auto max-w-6xl px-6 pt-10 pb-6 sm:px-12 sm:pt-14 sm:pb-10">
      {/* Linha superior · brand + disclaimer */}
      <div className="mb-10 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-baseline gap-3">
          <span
            className="text-2xl tracking-tight"
            style={{
              fontFamily: "var(--font-bricolage)",
              fontVariationSettings: "'wdth' 90",
              fontWeight: 600,
              color: "var(--ink)",
            }}
          >
            ether.fi
          </span>
          <span className="v2-meta" style={{ color: "var(--ink-soft)" }}>
            cash · simulador
          </span>
        </div>
        <div
          className="text-right"
          style={{ borderLeft: "2px solid var(--tijolo)", paddingLeft: "12px" }}
        >
          <div
            className="v2-meta"
            style={{ color: "var(--tijolo)", letterSpacing: "0.2em" }}
          >
            site não-oficial
          </div>
          <div
            className="v2-mono mt-1 text-[11px]"
            style={{ color: "var(--ink-soft)" }}
          >
            por <strong style={{ color: "var(--ink)" }}>diegopetroncari</strong>
          </div>
        </div>
      </div>

      {/* Grid hero · texto à esquerda, vídeo à direita */}
      <div className="grid items-end gap-8 lg:grid-cols-[1fr_minmax(0,420px)] lg:gap-12">
        <div className="v2-stagger">
          <h1
            className="v2-display text-[14vw] leading-[0.9] sm:text-[10vw] lg:text-[7.5rem]"
            style={{ color: "var(--ink)" }}
          >
            o custo
            <br />
            <span style={{ color: "var(--tijolo)" }}>real</span> de gastar
            <br />
            em qualquer
            <br />
            moeda<span style={{ color: "var(--tijolo)" }}>.</span>
          </h1>

          <p
            className="mt-8 max-w-xl text-base leading-relaxed sm:text-lg"
            style={{
              fontFamily: "var(--font-instrument-serif)",
              color: "var(--ink-soft)",
            }}
          >
            Simulador independente para o cartão ether.fi Cash. Calcule o que sai do
            seu vault em compras BRL, USD e EUR — e compare com o seu cartão
            brasileiro de hoje. <em>O número que importa fica logo abaixo.</em>
          </p>

          <hr className="v2-rule-thick mt-8" />
        </div>

        {/* Bloco de vídeo · curvo, lembra o cost block */}
        <VideoBlock />
      </div>

      <Arch
        width={200}
        height={70}
        className="mx-auto mt-10 hidden lg:block"
      />
    </header>
  );
}

function VideoBlock() {
  return (
    <figure
      className="relative overflow-hidden"
      style={{
        background: "var(--ink)",
        borderTopRightRadius: "96px",
        aspectRatio: "4 / 5",
      }}
    >
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ filter: "saturate(1.1) contrast(1.05)" }}
        aria-hidden
      >
        <source src={VIDEO_URL} type="video/webm" />
      </video>
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, transparent 50%, rgba(27,22,18,0.65) 100%)",
        }}
      />
      <figcaption
        className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3"
        style={{ color: "var(--concrete)" }}
      >
        <span className="v2-meta" style={{ color: "var(--concrete)", opacity: 0.85 }}>
          ether.fi cash card
        </span>
        <span
          className="v2-mono text-[10px]"
          style={{ color: "var(--concrete)", opacity: 0.7 }}
        >
          imagem oficial
        </span>
      </figcaption>
    </figure>
  );
}
