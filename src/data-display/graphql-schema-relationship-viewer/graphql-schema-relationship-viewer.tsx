import React, { useId, useState, useMemo } from "react";
import styles from "./graphql-schema-relationship-viewer.module.css";

export type GraphQLTypeKind = "OBJECT" | "INTERFACE" | "UNION" | "ENUM" | "INPUT_OBJECT";

export interface GraphQLFieldArgument {
  name: string;
  type: string; // "Int!" or "PaginationInput"
  defaultValue?: string;
}

export interface GraphQLFieldDef {
  name: string; // e.g. "inventoryBatches"
  type: string; // "[InventoryBatch!]!"
  description?: string;
  arguments?: GraphQLFieldArgument[];
  directives?: string[]; // ["@deprecated(reason: 'Use stockUnits')"]
  referencedTypeName?: string; // "InventoryBatch"
}

export interface GraphQLTypeDef {
  name: string; // e.g. "Product"
  kind: GraphQLTypeKind;
  description?: string;
  directives?: string[]; // ["@key(fields: \"id sku\")"]
  fields: GraphQLFieldDef[];
  interfaces?: string[]; // ["Node", "Auditable"]
}

export interface GraphQLSchemaRelationshipViewerProps {
  subgraphName: string; // "inventory-federated-subgraph"
  schemaVersion?: string; // "v2.14.0-federation2"
  types: GraphQLTypeDef[];
  selectedTypeName?: string;
  onSelectType?: (typeDef: GraphQLTypeDef) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const GraphQLSchemaRelationshipViewer: React.FC<GraphQLSchemaRelationshipViewerProps> = ({
  subgraphName,
  schemaVersion = "v2.14.0-federation2",
  types,
  selectedTypeName,
  onSelectType,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTypeName, setActiveTypeName] = useState<string>(
    selectedTypeName ?? (types[0]?.name ?? "")
  );

  const filteredTypes = useMemo(() => {
    if (!searchQuery.trim()) return types;
    const q = searchQuery.toLowerCase();
    return types.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.fields.some((f) => f.name.toLowerCase().includes(q))
    );
  }, [types, searchQuery]);

  const activeType = useMemo(() => {
    return types.find((t) => t.name === activeTypeName) ?? types[0] ?? null;
  }, [types, activeTypeName]);

  const handleTypeClick = (t: GraphQLTypeDef) => {
    setActiveTypeName(t.name);
    onSelectType?.(t);
  };

  const handleNavigateToReferenced = (typeName?: string) => {
    if (!typeName) return;
    const target = types.find((t) => t.name === typeName);
    if (target) {
      setActiveTypeName(target.name);
      onSelectType?.(target);
    }
  };

