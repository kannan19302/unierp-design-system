import React, { useId, useState } from "react";
import styles from "./rest-api-client-workbench.module.css";

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface KeyValueParam {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

export interface ApiResponseData {
  status: number;
  statusText: string;
  timeMs: number;
  sizeBytes: number;
  body: string;
  headers: Record<string, string>;
}

export interface RestApiClientWorkbenchProps {
  initialMethod?: HttpMethod;
  initialUrl?: string;
  initialHeaders?: KeyValueParam[];
  initialParams?: KeyValueParam[];
  initialBody?: string;
  initialResponse?: ApiResponseData;
  onSendRequest?: (request: {
    method: HttpMethod;
    url: string;
    headers: Record<string, string>;
    body: string;
  }) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const RestApiClientWorkbench: React.FC<RestApiClientWorkbenchProps> = ({
  initialMethod = "POST",
  initialUrl = "https://api.enterprise.unierp.com/v1/ledger/journal-entries",
  initialHeaders = [
    { id: "h1", key: "Authorization", value: "Bearer eyJhbGciOi...", enabled: true },
    { id: "h2", key: "Content-Type", value: "application/json", enabled: true },
    { id: "h3", key: "X-Tenant-Id", value: "tenant_corp_091", enabled: true },
  ],
  initialParams = [
    { id: "p1", key: "fiscalYear", value: "2026", enabled: true },
    { id: "p2", key: "includeAudits", value: "true", enabled: false },
  ],
  initialBody = JSON.stringify(
    {
      batchId: "batch_2026_09_close",
      entriesCount: 142,
      currency: "USD",
      autoPost: true,
    },
    null,
    2
  ),
  initialResponse = {
    status: 200,
    statusText: "OK",
    timeMs: 42,
    sizeBytes: 1248,
    body: JSON.stringify(
      {
        transactionId: "txn_89410941",
        status: "COMMITTED",
        reconciled: true,
        postedAt: "2026-09-06T05:20:00Z",
        affectedAccounts: ["1010-CASH", "4010-REVENUE"],
      },
      null,
      2
    ),
    headers: {
      "content-type": "application/json; charset=utf-8",
      "x-request-id": "req_88192a7",
      "x-ratelimit-remaining": "4980",
    },
  },
  onSendRequest,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();
  const urlInputId = useId();

  const [method, setMethod] = useState<HttpMethod>(initialMethod);
  const [url, setUrl] = useState<string>(initialUrl);
  const [activeTab, setActiveTab] = useState<"params" | "headers" | "body">("body");
  const [headers, setHeaders] = useState<KeyValueParam[]>(initialHeaders);
  const [params, setParams] = useState<KeyValueParam[]>(initialParams);
  const [bodyText, setBodyText] = useState<string>(initialBody);
  const [response, setResponse] = useState<ApiResponseData | null>(initialResponse);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSend = () => {
    setIsLoading(true);
    const activeHeadersObj: Record<string, string> = {};
    headers.forEach((h) => {
      if (h.enabled && h.key) activeHeadersObj[h.key] = h.value;
    });

    onSendRequest?.({
      method,
      url,
      headers: activeHeadersObj,
      body: bodyText,
    });

    setTimeout(() => {
      setIsLoading(false);
      setResponse(initialResponse);
    }, 150);
  };

  const getStatusColorClass = (code: number) => {
    if (code >= 200 && code < 300) return styles.status2xx;
    if (code >= 400 && code < 500) return styles.status4xx;
    if (code >= 500) return styles.status5xx;
    return styles.statusOther;
  };

  return (
    <section
      aria-labelledby={headingId}
      className={`${styles.container} ${className}`}
      data-density={density}
    >
      <header className={styles.header}>
        <div className={styles.topRow}>
          <div className={styles.badgeGroup}>
            <span className={styles.workbenchBadge}>API DEVELOPER WORKBENCH</span>
            <span className={styles.envBadge}>PRODUCTION GATEWAY</span>
          </div>
          <span className={styles.docLink}>OpenAPI 3.1 Contract</span>
        </div>

        <h2 id={headingId} className={styles.title}>
          REST API Client &amp; Payload Dispatch Console
        </h2>

        {/* Request Address Bar */}
        <div className={styles.addressBar}>
          <label htmlFor={`${urlInputId}-method`} className={styles.srOnly}>
            HTTP Method
          </label>
          <select
            id={`${urlInputId}-method`}
            className={`${styles.methodSelect} ${styles[`method_${method}`]}`}
            value={method}
            onChange={(e) => setMethod(e.target.value as HttpMethod)}
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
            <option value="PATCH">PATCH</option>
          </select>

          <label htmlFor={urlInputId} className={styles.srOnly}>
            Request Endpoint URL
          </label>
          <input
            id={urlInputId}
            type="text"
            className={styles.urlInput}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://api.enterprise.com/v1/resource"
          />

          <button
            type="button"
            className={styles.sendButton}
            onClick={handleSend}
            disabled={isLoading}
            aria-label="Send HTTP request"
          >
            {isLoading ? "Sending..." : "Send Request"}
          </button>
        </div>
      </header>

      {/* Main Dual-Pane Section */}
      <div className={styles.panesWrapper}>
        {/* Request Pane */}
        <div className={styles.requestPane}>
          <div className={styles.tabNav} role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "params"}
              className={`${styles.tabBtn} ${activeTab === "params" ? styles.tabActive : ""}`}
              onClick={() => setActiveTab("params")}
            >
              Params ({params.filter((p) => p.enabled).length})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "headers"}
              className={`${styles.tabBtn} ${activeTab === "headers" ? styles.tabActive : ""}`}
              onClick={() => setActiveTab("headers")}
            >
              Headers ({headers.filter((h) => h.enabled).length})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "body"}
              className={`${styles.tabBtn} ${activeTab === "body" ? styles.tabActive : ""}`}
              onClick={() => setActiveTab("body")}
            >
              Body (JSON)
            </button>
          </div>

          <div className={styles.tabContent}>
            {activeTab === "body" && (
              <div className={styles.bodyEditorContainer}>
                <label htmlFor={`${urlInputId}-body-editor`} className={styles.srOnly}>
                  JSON Request Body
                </label>
                <textarea
                  id={`${urlInputId}-body-editor`}
                  className={styles.bodyTextarea}
                  value={bodyText}
                  onChange={(e) => setBodyText(e.target.value)}
                  spellCheck={false}
                />
              </div>
            )}

            {activeTab === "headers" && (
              <div className={styles.kvTableWrapper}>
                <table className={styles.kvTable} aria-label="Request HTTP Headers">
                  <thead>
                    <tr>
                      <th scope="col">Enabled</th>
                      <th scope="col">Header Key</th>
                      <th scope="col">Header Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {headers.map((h, i) => (
                      <tr key={h.id}>
                        <td>
                          <input
                            type="checkbox"
                            checked={h.enabled}
                            aria-label={`Enable header ${h.key || i + 1}`}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setHeaders((prev) =>
                                prev.map((item) =>
                                  item.id === h.id ? { ...item, enabled: checked } : item
                                )
                              );
                            }}
                          />
                        </td>
                        <td className={styles.monoCell}>{h.key}</td>
                        <td className={styles.monoCell}>{h.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "params" && (
              <div className={styles.kvTableWrapper}>
                <table className={styles.kvTable} aria-label="Request Query Parameters">
                  <thead>
                    <tr>
                      <th scope="col">Enabled</th>
                      <th scope="col">Query Parameter</th>
                      <th scope="col">Parameter Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {params.map((p, i) => (
                      <tr key={p.id}>
                        <td>
                          <input
                            type="checkbox"
                            checked={p.enabled}
                            aria-label={`Enable parameter ${p.key || i + 1}`}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setParams((prev) =>
                                prev.map((item) =>
                                  item.id === p.id ? { ...item, enabled: checked } : item
                                )
                              );
                            }}
                          />
                        </td>
                        <td className={styles.monoCell}>{p.key}</td>
                        <td className={styles.monoCell}>{p.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Response Pane */}
        <div className={styles.responsePane}>
          <div className={styles.responseHeader}>
            <span className={styles.responseLabel}>Response</span>
            {response && (
              <div className={styles.metaPills}>
                <span className={`${styles.statusPill} ${getStatusColorClass(response.status)}`}>
                  {response.status} {response.statusText}
                </span>
                <span className={styles.timePill}>⏱ {response.timeMs} ms</span>
                <span className={styles.sizePill}>📦 {response.sizeBytes} B</span>
              </div>
            )}
          </div>

          <div className={styles.responseViewer}>
            {response ? (
              <pre className={styles.responseCode} aria-label="HTTP response body">
                <code>{response.body}</code>
              </pre>
            ) : (
              <div className={styles.emptyResponse}>Click "Send Request" to inspect response payload.</div>
            )}
          </div>
        </div>
      </div>

      <footer className={styles.footer}>
        <span className={styles.footerText}>
          Enforces TLS 1.3 encryption &amp; RFC 9110 HTTP semantics. All mutating requests dispatched with idempotency keys.
        </span>
      </footer>
    </section>
  );
};
