"use client";

import { type FC, type ReactNode } from "react";
import styles from "./detail-layout.module.css";

export interface DetailLayoutProps {
  header: ReactNode;
  main: ReactNode;
  sidebar?: ReactNode;
  className?: string;
}

export const DetailLayout: FC<DetailLayoutProps> = ({
  header,
  main,
  sidebar,
  className = "",
}) => {
  return (
    <div className={`${styles.layout} ${className}`.trim()}>
      <header className={styles.header}>{header}</header>
      <div className={styles.body}>
        <main className={styles.main}>{main}</main>
        {sidebar && <aside className={styles.sidebar}>{sidebar}</aside>}
      </div>
    </div>
  );
};