  return (
    <section
      aria-labelledby={headingId}
      className={`${styles.container} ${className}`}
      data-density={density}
    >
      <header className={styles.header}>
        <div className={styles.headerTitleCol}>
          <div className={styles.subgraphBadgeRow}>
            <span className={styles.subgraphBadge}>GRAPHQL FEDERATED SUBGRAPH</span>
            <span className={styles.schemaVersion}>{schemaVersion}</span>
          </div>
          <h2 id={headingId} className={styles.title}>
            {subgraphName}
          </h2>
        </div>

        <div className={styles.searchBox}>
          <label htmlFor="gql-search-types" className={styles.srOnly}>
            Filter Schema Types or Fields
          </label>
          <input
            id="gql-search-types"
            type="text"
            className={styles.searchInput}
            placeholder="Search schema types & fields..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      <div className={styles.workspace}>
        {/* Type Navigator Sidebar */}
        <aside className={styles.typeSidebar} aria-label="Schema Types Explorer">
          <div className={styles.sidebarHeading}>
            Types ({filteredTypes.length} / {types.length})
          </div>
          <ul className={styles.typeList} role="list">
            {filteredTypes.map((t) => {
              const isActive = activeType?.name === t.name;
              return (
                <li key={t.name}>
                  <button
                    type="button"
                    className={`${styles.typeListBtn} ${isActive ? styles.typeBtnActive : ""}`}
                    onClick={() => handleTypeClick(t)}
                    aria-label={`Select GraphQL type ${t.name} (${t.kind})`}
                  >
                    <span className={styles.typeKindBadge}>{t.kind[0]}</span>
                    <strong className={styles.typeNameText}>{t.name}</strong>
                    <span className={styles.fieldCount}>{t.fields.length}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Active Type Inspector */}
        <div className={styles.mainInspector}>
          {activeType ? (
            <article className={styles.typeArticle}>
              <div className={styles.articleHeader}>
                <div className={styles.typeMetaRow}>
                  <span className={styles.typeKindPill}>{activeType.kind}</span>
                  {activeType.directives?.map((d) => (
                    <span key={d} className={styles.directivePill}>
                      {d}
                    </span>
                  ))}
                </div>
                <h3 className={styles.activeTypeName}>{activeType.name}</h3>
                {activeType.description && (
                  <p className={styles.activeTypeDesc}>{activeType.description}</p>
                )}
                {activeType.interfaces && activeType.interfaces.length > 0 && (
                  <div className={styles.interfacesRow}>
                    <span className={styles.implementsLabel}>implements:</span>
                    {activeType.interfaces.map((iface) => (
                      <span key={iface} className={styles.interfaceBadge}>
                        {iface}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className={styles.fieldsSection}>
                <h4 className={styles.fieldsHeading}>
                  Fields ({activeType.fields.length})
                </h4>
                <div className={styles.tableWrapper}>
                  <table className={styles.fieldsTable} aria-label={`Fields of ${activeType.name}`}>
                    <caption className={styles.srOnly}>
                      GraphQL schema field signatures and directives for {activeType.name}
                    </caption>
                    <thead>
                      <tr>
                        <th scope="col" className={styles.thName}>Field Name</th>
                        <th scope="col" className={styles.thType}>Return Type</th>
                        <th scope="col" className={styles.thDirectives}>Directives</th>
                        <th scope="col" className={styles.thDesc}>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeType.fields.map((f) => {
                        const hasRefType = Boolean(
                          f.referencedTypeName &&
                            types.some((t) => t.name === f.referencedTypeName)
                        );

                        return (
                          <tr key={f.name} className={styles.fieldRow}>
                            <td className={styles.tdName}>
                              <code className={styles.fieldName}>{f.name}</code>
                              {f.arguments && f.arguments.length > 0 && (
                                <span className={styles.argSignature}>
                                  (
                                  {f.arguments
                                    .map((a) => `${a.name}: ${a.type}`)
                                    .join(", ")}
                                  )
                                </span>
                              )}
                            </td>
                            <td className={styles.tdType}>
                              {hasRefType ? (
                                <button
                                  type="button"
                                  className={styles.typeLinkBtn}
                                  onClick={() => handleNavigateToReferenced(f.referencedTypeName)}
                                  aria-label={`Jump to referenced type ${f.referencedTypeName}`}
                                >
                                  {f.type}
                                </button>
                              ) : (
                                <span className={styles.scalarType}>{f.type}</span>
                              )}
                            </td>
                            <td className={styles.tdDirectives}>
                              {f.directives && f.directives.length > 0 ? (
                                f.directives.map((dir) => (
                                  <span
                                    key={dir}
                                    className={`${styles.fieldDirectiveBadge} ${
                                      dir.includes("@deprecated") ? styles.dirDeprecated : ""
                                    }`}
                                  >
                                    {dir}
                                  </span>
                                ))
                              ) : (
                                <span className={styles.noDirective}>—</span>
                              )}
                            </td>
                            <td className={styles.tdDesc}>
                              {f.description ? (
                                <span className={styles.descText}>{f.description}</span>
                              ) : (
                                <span className={styles.noDesc}>—</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </article>
          ) : (
            <div className={styles.noTypeSelected}>
              Select a GraphQL type from the sidebar to inspect field schema relationships.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
