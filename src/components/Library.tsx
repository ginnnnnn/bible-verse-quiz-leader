"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { collections, getCollection } from "@/data/collections";
import featuredScripture from "@/data/featuredScripture.json";
import { readPosition, type ReadingPosition } from "@/lib/reading-storage";
import Icon from "./Icon";
import { InstallBanner } from "./WebAppProvider";

export default function Library() {
  const [lastRead, setLastRead] = useState<ReadingPosition | null>(null);
  useEffect(() => {
    setLastRead(readPosition("scripture_lastRead"));
  }, []);
  const lastCollection = lastRead && getCollection(lastRead.collectionId);
  const lastScripture =
    lastCollection &&
    lastCollection.scriptures.find((s) => s.id === lastRead?.scriptureId);

  return (
    <main id="main-content" className="library-main">
      <section className="library-hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="tiny-line" />
            讓真理，走進日常
          </div>
          <h1 id="hero-title">
            把神的話，
            <br />
            收藏在<span>心裡。</span>
          </h1>
          <p className="hero-description">
            慢下來，讀一節經文。
            <br />
            在反覆默想中，讓話語成為生命的力量。
          </p>
          <a href="#collections" className="button button-primary hero-action">
            探索經文卡
            <Icon name="arrow" />
          </a>
          <div className="hero-footnote">
            <span className="small-star">✦</span>閱讀・默想・記在心上
          </div>
        </div>
        <div
          className="hero-art"
          aria-label={`${featuredScripture.verse}${featuredScripture.reference}`}
        >
          <div className="art-orbit orbit-one" />
          <div className="art-orbit orbit-two" />
          <div className="art-dot dot-one" />
          <div className="art-dot dot-two" />
          <div className="quote-back" />
          <div className="hero-quote">
            <span className="quote-category">留一刻，與神親近</span>
            <span className="quote-symbol">“</span>
            <p>{featuredScripture.verse}</p>
            <span className="quote-rule" />
            <span className="quote-reference">
              {featuredScripture.reference}
            </span>
            <span className="quote-leaf">
              <Icon name="leaf" width="54" height="54" />
            </span>
          </div>
          <span className="art-caption">每天一點，讓話語慢慢扎根。</span>
        </div>
      </section>

      {lastCollection && lastScripture && (
        <Link href={`/${lastCollection.id}`} className="continue-reading">
          <span className="continue-icon">
            <Icon name="book" />
          </span>
          <span>
            <span className="continue-label">接續上次的片刻</span>
            <strong>
              {lastCollection.title}
              <span className="continue-divider">／</span>
              {lastScripture.reference}
            </strong>
          </span>
          <span className="continue-cta">
            繼續閱讀
            <Icon name="arrow" />
          </span>
        </Link>
      )}

      <section
        id="collections"
        className="collections-section"
        aria-labelledby="collections-title"
      >
        <div className="section-heading">
          <div>
            <div className="eyebrow">專屬你的經文收藏</div>
            <h2 id="collections-title">選一本，開始今天的默想</h2>
          </div>
          <span className="collection-count">02 個經文卡組</span>
        </div>
        <div className="collection-grid">
          {collections.map((collection, index) => (
            <Link
              href={`/${collection.id}`}
              key={collection.id}
              className={`collection-card ${collection.color}`}
            >
              <div className="collection-art" aria-hidden="true">
                <span className="collection-number">0{index + 1}</span>
                <div className="book-illustration">
                  <span className="book-spine" />
                  <span className="book-overline">勇 士 班 經 文</span>
                  <span className="book-emblem">
                    <Icon
                      name={index === 0 ? "leaf" : "book"}
                      width="38"
                      height="38"
                    />
                  </span>
                  <span className="book-title">{collection.title}</span>
                  <span className="book-subtitle">
                    {index === 0 ? "扎根・成長" : "裝備・帶領"}
                  </span>
                  <span className="book-bottom">經 文 默 想 卡</span>
                </div>
                <span className="art-bottom-line" />
              </div>
              <div className="collection-information">
                <div className="collection-kicker">{collection.subtitle}</div>
                <div className="collection-title-row">
                  <h3>{collection.title}</h3>
                  <span className="verse-count">
                    {collection.scriptures.length} 張經文卡
                  </span>
                </div>
                <p>{collection.description}</p>
                <div className="collection-link">
                  <span>打開經文卡</span>
                  <span className="circle-arrow">
                    <Icon name="arrow" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <InstallBanner />

      <section className="how-to" aria-labelledby="how-to-title">
        <div className="how-to-title">
          <Icon name="leaf" width="24" height="24" />
          <h2 id="how-to-title">用自己的步調，讓話語扎根。</h2>
        </div>
        <div className="how-to-steps">
          <p>
            <span>01</span>
            <strong>靜心閱讀</strong>慢慢讀，專注每一句話。
          </p>
          <p>
            <span>02</span>
            <strong>試著默想</strong>隱藏經文或出處，練習記在心裡。
          </p>
          <p>
            <span>03</span>
            <strong>自由探索</strong>隨機抽卡，也能快速找到熟悉的經節。
          </p>
        </div>
      </section>
      <footer className="site-footer">
        <span>勇士班經文</span>
        <span>讓神的話，陪伴每一天。</span>
      </footer>
    </main>
  );
}
