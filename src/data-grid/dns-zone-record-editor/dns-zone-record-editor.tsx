import React, { useId, useState, useMemo } from "react";
import styles from "./dns-zone-record-editor.module.css";

export type DnsRecordType = "A" | "AAAA" | "CNAME" | "MX" | "TXT" | "SRV" | "CAA" | "NS";

export interface DnsZoneRecord {
  id: string;
  type: DnsRecordType;
  name: string; // e.g. "@", "api", "auth", "mail"
  content: string; // "198.51.100.4", "target.cdn.unierp.io", "v=spf1 include:_spf..."
  ttl: number; // in seconds, 1 = Auto, 300 = 5m, 3600 = 1h, 86400 = 1d
  proxied?: boolean; // Cloudflare-style CDN / DDoS proxying
  priority?: number; // for MX, SRV
  status: "active" | "propagation_pending" | "error";
  comment?: string;
}

export interface DnsZoneRecordEditorProps {
  zoneName: string; // e.g. "unierp.io"
  records: DnsZoneRecord[];
  onAddRecord?: (newRecord: Omit<DnsZoneRecord, "id">) => void;
  onUpdateRecord?: (id: string, updates: Partial<DnsZoneRecord>) => void;
  onDeleteRecord?: (id: string) => void;
  onToggleProxy?: (id: string, proxied: boolean) => void;
  onExportZoneFile?: () => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const DnsZoneRecordEditor: React.FC<DnsZoneRecordEditorProps> = ({
  zoneName,
  records,
  onAddRecord,
  onUpdateRecord: _onUpdateRecord,
  onDeleteRecord,
  onToggleProxy,
  onExportZoneFile,
  density = "compact",
  className = "",
}) => {

  const headingId = useId();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>("ALL");
  const [isAdding, setIsAdding] = useState<boolean>(false);

  // New Record Form State
  const [newType, setNewType] = useState<DnsRecordType>("A");
  const [newName, setNewName] = useState<string>("");
  const [newContent, setNewContent] = useState<string>("");
  const [newTtl, setNewTtl] = useState<number>(1);
  const [newProxied, setNewProxied] = useState<boolean>(true);
  const [newPriority, setNewPriority] = useState<number>(10);

  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      const matchesSearch =
        rec.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType =
        selectedTypeFilter === "ALL" || rec.type === selectedTypeFilter;
      return matchesSearch && matchesType;
    });
  }, [records, searchTerm, selectedTypeFilter]);

  const handleCreateRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newContent) return;

    onAddRecord?.({
      type: newType,
      name: newName,
      content: newContent,
      ttl: newTtl,
      proxied: ["A", "AAAA", "CNAME"].includes(newType) ? newProxied : false,
      priority: ["MX", "SRV"].includes(newType) ? newPriority : undefined,
      status: "propagation_pending",
    });

    setNewName("");
    setNewContent("");
    setIsAdding(false);
  };

  const formatTtl = (ttlSeconds: number) => {
    if (ttlSeconds <= 1) return "Auto";
    if (ttlSeconds < 60) return `${ttlSeconds}s`;
    if (ttlSeconds < 3600) return `${Math.floor(ttlSeconds / 60)}m`;
    if (ttlSeconds < 86400) return `${Math.floor(ttlSeconds / 3600)}h`;
    return `${Math.floor(ttlSeconds / 86400)}d`;
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
            🌐
          </div>
          <div>
            <div className={styles.metaRow}>
              <span className={styles.zoneBadge}>Authoritative Zone</span>
              <span className={styles.recordCount}>
                {records.length} Total Records
              </span>
            </div>
            <h2 id={headingId} className={styles.title}>
              DNS Records: {zoneName}
            </h2>
          </div>
        </div>

        <div className={styles.headerActions}>
          {onExportZoneFile && (
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={onExportZoneFile}
            >
              📥 Export BIND Zone
            </button>
          )}
          {onAddRecord && (
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={() => setIsAdding(!isAdding)}
            >
              {isAdding ? "✕ Cancel" : "+ Add Record"}
            </button>
          )}
        </div>
      </header>

      {/* Inline Add Record Drawer */}
      {isAdding && (
        <form className={styles.addRecordDrawer} onSubmit={handleCreateRecord}>
          <h3 className={styles.drawerTitle}>Create Authoritative DNS Record</h3>
          <div className={styles.formRow}>
            <div className={styles.fieldGroup}>
              <label htmlFor={`type-${headingId}`} className={styles.label}>
                Type
              </label>
              <select
                id={`type-${headingId}`}
                value={newType}
                onChange={(e) => setNewType(e.target.value as DnsRecordType)}
                className={styles.select}
              >
                <option value="A">A (IPv4 Address)</option>
                <option value="AAAA">AAAA (IPv6 Address)</option>
                <option value="CNAME">CNAME (Canonical Alias)</option>
                <option value="MX">MX (Mail Exchanger)</option>
                <option value="TXT">TXT (Text Record)</option>
                <option value="SRV">SRV (Service)</option>
                <option value="CAA">CAA (Cert Authority Auth)</option>
                <option value="NS">NS (Name Server)</option>
              </select>
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor={`name-${headingId}`} className={styles.label}>
                Name (@ or subdomain)
              </label>
              <input
                id={`name-${headingId}`}
                type="text"
                placeholder="e.g. api, @, mail"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.fieldGroupWide}>
              <label htmlFor={`content-${headingId}`} className={styles.label}>
                IPv4 / Canonical Target
              </label>
              <input
                id={`content-${headingId}`}
                type="text"
                placeholder="e.g. 198.51.100.4 or cdn.unierp.io"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor={`ttl-${headingId}`} className={styles.label}>
                TTL
              </label>
              <select
                id={`ttl-${headingId}`}
                value={newTtl}
                onChange={(e) => setNewTtl(parseInt(e.target.value, 10))}
                className={styles.select}
              >
                <option value={1}>Auto (Recommended)</option>
                <option value={120}>2 mins</option>
                <option value={300}>5 mins</option>
                <option value={3600}>1 hour</option>
                <option value={86400}>1 day</option>
              </select>
            </div>

            {["MX", "SRV"].includes(newType) && (
              <div className={styles.fieldGroup}>
                <label htmlFor={`priority-${headingId}`} className={styles.label}>
                  Priority
                </label>
                <input
                  id={`priority-${headingId}`}
                  type="number"
                  min="0"
                  max="65535"
                  value={newPriority}
                  onChange={(e) => setNewPriority(parseInt(e.target.value, 10) || 0)}
                  className={styles.input}
                />
              </div>
            )}

            {["A", "AAAA", "CNAME"].includes(newType) && (
              <div className={styles.checkboxGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={newProxied}
                    onChange={(e) => setNewProxied(e.target.checked)}
                  />

                  <span>Proxy Traffic (DDoS + CDN)</span>
                </label>
              </div>
            )}

            <div className={styles.submitBtnGroup}>
              <button type="submit" className={styles.saveBtn}>
                Save Record
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Filter Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <label htmlFor={`search-${headingId}`} className={styles.srOnly}>
            Search DNS records
          </label>
          <input
            id={`search-${headingId}`}
            type="text"
            placeholder="Search by name or target IP..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.typeFilterButtons}>
          {["ALL", "A", "AAAA", "CNAME", "MX", "TXT"].map((t) => (
            <button
              key={t}
              type="button"
              className={`${styles.filterBtn} ${
                selectedTypeFilter === t ? styles.activeFilter : ""
              }`}
              onClick={() => setSelectedTypeFilter(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* DNS Records Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <caption className={styles.srOnly}>
            Authoritative DNS zone records for {zoneName}
          </caption>
          <thead>
            <tr>
              <th scope="col" className={styles.thType}>Type</th>
              <th scope="col">Name</th>
              <th scope="col">Content / Target</th>
              <th scope="col">Proxy Status</th>
              <th scope="col">TTL</th>
              <th scope="col" className={styles.thAction}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={6} className={styles.emptyCell}>
                  No DNS records match the specified query.
                </td>
              </tr>
            ) : (
              filteredRecords.map((rec) => (
                <tr key={rec.id} className={styles.tableRow}>
                  <td>
                    <span
                      className={`${styles.typeBadge} ${
                        styles[`type_${rec.type}`] || styles.typeDefault
                      }`}
                    >
                      {rec.type}
                    </span>
                  </td>
                  <td className={styles.nameCell}>
                    <strong>{rec.name}</strong>
                    {rec.name === "@" ? ` (${zoneName})` : `.${zoneName}`}
                  </td>
                  <td className={styles.contentCell}>
                    <code>{rec.content}</code>
                    {rec.priority !== undefined && (
                      <span className={styles.priorityTag}>
                        Priority: {rec.priority}
                      </span>
                    )}
                  </td>
                  <td>
                    {["A", "AAAA", "CNAME"].includes(rec.type) ? (
                      <button
                        type="button"
                        className={`${styles.proxyToggleBtn} ${
                          rec.proxied ? styles.proxiedActive : styles.dnsOnly
                        }`}
                        onClick={() => onToggleProxy?.(rec.id, !rec.proxied)}
                        title={
                          rec.proxied
                            ? "Proxied through UniERP CDN & WAF"
                            : "DNS only (Traffic goes directly to server)"
                        }
                      >
                        <span aria-hidden="true">{rec.proxied ? "☁️" : "☁️"}</span>
                        <span>{rec.proxied ? "Proxied" : "DNS Only"}</span>
                      </button>
                    ) : (
                      <span className={styles.notApplicable}>DNS Only</span>
                    )}
                  </td>
                  <td>{formatTtl(rec.ttl)}</td>
                  <td className={styles.actionCell}>
                    {onDeleteRecord && (
                      <button
                        type="button"
                        className={styles.deleteBtn}
                        onClick={() => onDeleteRecord(rec.id)}
                        aria-label={`Delete ${rec.type} record for ${rec.name}`}
                      >
                        🗑️
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};
