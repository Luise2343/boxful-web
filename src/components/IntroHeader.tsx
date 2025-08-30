"use client";

export default function IntroHeader({
  title,
  subtitleHTML,
}: { title: string; subtitleHTML: string }) {
  return (
    <div className="intro-header">
      <div className="intro-header__title">{title}</div>
      <p
        className="intro-header__subtitle"
        dangerouslySetInnerHTML={{ __html: subtitleHTML }}
      />
    </div>
  );
}
