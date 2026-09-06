import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import React from "react";
import {
  GraphQLSchemaRelationshipViewer,
  GraphQLTypeDef,
} from "./graphql-schema-relationship-viewer";

const sampleTypes: GraphQLTypeDef[] = [
  {
    name: "Product",
    kind: "OBJECT",
    description: "Core product catalogue entity",
    fields: [
      {
        name: "id",
        type: "ID!",
      },
      {
        name: "inventoryBatches",
        type: "[InventoryBatch!]!",
        referencedTypeName: "InventoryBatch",
      },
    ],
  },
  {
    name: "InventoryBatch",
    kind: "OBJECT",
    description: "Physical lot tracked",
    fields: [
      {
        name: "batchId",
        type: "ID!",
      },
    ],
  },
];

describe("GraphQLSchemaRelationshipViewer", () => {
  it("renders subgraph title, type list, and active type fields", () => {
    render(
      <GraphQLSchemaRelationshipViewer
        subgraphName="inventory-federated-subgraph"
        types={sampleTypes}
      />
    );

    expect(screen.getByText("inventory-federated-subgraph")).toBeDefined();
    expect(screen.getByText("Core product catalogue entity")).toBeDefined();
    expect(screen.getByText("inventoryBatches")).toBeDefined();
    expect(screen.getByRole("button", { name: /Select GraphQL type InventoryBatch/i })).toBeDefined();
  });

  it("navigates to referenced type when return type button is clicked", () => {
    const handleSelect = vi.fn();

    render(
      <GraphQLSchemaRelationshipViewer
        subgraphName="inventory-federated-subgraph"
        types={sampleTypes}
        onSelectType={handleSelect}
      />
    );

    const refBtn = screen.getByRole("button", {
      name: /Jump to referenced type InventoryBatch/i,
    });
    fireEvent.click(refBtn);

    expect(handleSelect).toHaveBeenCalledWith(sampleTypes[1]);
    expect(screen.getByText("batchId")).toBeDefined();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <GraphQLSchemaRelationshipViewer
        subgraphName="inventory-federated-subgraph"
        types={sampleTypes}
      />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
