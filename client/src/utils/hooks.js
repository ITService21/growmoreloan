import { useEffect, useRef, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

export function useScrollAnimation(threshold = 0.15) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.unobserve(el); } },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isVisible];
}

export function useScrollAnimationMulti() {
  const { pathname } = useLocation();
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }),
      { threshold: 0.08 }
    );
    const timeout = setTimeout(() => {
      document.querySelectorAll('.animate-on-scroll:not(.visible)').forEach(el => observer.observe(el));
    }, 100);
    return () => { clearTimeout(timeout); observer.disconnect(); };
  }, [pathname]);
}

export function useHeaderScroll() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return scrolled;
}

export function useScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
}

export function useFormState(initialFields = {}) {
  const [formData, setFormData] = useState(initialFields);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const reset = useCallback(() => {
    setFormData(initialFields);
    setLoading(false);
    setStatus(null);
  }, []);

  return { formData, setFormData, loading, setLoading, status, setStatus, handleChange, reset };
}

export function useCountUp(end, duration = 2000) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const numericEnd = parseInt(String(end).replace(/[^0-9]/g, ''), 10);
    if (isNaN(numericEnd) || numericEnd === 0) { setCount(0); return; }
    const steps = 60;
    const stepDuration = duration / steps;
    let current = 0;
    const increment = numericEnd / steps;
    const timer = setInterval(() => {
      current += increment;
      if (current >= numericEnd) {
        setCount(numericEnd);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, stepDuration);
    return () => clearInterval(timer);
  }, [started, end, duration]);

  return [ref, count, started];
}
