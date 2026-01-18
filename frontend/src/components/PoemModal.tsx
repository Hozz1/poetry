import { useEffect } from "react";
import styles from "./PoemModal.module.css";
import type { Poem } from "../api/poetry";

type Props = {
  poem: Poem | null;
  languageLabel: string;
  onClose: () => void;
};

export default function PoemModal({ poem, languageLabel, onClose }: Props) {
  // Если модалка закрыта — ничего не рендерим
  if (!poem) return null;

  // Закрытие по Esc + блокировка скролла фона
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const onBackdropMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className={styles.backdrop} onMouseDown={onBackdropMouseDown}>
      <div className={styles.modal} role="dialog" aria-modal="true">
        <div className={styles.top}>
          <div className={styles.heading}>
            <div className={styles.title}>{poem.title}</div>
            <div className={styles.meta}>
              <span className={styles.badge}>{languageLabel}</span>
            </div>
          </div>

          <button className={styles.close} onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        {poem.description ? <div className={styles.desc}>{poem.description}</div> : null}

        <div className={styles.body}>
          <pre className={styles.text}>{poem.text}</pre>
        </div>
      </div>
    </div>
  );
}
