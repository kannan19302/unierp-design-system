"use client";

import { type FC } from "react";
import { Avatar } from "../avatar";
import { Presence, type PresenceStatus } from "../presence";
import styles from "./user-chip.module.css";

export interface UserChipProps {
  name: string;
  role?: string;
  avatarSrc?: string;
  status?: PresenceStatus;
  className?: string;
}

export const UserChip: FC<UserChipProps> = ({
  name,
  role,
  avatarSrc,
  status,
  className = "",
}) => {
  return (
    <div className={`${styles.chip} ${className}`.trim()}>
      <div className={styles.avatarWrap}>
        <Avatar src={avatarSrc} name={name} size="sm" />
        {status && (
          <div className={styles.presenceWrap}>
            <Presence status={status} />
          </div>
        )}
      </div>
      <div className={styles.meta}>
        <span className={styles.name}>{name}</span>
        {role && <span className={styles.role}>{role}</span>}
      </div>
    </div>
  );
};
