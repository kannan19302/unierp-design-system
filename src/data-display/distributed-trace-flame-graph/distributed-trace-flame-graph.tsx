import React, { useId, useState, useMemo } from "react";
import styles from "./distributed-trace-flame-graph.module.css";

export interface TraceSpan {
  id: string;
  parentId?: string;
  serviceName: string;
  operationName: string;
  startTimeMs: number; // relative to trace start (0 to traceDuration)
  durationMs: number;
  statusCode: "ok" | "error" | "unset";
  attributes?: Record<string, string | number | boolean>;
  errorMessage?: string;
  depth?: number;
}

export interface DistributedTraceFlameGraphProps {
  traceId: string;
  rootServiceName: string;
  totalDurationMs: number;
  spans: TraceSpan[];
  selectedSpanId?: string;
  onSelectSpan?: (spanId: string) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const DistributedTraceFlameGraph: React.FC<DistributedTraceFlameGraphProps> = ({
  traceId,
  rootServiceName,
  totalDurationMs,
  spans,
  selectedSpanId: initialSelectedId,
  onSelectSpan,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();
  const [selectedSpanId, setSelectedSpanId] = useState<string | undefined>(
    initialSelectedId ?? (spans.length > 0 ? spans[0]?.id : undefined)
  );

  const selectedSpan = useMemo(() => {
    return spans.find((s) => s.id === selectedSpanId) ?? spans[0];
  }, [spans, selectedSpanId]);

  const errorCount = useMemo(() => {
    return spans.filter((s) => s.statusCode === "error").length;
  }, [spans]);

  const serviceColorClass = (service: string) => {
    const s = service.toLowerCase();
    if (s.includes("gateway") || s.includes("api")) return styles.serviceGateway;
    if (s.includes("auth") || s.includes("idp")) return styles.serviceAuth;
    if (s.includes("postgres") || s.includes("db") || s.includes("sql")) return styles.serviceDb;
    if (s.includes("redis") || s.includes("cache")) return styles.serviceCache;
    if (s.includes("kafka") || s.includes("queue")) return styles.serviceQueue;
    return styles.serviceDefault;
  };

  const ticks = useMemo(() => {
    const count = 5;
    const list: number[] = [];
    for (let i = 0; i <= count; i++) {
      list.push(Math.round((totalDurationMs / count) * i));
    }
    return list;
  }, [totalDurationMs]);

  const handleSpanClick = (spanId: string) => {
    setSelectedSpanId(spanId);
    onSelectSpan?.(spanId);
  };

  return (
    <section
      className={`${styles.container} ${className}`}
      data-density={density}
      aria-labelledby={headingId}
    >
      {/* Header Bar */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.badgeRow}>
            <span className={styles.telemetryBadge}>OpenTelemetry APM</span>
            <span
              className={`${styles.statusBadge} ${
                errorCount > 0 ? styles.statusError : styles.statusSuccess
              }`}
            >
              {errorCount > 0 ? `${errorCount} SPAN ERRORS` : "HTTP 200 OK"}
            </span>
          </div>
          <h2 id={headingId} className={styles.title}>
            Distributed Trace Waterfall: {rootServiceName}
          </h2>
          <div className={styles.traceMeta}>
            <span className={styles.traceIdLabel}>Trace ID:</span>
            <code className={styles.traceIdCode}>{traceId}</code>
          </div>
        </div>

        {/* Aggregate Stats */}
        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Total Latency</span>
            <span className={styles.statValue}>{totalDurationMs} ms</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Total Spans</span>
            <span className={styles.statValue}>{spans.length}</span>
          </div>
        </div>
      </header>

      {/* Main Layout: Flame Waterfall & Span Inspector */}
      <div className={styles.mainLayout}>
        {/* Waterfall Chart Region */}
        <div className={styles.waterfallArea}>
          {/* Time Ruler */}
          <div className={styles.timeRuler} aria-hidden="true">
            <div className={styles.rulerLabelColumn} />
            <div className={styles.rulerTimeline}>
              {ticks.map((tick, idx) => (
                <div
                  key={tick}
                  className={styles.rulerTick}
                  style={{ left: `${(idx / (ticks.length - 1)) * 100}%` }}
                >
                  <span className={styles.tickLabel}>{tick}ms</span>
                </div>
              ))}
            </div>
          </div>

          {/* Span Rows List */}
          <div className={styles.spanList} role="list" aria-label="Distributed Spans List">
            {spans.map((span) => {
              const leftPercent = Math.min(
                100,
                Math.max(0, (span.startTimeMs / totalDurationMs) * 100)
              );
              const rawWidthPercent = (span.durationMs / totalDurationMs) * 100;
              const widthPercent = Math.max(1.5, Math.min(100 - leftPercent, rawWidthPercent));
              const isSelected = selectedSpan?.id === span.id;
              const depthIndent = (span.depth ?? 0) * 12;

              return (
                <div
                  key={span.id}
                  role="listitem"
                  className={`${styles.spanRow} ${isSelected ? styles.spanRowSelected : ""}`}
                >
                  {/* Left Column: Service & Operation Title */}
                  <div
                    className={styles.spanInfoCol}
                    style={{ paddingLeft: `${depthIndent}px` }}
                  >
                    <button
                      type="button"
                      className={styles.spanSelectBtn}
                      onClick={() => handleSpanClick(span.id)}
                      aria-label={`Select span ${span.serviceName} ${span.operationName} (${span.durationMs}ms)`}
                      aria-pressed={isSelected}
                    >
                      <span
                        className={`${styles.serviceChip} ${serviceColorClass(span.serviceName)}`}
                      >
                        {span.serviceName}
                      </span>
                      <span className={styles.operationName} title={span.operationName}>
                        {span.operationName}
                      </span>
                    </button>
                  </div>

                  {/* Right Column: Timeline Flame Bar */}
                  <div className={styles.timelineBarArea}>
                    <div
                      className={`${styles.flameBar} ${
                        span.statusCode === "error"
                          ? styles.flameBarError
                          : styles.flameBarOk
                      }`}
                      style={{
                        left: `${leftPercent}%`,
                        width: `${widthPercent}%`,
                      }}
                      onClick={() => handleSpanClick(span.id)}
                      title={`${span.serviceName}: ${span.operationName} (${span.durationMs}ms)`}
                    >
                      <span className={styles.barDurationText}>
                        {span.durationMs}ms
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Span Detail Inspector Drawer */}
        {selectedSpan && (
          <aside className={styles.inspector} aria-label="Span Inspector">
            <div className={styles.inspectorHeader}>
              <h3 className={styles.inspectorTitle}>Span Telemetry Details</h3>
              <span className={styles.inspectorSpanId}>{selectedSpan.id}</span>
            </div>

            <div className={styles.inspectorSummary}>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Service</span>
                <span className={styles.summaryValue}>{selectedSpan.serviceName}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Operation</span>
                <span className={styles.summaryValue}>{selectedSpan.operationName}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Duration</span>
                <span className={styles.summaryValue}>{selectedSpan.durationMs} ms</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Status</span>
                <span
                  className={
                    selectedSpan.statusCode === "error"
                      ? styles.summaryError
                      : styles.summaryOk
                  }
                >
                  {selectedSpan.statusCode.toUpperCase()}
                </span>
              </div>
            </div>

            {selectedSpan.errorMessage && (
              <div className={styles.errorBox}>
                <strong className={styles.errorTitle}>Span Error Exception:</strong>
                <p className={styles.errorMessage}>{selectedSpan.errorMessage}</p>
              </div>
            )}

            {/* Span Attributes / Tags */}
            <div className={styles.attributesSection}>
              <h4 className={styles.attributesHeader}>Span Attributes</h4>
              {selectedSpan.attributes && Object.keys(selectedSpan.attributes).length > 0 ? (
                <div className={styles.attributesTableWrapper}>
                  <table className={styles.attributesTable}>
                    <thead>
                      <tr>
                        <th scope="col">Key</th>
                        <th scope="col">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(selectedSpan.attributes).map(([key, val]) => (
                        <tr key={key}>
                          <td className={styles.attrKey}>{key}</td>
                          <td className={styles.attrVal}>{String(val)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className={styles.noAttrs}>No semantic tags attached to this span.</p>
              )}
            </div>
          </aside>
        )}
      </div>
    </section>
  );
};
