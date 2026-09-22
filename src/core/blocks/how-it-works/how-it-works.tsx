import styles from "./how-it-works.module.css";

export interface HowItWorksStepItem {
  title: string;
  description: string;
}

export interface HowItWorksBlockProps {
  title?: string;
  steps?: HowItWorksStepItem[];
}

export function HowItWorksBlock({
  title = "How it works in 3 easy steps",
  steps = [
    {
      title: "Sign up",
      description: "Create your account in less than 60 seconds.",
    },
    {
      title: "Connect your data",
      description: "Easily import or sync your existing systems.",
    },
    {
      title: "Start growing",
      description: "Use our powerful tools to scale your business.",
    },
  ],
}: HowItWorksBlockProps) {
  return (
    <section className={styles.section} aria-label={title}>
      <div className={styles.container}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.stepsList}>
          {steps.map((s, i) => (
            <div key={i} className={styles.stepItem}>
              <div className={styles.stepBadge}>
                {i + 1}
              </div>
              <div>
                <h3 className={styles.stepTitle}>{s.title}</h3>
                <p className={styles.stepDesc}>{s.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
