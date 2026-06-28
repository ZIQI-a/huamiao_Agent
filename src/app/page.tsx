"use client";

import Link from "next/link";
import { useState } from "react";
import { ROUTES } from "@/lib/routes";

/* ───── SVG Icons ───── */
const PenIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 24 L4 28 L8 28 L24 12 L20 8 Z" />
    <path d="M18 10 L22 14" />
    <path d="M4 28 L28 28" />
  </svg>
);

const BookIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="6" y="4" width="20" height="24" rx="2" />
    <path d="M10 10 L22 10 M10 14 L22 14 M10 18 L18 18" />
    <circle cx="16" cy="23" r="2" />
  </svg>
);

const LibraryIcon = ({ className = "w-8 h-8", style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 8 L4 26 Q4 24, 8 24 L16 24 L16 6 L8 6 Q4 6, 4 8" />
    <path d="M28 8 L28 26 Q28 24, 24 24 L16 24 L16 6 L24 6 Q28 6, 28 8" />
  </svg>
);

const ArrowRight = ({ className = "w-[18px] h-[18px]" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="M13 6l6 6-6 6" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
);

const PlayIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-6 h-6 flex-shrink-0 text-[#4ecdc4] mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const InfoIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </svg>
);

/* ───── Cat Logo SVG ───── */
const CatLogo = ({ size = 40 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <path d="M8 8 L14 4 L16 14 Z" fill="#FF8C42" />
    <path d="M32 8 L26 4 L24 14 Z" fill="#FF8C42" />
    <circle cx="20" cy="22" r="14" fill="#FF8C42" />
    <circle cx="15" cy="20" r="2.5" fill="#2D2A26" />
    <circle cx="25" cy="20" r="2.5" fill="#2D2A26" />
    <path d="M18 25 Q20 27 22 25" stroke="#2D2A26" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <path d="M9 16 Q6 18 9 20" stroke="#2D2A26" strokeWidth="1" fill="none" opacity="0.4" />
    <path d="M31 16 Q34 18 31 20" stroke="#2D2A26" strokeWidth="1" fill="none" opacity="0.4" />
  </svg>
);

/* ───── CSS Cat Character ───── */
function CatCharacter() {
  return (
    <div className="relative w-full h-[420px] flex items-center justify-center">
      {/* Background blob */}
      <div
        className="absolute w-[340px] h-[340px] rounded-full top-10"
        style={{ background: "radial-gradient(circle at 40% 40%, #ffe5d9 0%, transparent 70%)" }}
      />

      {/* Floating fish */}
      <svg
        className="absolute top-5 right-[10%] w-[60px] h-[40px]"
        viewBox="0 0 60 40"
        fill="none"
        style={{ animation: "floatFish 4s ease-in-out infinite" }}
      >
        <path d="M5 20 Q15 5, 35 20 Q15 35, 5 20 Z" fill="#4ECDC4" />
        <path d="M35 20 L50 10 L45 20 L50 30 Z" fill="#4ECDC4" />
        <circle cx="15" cy="17" r="2" fill="#2D2A26" />
      </svg>

      {/* Paw print decorations */}
      <svg className="absolute top-20 -left-5 w-7 h-7 opacity-15 text-[#FF8C42] -rotate-[20deg]" viewBox="0 0 28 28" fill="currentColor">
        <circle cx="14" cy="16" r="8" /><circle cx="6" cy="8" r="3" /><circle cx="14" cy="4" r="3" /><circle cx="22" cy="8" r="3" />
      </svg>
      <svg className="absolute bottom-15 -right-2.5 w-10 h-10 opacity-15 text-[#FF8C42] rotate-[15deg]" viewBox="0 0 28 28" fill="currentColor">
        <circle cx="14" cy="16" r="8" /><circle cx="6" cy="8" r="3" /><circle cx="14" cy="4" r="3" /><circle cx="22" cy="8" r="3" />
      </svg>
      <svg className="absolute top-50 right-2.5 w-[22px] h-[22px] opacity-15 text-[#FF8C42] rotate-45" viewBox="0 0 28 28" fill="currentColor">
        <circle cx="14" cy="16" r="8" /><circle cx="6" cy="8" r="3" /><circle cx="14" cy="4" r="3" /><circle cx="22" cy="8" r="3" />
      </svg>

      {/* The cat */}
      <div className="lp-cat" aria-hidden="true">
        <div className="lp-cat-ear lp-cat-ear-left" />
        <div className="lp-cat-ear lp-cat-ear-right" />
        <div className="lp-cat-ear-inner lp-cat-ear-inner-left" />
        <div className="lp-cat-ear-inner lp-cat-ear-inner-right" />
        <div className="lp-cat-face" />
        <div className="lp-cat-belly" />
        <div className="lp-cat-eye lp-cat-eye-left">
          <div className="lp-cat-eye-shine" />
        </div>
        <div className="lp-cat-eye lp-cat-eye-right">
          <div className="lp-cat-eye-shine" />
        </div>
        <div className="lp-cat-nose" />
        <div className="lp-cat-mouth" />
        <div className="lp-cat-whisker lp-cat-w1" />
        <div className="lp-cat-whisker lp-cat-w2" />
        <div className="lp-cat-whisker lp-cat-w3" />
        <div className="lp-cat-whisker lp-cat-w4" />
        <div className="lp-cat-paw lp-cat-paw-left" />
        <div className="lp-cat-paw lp-cat-paw-right" />
        <div className="lp-cat-tail" />
      </div>
    </div>
  );
}

/* ───── Main Landing Page ───── */
export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: "var(--lp-bg)", color: "var(--lp-fg)" }}>

      {/* ===== Navigation ===== */}
      <nav
        className="fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-[1168px] z-[1000] backdrop-blur-[20px] border-[1.5px] rounded-full px-5 py-2.5 flex items-center justify-between transition-shadow"
        style={{
          background: "rgba(255,248,238,0.85)",
          borderColor: "var(--lp-border)",
          boxShadow: "var(--lp-shadow-sm)",
        }}
      >
        <Link href={ROUTES.landing} className="flex items-center gap-2 font-['ZCOOL_KuaiLe',cursive] text-[22px]" style={{ color: "var(--lp-fg)" }}>
          <CatLogo size={36} />
          话喵
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          <a href="#features" className="px-4 py-2 rounded-full text-[15px] font-medium transition-colors hover:bg-[var(--lp-bg-warm)]" style={{ color: "var(--lp-fg)" }}>功能</a>
          <a href="#how" className="px-4 py-2 rounded-full text-[15px] font-medium transition-colors hover:bg-[var(--lp-bg-warm)]" style={{ color: "var(--lp-fg)" }}>使用流程</a>
          <a href="#showcase" className="px-4 py-2 rounded-full text-[15px] font-medium transition-colors hover:bg-[var(--lp-bg-warm)]" style={{ color: "var(--lp-fg)" }}>创作演示</a>
          <Link
            href={ROUTES.home}
            className="px-5 py-2.5 rounded-full text-[15px] font-bold text-white transition-all hover:-translate-y-0.5"
            style={{ background: "var(--lp-accent)", boxShadow: "0 4px 14px rgba(255,140,66,0.3)" }}
          >
            开始创作
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden flex flex-col gap-1 p-2"
          aria-label="打开菜单"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className="w-6 h-0.5 rounded-sm" style={{ background: "var(--lp-fg)" }} />
          <span className="w-6 h-0.5 rounded-sm" style={{ background: "var(--lp-fg)" }} />
          <span className="w-6 h-0.5 rounded-sm" style={{ background: "var(--lp-fg)" }} />
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-20 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-[400px] z-[999] rounded-2xl p-4 flex flex-col gap-2 border" style={{ background: "var(--lp-surface)", borderColor: "var(--lp-border)", boxShadow: "var(--lp-shadow-md)" }}>
          <a href="#features" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-xl text-[15px] font-medium" style={{ color: "var(--lp-fg)" }}>功能</a>
          <a href="#how" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-xl text-[15px] font-medium" style={{ color: "var(--lp-fg)" }}>使用流程</a>
          <a href="#showcase" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-xl text-[15px] font-medium" style={{ color: "var(--lp-fg)" }}>创作演示</a>
          <Link
            href={ROUTES.home}
            onClick={() => setMobileMenuOpen(false)}
            className="px-4 py-3 rounded-xl text-[15px] font-bold text-white text-center"
            style={{ background: "var(--lp-accent)" }}
          >
            开始创作
          </Link>
        </div>
      )}

      {/* ===== Hero ===== */}
      <section className="relative pt-[140px] pb-20 px-6" id="top">
        {/* Floating shapes */}
        <div
          className="absolute top-25 -left-15 w-[200px] h-[200px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(255,217,61,0.3) 0%, transparent 70%)",
            animation: "floatBlob 6s ease-in-out infinite",
          }}
        />
        <div
          className="absolute -bottom-10 right-[30%] w-[300px] h-[300px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(78,205,196,0.15) 0%, transparent 70%)",
            animation: "floatBlob 8s ease-in-out infinite reverse",
          }}
        />

        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
          {/* Hero text */}
          <div>
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 lp-rise lp-rise-1"
              style={{ background: "var(--lp-bg-warm)", border: "1.5px solid var(--lp-border)", color: "var(--lp-accent-deep)" }}
            >
              <span className="w-2 h-2 rounded-full" style={{ background: "var(--lp-accent)", animation: "pulse 2s ease-in-out infinite" }} />
              AI 智能创作平台 · v0.1.0
            </div>

            <h1
              className="lp-rise lp-rise-2 font-['ZCOOL_KuaiLe',cursive] text-[clamp(48px,7vw,84px)] leading-[1.1] mb-5 tracking-wide"
              style={{ color: "var(--lp-fg)" }}
            >
              让{" "}
              <span className="relative inline-block" style={{ color: "var(--lp-accent)" }}>
                话喵
                <span
                  className="absolute bottom-1 left-0 right-0 h-3 rounded-full -z-10 opacity-60"
                  style={{ background: "var(--lp-yellow)" }}
                />
              </span>
              <br />
              陪你写好每一个字
            </h1>

            <p className="lp-rise lp-rise-3 text-lg leading-7 max-w-[480px] mb-9" style={{ color: "var(--lp-muted)" }}>
              AI 驱动的文章创作、古诗词生成与风格仿写平台。输入一个标题、一个词语、一段喜欢的文章，话喵帮你把灵感变成成稿。
            </p>

            <div className="lp-rise lp-rise-4 flex gap-4 flex-wrap">
              <Link
                href={ROUTES.home}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-bold text-white transition-all hover:-translate-y-0.5"
                style={{ background: "var(--lp-accent)", boxShadow: "0 6px 20px rgba(255,140,66,0.35)" }}
              >
                <EditIcon />
                立即开始创作
              </Link>
              <a
                href="#showcase"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-semibold border-2 transition-all hover:-translate-y-0.5"
                style={{ background: "var(--lp-surface)", color: "var(--lp-fg)", borderColor: "var(--lp-border)" }}
              >
                <PlayIcon />
                看看怎么用
              </a>
            </div>
          </div>

          {/* Cat character */}
          <div className="lp-rise lp-rise-5">
            <CatCharacter />
          </div>
        </div>
      </section>

      {/* ===== Features (Bento Layout) ===== */}
      <section className="py-20 px-6 relative" id="features">
        <div className="text-center max-w-[600px] mx-auto mb-14">
          <span
            className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
            style={{ background: "var(--lp-bg-warm)", color: "var(--lp-accent-deep)" }}
          >
            三大核心功能
          </span>
          <h2 className="font-['ZCOOL_KuaiLe',cursive] text-[clamp(32px,4.5vw,48px)] leading-tight mb-4" style={{ color: "var(--lp-fg)" }}>
            选一种方式，让话喵帮你写
          </h2>
          <p className="text-[17px] leading-7" style={{ color: "var(--lp-muted)" }}>
            从文章到古诗词，从自由创作到风格仿写，话喵覆盖你的日常创作场景。
          </p>
        </div>

        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6">
          {/* Large card: 文章创作 */}
          <article
            className="relative overflow-hidden rounded-3xl p-9 row-span-2 text-white transition-all hover:-translate-y-1.5"
            style={{ background: "linear-gradient(135deg, var(--lp-accent) 0%, var(--lp-coral) 100%)", boxShadow: "var(--lp-shadow-lg)" }}
          >
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5" style={{ background: "rgba(255,255,255,0.25)" }}>
              <PenIcon className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-['ZCOOL_KuaiLe',cursive] text-3xl mb-3 leading-snug">文章创作</h3>
            <p className="text-base leading-7 opacity-90 mb-5">
              输入标题，选好字数、风格和详细程度，话喵在几秒内交出一篇结构完整、语句通顺的初稿。改到满意为止。
            </p>
            <div className="flex gap-2 flex-wrap mb-4">
              <span className="px-3 py-1 rounded-full text-[13px] font-medium" style={{ background: "rgba(255,255,255,0.2)" }}>短文 / 长文</span>
              <span className="px-3 py-1 rounded-full text-[13px] font-medium" style={{ background: "rgba(255,255,255,0.2)" }}>多风格切换</span>
              <span className="px-3 py-1 rounded-full text-[13px] font-medium" style={{ background: "rgba(255,255,255,0.2)" }}>一键调节字数</span>
            </div>
            <Link href={ROUTES.home} className="inline-flex items-center gap-1.5 text-base font-semibold text-white relative group">
              试试写一篇文章
              <ArrowRight className="w-[18px] h-[18px] transition-transform group-hover:translate-x-1.5" />
              <span className="absolute bottom-1 left-0 right-0 h-0.5 bg-white rounded-sm opacity-30" />
            </Link>
            <svg className="absolute -bottom-5 -right-5 w-[180px] h-[180px] opacity-15" viewBox="0 0 180 180" fill="none">
              <path d="M40 40 Q90 20, 140 40 Q160 90, 140 140 Q90 160, 40 140 Q20 90, 40 40" fill="#fff" />
            </svg>
          </article>

          {/* Card: 古诗词生成 */}
          <article
            className="relative overflow-hidden rounded-3xl p-9 text-white transition-all hover:-translate-y-1.5"
            style={{ background: "linear-gradient(135deg, #4ecdc4 0%, #3DB5AC 100%)", boxShadow: "0 16px 40px rgba(78,205,196,0.3)" }}
          >
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5" style={{ background: "rgba(255,255,255,0.25)" }}>
              <BookIcon className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-['ZCOOL_KuaiLe',cursive] text-[26px] mb-3 leading-snug">古诗词生成</h3>
            <p className="text-[15px] leading-7 opacity-90 mb-5">
              给一个名词，话喵为你作一首古诗词，附带注释与赏析，帮你读懂每一处用意。
            </p>
            <Link href={ROUTES.poems} className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-white relative group">
              试试作一首诗
              <ArrowRight className="w-[18px] h-[18px] transition-transform group-hover:translate-x-1.5" />
              <span className="absolute bottom-1 left-0 right-0 h-0.5 bg-white rounded-sm opacity-30" />
            </Link>
          </article>

          {/* Card: 风格文库 */}
          <article
            className="relative overflow-hidden rounded-3xl p-9 transition-all hover:-translate-y-1.5"
            style={{ background: "linear-gradient(135deg, #ffd93d 0%, #F0B429 100%)", color: "var(--lp-fg)", boxShadow: "0 16px 40px rgba(255,217,61,0.3)" }}
          >
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5" style={{ background: "rgba(45,42,38,0.1)" }}>
              <LibraryIcon className="w-8 h-8" style={{ color: "var(--lp-fg)" }} />
            </div>
            <h3 className="font-['ZCOOL_KuaiLe',cursive] text-[26px] mb-3 leading-snug">风格文库</h3>
            <p className="text-[15px] leading-7 opacity-90 mb-5">
              导入你喜欢的文章，话喵学习风格后进行仿写创作，让 AI 写出像你喜欢的作者那样的文字。
            </p>
            <Link href={ROUTES.styles} className="inline-flex items-center gap-1.5 text-[15px] font-semibold relative group" style={{ color: "var(--lp-fg)" }}>
              试试风格仿写
              <ArrowRight className="w-[18px] h-[18px] transition-transform group-hover:translate-x-1.5" />
              <span className="absolute bottom-1 left-0 right-0 h-0.5 rounded-sm opacity-30" style={{ background: "var(--lp-fg)" }} />
            </Link>
          </article>
        </div>
      </section>

      {/* ===== How It Works ===== */}
      <section
        className="py-20 px-6 mt-10 rounded-t-3xl"
        id="how"
        style={{ background: "var(--lp-bg-warm)" }}
      >
        <div className="text-center max-w-[600px] mx-auto mb-14">
          <span
            className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
            style={{ background: "var(--lp-surface)", color: "var(--lp-accent-deep)" }}
          >
            三步搞定
          </span>
          <h2 className="font-['ZCOOL_KuaiLe',cursive] text-[clamp(32px,4.5vw,48px)] leading-tight mb-4" style={{ color: "var(--lp-fg)" }}>
            话喵创作流程
          </h2>
          <p className="text-[17px] leading-7" style={{ color: "var(--lp-muted)" }}>
            不用学复杂操作，三步就能出稿。
          </p>
        </div>

        <div className="max-w-[1000px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Paw trail connector (desktop only) */}
          <div className="hidden md:block absolute top-9 left-[16%] right-[16%] h-[3px] pointer-events-none z-0">
            <div
              className="absolute top-1/2 left-0 right-0 h-[3px] -translate-y-1/2 opacity-30"
              style={{ background: "repeating-linear-gradient(90deg, var(--lp-accent) 0, var(--lp-accent) 8px, transparent 8px, transparent 20px)" }}
            />
          </div>

          {[
            { num: "1", title: "输入关键词", desc: "一个标题、一个名词或一段参考文章，告诉话喵你想写什么。" },
            { num: "2", title: "选择风格", desc: "字数、文风、详细程度都可以调，古诗词还是白话文由你定。" },
            { num: "3", title: "拿到初稿", desc: "几秒后话喵交出完整文章，你可以在此基础上继续修改润色。" },
          ].map((step) => (
            <div key={step.num} className="text-center relative z-10">
              <div
                className="w-[72px] h-[72px] rounded-full border-[3px] flex items-center justify-center mx-auto mb-5 font-['ZCOOL_KuaiLe',cursive] text-[28px] transition-all hover:scale-110 hover:rotate-[5deg]"
                style={{ background: "var(--lp-surface)", borderColor: "var(--lp-accent)", color: "var(--lp-accent-deep)" }}
              >
                {step.num}
              </div>
              <h3 className="font-['ZCOOL_KuaiLe',cursive] text-[22px] mb-2">{step.title}</h3>
              <p className="text-[15px] leading-relaxed" style={{ color: "var(--lp-muted)" }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Showcase ===== */}
      <section className="py-20 px-6" id="showcase">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-14 items-center">
          {/* Text side */}
          <div>
            <span
              className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
              style={{ background: "var(--lp-surface)", color: "var(--lp-accent-deep)" }}
            >
              创作演示
            </span>
            <h2 className="font-['ZCOOL_KuaiLe',cursive] text-[clamp(32px,4.5vw,48px)] leading-tight mb-4 text-left" style={{ color: "var(--lp-fg)" }}>
              看话喵怎么帮你写字
            </h2>
            <p className="text-[17px] leading-7 mb-6 text-left" style={{ color: "var(--lp-muted)" }}>
              以文章创作为例，整个过程比泡一杯咖啡还快。
            </p>
            <ul className="space-y-2.5">
              {["输入标题后自动展开大纲，结构清晰不跑题", "风格可切换：正式、轻松、文艺、科普任你选", "生成结果可直接编辑，改完一键复制带走"].map((text) => (
                <li key={text} className="flex items-start gap-3 text-base leading-relaxed">
                  <CheckIcon />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Mock window */}
          <div
            className="rounded-2xl overflow-hidden border-[1.5px] transition-transform"
            style={{
              background: "var(--lp-surface)",
              borderColor: "var(--lp-border)",
              boxShadow: "var(--lp-shadow-lg)",
              transform: "perspective(1000px) rotateY(-3deg) rotateX(2deg)",
            }}
          >
            <div
              className="px-4 py-3 flex items-center gap-2 border-b"
              style={{ background: "var(--lp-bg-warm)", borderColor: "var(--lp-border)" }}
            >
              <span className="w-3 h-3 rounded-full bg-[#ff6b6b]" />
              <span className="w-3 h-3 rounded-full bg-[#ffd93d]" />
              <span className="w-3 h-3 rounded-full bg-[#4ecdc4]" />
            </div>
            <div className="p-5">
              <div className="mb-4">
                <div className="text-[13px] font-medium mb-1.5" style={{ color: "var(--lp-muted)" }}>文章标题</div>
                <div
                  className="px-3.5 py-2.5 rounded-xl text-sm border-[1.5px]"
                  style={{ background: "var(--lp-bg)", borderColor: "var(--lp-border)", color: "var(--lp-fg)" }}
                >
                  春天的第一场雨
                </div>
              </div>
              <div className="mb-4">
                <div className="text-[13px] font-medium mb-1.5" style={{ color: "var(--lp-muted)" }}>风格与字数</div>
                <div className="flex gap-1.5 flex-wrap">
                  {["文艺", "正式", "轻松", "800字", "1500字"].map((tag, i) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 rounded-full text-xs font-medium"
                      style={{
                        background: i === 0 ? "var(--lp-accent)" : "var(--lp-bg-warm)",
                        color: i === 0 ? "#fff" : "var(--lp-accent-deep)",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div
                className="mt-3 p-3.5 rounded-xl border-[1.5px] text-[13px] leading-7"
                style={{ background: "var(--lp-bg)", borderColor: "var(--lp-border)", borderStyle: "dashed", color: "var(--lp-muted)" }}
              >
                <span className="font-medium" style={{ color: "var(--lp-accent-deep)" }}>话喵正在创作中…</span>
                <br />
                春天的第一场雨，落在一个不经意的清晨。窗外的梧桐还没来得及长满新叶，雨点便敲在了玻璃上——轻、密、不慌不忙，像是有人用指节叩着桌面……
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Stats Banner ===== */}
      <section className="py-6 px-6">
        <div
          className="max-w-[1100px] mx-auto py-12 px-10 rounded-3xl grid grid-cols-1 md:grid-cols-3 gap-8 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, var(--lp-fg) 0%, #1a1815 100%)" }}
        >
          <div
            className="absolute -top-10 -right-10 w-[200px] h-[200px] rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(255,140,66,0.2) 0%, transparent 70%)" }}
          />
          {[
            { num: "3", label: "核心创作模式" },
            { num: "10s", label: "平均出稿时间" },
            { num: "∞", label: "修改次数不限" },
          ].map((stat) => (
            <div key={stat.label} className="text-center relative z-10">
              <div
                className="font-['ZCOOL_KuaiLe',cursive] text-[clamp(36px,5vw,52px)] leading-tight"
                style={{
                  background: "linear-gradient(135deg, var(--lp-accent) 0%, var(--lp-yellow) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {stat.num}
              </div>
              <div className="text-[15px] mt-2 text-white/70">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Final CTA ===== */}
      <section className="py-20 pb-[120px] px-6 text-center relative" id="start">
        <div
          className="max-w-[700px] mx-auto py-16 px-10 rounded-3xl border-2 relative overflow-hidden"
          style={{ background: "var(--lp-surface)", borderColor: "var(--lp-border)" }}
        >
          <div
            className="absolute -top-15 -left-15 w-[180px] h-[180px] rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(255,217,61,0.2) 0%, transparent 70%)" }}
          />
          <div
            className="absolute -bottom-15 -right-15 w-[180px] h-[180px] rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(78,205,196,0.15) 0%, transparent 70%)" }}
          />

          <h2 className="font-['ZCOOL_KuaiLe',cursive] text-[clamp(28px,4vw,40px)] mb-4 relative z-10" style={{ color: "var(--lp-fg)" }}>
            准备好和话喵一起写字了吗？
          </h2>
          <p className="text-[17px] mb-8 relative z-10" style={{ color: "var(--lp-muted)" }}>
            不用注册，点开就能用。让你的下一个灵感，变成一篇完整的文章。
          </p>
          <div className="flex gap-4 justify-center flex-wrap relative z-10">
            <Link
              href={ROUTES.home}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-bold text-white transition-all hover:-translate-y-0.5"
              style={{ background: "var(--lp-accent)", boxShadow: "0 6px 20px rgba(255,140,66,0.35)" }}
            >
              <EditIcon />
              开始写文章
            </Link>
            <a
              href="#how"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-semibold border-2 transition-all hover:-translate-y-0.5"
              style={{ background: "var(--lp-surface)", color: "var(--lp-fg)", borderColor: "var(--lp-border)" }}
            >
              <InfoIcon />
              了解使用流程
            </a>
          </div>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer
        className="py-10 px-6 text-center border-t-[1.5px]"
        style={{ background: "var(--lp-bg-warm)", borderColor: "var(--lp-border)" }}
      >
        <div className="inline-flex items-center gap-2 font-['ZCOOL_KuaiLe',cursive] text-2xl mb-2" style={{ color: "var(--lp-fg)" }}>
          <CatLogo size={28} />
          话喵
        </div>
        <p className="text-sm" style={{ color: "var(--lp-muted)" }}>
          AI 智能创作平台 · v0.1.0
        </p>
      </footer>
    </div>
  );
}
