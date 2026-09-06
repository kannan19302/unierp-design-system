import React, { useId, useState } from "react";
import styles from "./clause-library-browser.module.css";

export type ClauseRiskLevel = "standard" | "low_risk" | "moderate_risk" | "high_risk";

export interface ClauseVariant {
  id: string;
  variantTitle: string; // e.g. "Standard Mutual Indemnification"
  riskLevel: ClauseRiskLevel;
  approvalRequired?: string; // e.g. "General Counsel Sign-Off"
  clauseText: string;
  guidanceNotes: string;
}

export interface ClauseCategory {
  id: string;
  categoryName: string; // e.g. "Indemnification & Defense"
  variants: ClauseVariant[];
}

export interface ClauseLibraryBrowserProps {
  contractContext?: string; // "Master Services Agreement (MSA)"
  categories: ClauseCategory[];
  onInsertClause?: (clause: ClauseVariant) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const ClauseLibraryBrowser: React.FC<ClauseLibraryBrowserProps> = ({
  contractContext = "Master Services Agreement (MSA) v4.2",
  categories,
  onInsertClause,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();
  const [selectedCatId, setSelectedCatId] = useState<string>(categories[0]?.id || "");
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    categories[0]?.variants[0]?.id || ""
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  const activeCategory = categories.find((c) => c.id === selectedCatId) || categories[0];

  const filteredVariants = (activeCategory?.variants || []).filter((v) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      v.variantTitle.toLowerCase().includes(query) ||
      v.clauseText.toLowerCase().includes(query) ||
      v.guidanceNotes.toLowerCase().includes(query)
    );
  });

  const activeVariant =
    filteredVariants.find((v) => v.id === selectedVariantId) || filteredVariants[0];

  const handleCopy = () => {
    if (!activeVariant) return;
    navigator.clipboard?.writeText(activeVariant.clauseText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getRiskBadge = (risk: ClauseRiskLevel) => {
    switch (risk) {
      case "standard":
        return <span className={`${styles.riskBadge} ${styles.riskStandard}`}>✓ STANDARD / PREFERRED</span>;
      case "low_risk":
        return <span className={`${styles.riskBadge} ${styles.riskLow}`}>ℹ️ LOW RISK FALLBACK</span>;
      case "moderate_risk":
        return <span className={`${styles.riskBadge} ${styles.riskModerate}`}>⚠️ MODERATE RISK</span>;
      case "high_risk":
        return <span className={`${styles.riskBadge} ${styles.riskHigh}`}>⛔ HIGH RISK (LEGAL APPROVAL)</span>;
    }
  };

  return (
    <section
      className={`${styles.container} ${styles[density]} ${className}`}
      aria-labelledby={headingId}
      data-density={density}
    >
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <div className={styles.iconTag} aria-hidden="true">
            ⚖️
          </div>
          <div>
            <div className={styles.metaRow}>
              <span className={styles.libTag}>Approved Legal Repository</span>
              <span className={styles.contextBadge}>{contractContext}</span>
            </div>
            <h2 id={headingId} className={styles.title}>
              Enterprise Clause Library Browser
            </h2>
          </div>
        </div>

        {/* Search Bar */}
        <div className={styles.searchWrap}>
          <input
            type="search"
            className={styles.searchInput}
            placeholder="Search clause language, keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search clause library"
          />
        </div>
      </header>

      {/* Main Multi-Pane Layout */}
      <div className={styles.browserGrid}>
        {/* Category Sidebar */}
        <nav className={styles.categoryPane} aria-label="Clause Categories">
          <h3 className={styles.paneTitle}>Legal Categories</h3>
          <ul className={styles.catList}>
            {categories.map((cat) => (
              <li key={cat.id}>
                <button
                  type="button"
                  className={`${styles.catBtn} ${
                    selectedCatId === cat.id ? styles.catBtnActive : ""
                  }`}
                  onClick={() => {
                    setSelectedCatId(cat.id);
                    setSelectedVariantId(cat.variants[0]?.id || "");
                  }}
                >
                  <span className={styles.catName}>{cat.categoryName}</span>
                  <span className={styles.variantCount}>{cat.variants.length}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Variants List Pane */}
        <div className={styles.variantsPane}>
          <h3 className={styles.paneTitle}>Approved Variants</h3>
          <div className={styles.variantCards}>
            {filteredVariants.map((variant) => {
              const isSelected = activeVariant?.id === variant.id;
              return (
                <div
                  key={variant.id}
                  className={`${styles.variantCard} ${isSelected ? styles.cardSelected : ""}`}
                  onClick={() => setSelectedVariantId(variant.id)}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setSelectedVariantId(variant.id);
                    }
                  }}
                  role="button"
                  aria-label={`Select ${variant.variantTitle}`}
                >
                  <div className={styles.cardTop}>
                    <h4 className={styles.variantTitle}>{variant.variantTitle}</h4>
                    {getRiskBadge(variant.riskLevel)}
                  </div>
                  <p className={styles.previewSnippet}>
                    {variant.clauseText.slice(0, 110)}...
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Full Clause Detail & Action Pane */}
        <div className={styles.detailPane}>
          {activeVariant ? (
            <div className={styles.clauseDetail}>
              <div className={styles.detailHeader}>
                <div>
                  <h3 className={styles.detailTitle}>{activeVariant.variantTitle}</h3>
                  <div className={styles.detailMeta}>
                    {getRiskBadge(activeVariant.riskLevel)}
                    {activeVariant.approvalRequired && (
                      <span className={styles.approvalReqBadge}>
                        Requires: {activeVariant.approvalRequired}
                      </span>
                    )}
                  </div>
                </div>

                <div className={styles.clauseActions}>
                  <button
                    type="button"
                    className={styles.copyBtn}
                    onClick={handleCopy}
                  >
                    {copied ? "✓ Copied" : "Copy Text"}
                  </button>
                  <button
                    type="button"
                    className={styles.insertBtn}
                    onClick={() => onInsertClause?.(activeVariant)}
                  >
                    Insert into Contract
                  </button>
                </div>
              </div>

              {/* Legal Text Area */}
              <div className={styles.clauseTextCard}>
                <h4 className={styles.sectionHeading}>Clause Language:</h4>
                <p className={styles.clauseBodyText}>{activeVariant.clauseText}</p>
              </div>

              {/* Guidance Notes */}
              <div className={styles.guidanceCard}>
                <h4 className={styles.sectionHeading}>Negotiation Guidance &amp; Playbook:</h4>
                <p className={styles.guidanceText}>{activeVariant.guidanceNotes}</p>
              </div>
            </div>
          ) : (
            <div className={styles.emptyDetail}>
              <p>No clause variant selected. Choose a category and variant on the left.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
