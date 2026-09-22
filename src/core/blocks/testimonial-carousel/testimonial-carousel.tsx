"use client";

import React from "react";
import styles from "./testimonial-carousel.module.css";

export interface TestimonialCarouselProps { testimonials: Testimonial[]; }
export interface Testimonial { quote: string; author: string; role: string; company: string; }

export const TestimonialCarousel: React.FC<TestimonialCarouselProps> = (props) => {
  const { testimonials } = props;
  const [current, setCurrent] = React.useState(0);
  const t = testimonials[current];
  return (
    <div className={styles.container} role="region" aria-label="Customer testimonials" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 'var(--text-lg)', fontStyle: 'italic', color: 'var(--color-text-primary)', maxWidth: 500, margin: '0 auto', lineHeight: 1.6 }}>"{t?.quote}"</div>
      <div style={{ marginTop: 'var(--space-4)' }}>
        <div style={{ fontWeight: 'var(--weight-semibold, 600)' }}>{t?.author}</div>
        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{t?.role} at {t?.company}</div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
        {testimonials.map((_, i) => <button key={i} onClick={() => setCurrent(i)} style={{ width: 8, height: 8, borderRadius: '50%', border: 'none', background: i === current ? 'var(--color-brand)' : 'var(--color-border-default)', cursor: 'pointer' }} aria-label={`Testimonial ${i + 1}`} />)}
      </div>
    </div>
  );
};
