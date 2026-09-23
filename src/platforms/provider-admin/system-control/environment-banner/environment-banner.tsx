"use client";

import styles from "./environment-banner.module.css";

export interface EnvironmentBannerProps {
  environment?: string;
  forceShow?: boolean;
  className?: string;
}

export function EnvironmentBanner({
  environment = "development",
  forceShow = false,
  className = "",
}: EnvironmentBannerProps) {
  const normalizedEnv = environment.toLowerCase();

  // Hide in production unless explicitly forced
  if (normalizedEnv === "production" && !forceShow) {
    return null;
  }

  const label =
    normalizedEnv === "development"
      ? "🛠️ DEV ENVIRONMENT — Local / Non-Production Control Plane"
      : normalizedEnv === "staging"
      ? "⚠️ STAGING ENVIRONMENT — Pre-Production Data Only"
      : normalizedEnv === "test"
      ? "🧪 TEST / CI ENVIRONMENT"
      : `🔴 ${normalizedEnv.toUpperCase()} ENVIRONMENT`;

  const variantClass = styles[normalizedEnv] || styles.development;

  return (
    <div
      className={`${styles.banner} ${variantClass} ${className}`}
      role="status"
      aria-label="Environment Banner"
    >
      <span>{label}</span>
    </div>
  );
}
