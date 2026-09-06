import type { Meta, StoryObj } from "@storybook/react";
import {
  GraphQLSchemaRelationshipViewer,
  GraphQLTypeDef,
} from "./graphql-schema-relationship-viewer";

const sampleTypes: GraphQLTypeDef[] = [
  {
    name: "Product",
    kind: "OBJECT",
    description: "Core physical or digital SKU in the enterprise product catalogue.",
    directives: ['@key(fields: "id sku")'],
    interfaces: ["Node", "Auditable"],
    fields: [
      {
        name: "id",
        type: "ID!",
        description: "Global entity unique identifier",
      },
      {
        name: "sku",
        type: "String!",
        description: "Universal ERP stock keeping unit identifier",
      },
      {
        name: "title",
        type: "String!",
        description: "Localized product catalog display title",
      },
      {
        name: "inventoryBatches",
        type: "[InventoryBatch!]!",
        description: "Allocated warehouse lots and expiration batches",
        referencedTypeName: "InventoryBatch",
        arguments: [
          {
            name: "warehouseId",
            type: "ID",
          },
        ],
      },
      {
        name: "legacyStockCount",
        type: "Int",
        description: "Unnormalized aggregate quantity across legacy ERP silos",
        directives: ["@deprecated(reason: 'Use inventoryBatches.availableQuantity')"],
      },
    ],
  },
  {
    name: "InventoryBatch",
    kind: "OBJECT",
    description: "Physical lot tracked in automated warehouse fulfillment systems.",
    directives: ['@key(fields: "batchId")'],
    fields: [
      {
        name: "batchId",
        type: "ID!",
        description: "Lot/Batch QR identifier",
      },
      {
        name: "lotNumber",
        type: "String!",
        description: "Manufacturer production lot number",
      },
      {
        name: "availableQuantity",
        type: "Int!",
        description: "Available uncommitted units ready for picking",
      },
      {
        name: "expirationDate",
        type: "String",
        description: "ISO-8601 lot expiry timestamp",
      },
    ],
  },
];

const meta: Meta<typeof GraphQLSchemaRelationshipViewer> = {
  title: "Data Display/GraphQLSchemaRelationshipViewer",
  component: GraphQLSchemaRelationshipViewer,
  parameters: {
    layout: "padded",
  },
  argTypes: {
    density: {
      control: { type: "select" },
      options: ["ultra-compact", "compact", "standard", "comfortable"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof GraphQLSchemaRelationshipViewer>;

export const Default: Story = {
  args: {
    subgraphName: "inventory-federated-subgraph",
    schemaVersion: "v2.14.0-federation2",
    types: sampleTypes,
    density: "compact",
  },
};

export const UltraCompact: Story = {
  args: {
    ...Default.args,
    density: "ultra-compact",
  },
};
