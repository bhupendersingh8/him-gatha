export const deityArchiveJsonSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://himgatha.org/schema/deity-archive-entry.json",
  title: "Himgatha Deity Archive Entry",
  type: "object",
  additionalProperties: false,
  required: [
    "schemaVersion",
    "canonicalName",
    "districtId",
    "traditionType",
    "relationships",
    "oralHistoryRefs",
    "yatraRefs",
    "sacredSite",
    "publication",
    "createdAt",
    "updatedAt",
  ],
  properties: {
    schemaVersion: { const: "1.0.0" },
    districtId: { type: "string", minLength: 1, maxLength: 80 },
    traditionType: {
      enum: ["devta", "devi", "kul-devta", "gram-devta", "regional-deity"],
    },
    canonicalName: {
      type: "object",
      additionalProperties: false,
      required: ["devanagari", "roman", "localVariants"],
      properties: {
        devanagari: { type: "string", minLength: 1, maxLength: 160 },
        roman: { type: "string", minLength: 1, maxLength: 160 },
        localVariants: {
          type: "array",
          maxItems: 30,
          items: { type: "string", minLength: 1, maxLength: 160 },
        },
      },
    },
    relationships: {
      type: "array",
      maxItems: 100,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["targetDeityId", "relationType", "communityAttestation"],
        properties: {
          targetDeityId: { type: "string", minLength: 1, maxLength: 128 },
          relationType: {
            enum: [
              "alliance",
              "lineage",
              "ritual-dependency",
              "jurisdiction-overlap",
            ],
          },
          communityAttestation: {
            type: "object",
            additionalProperties: false,
            required: ["status", "attestedBy", "attestedAt"],
            properties: {
              status: { enum: ["attested", "contested", "unverified"] },
              attestedBy: {
                type: "array",
                maxItems: 30,
                items: { type: "string", minLength: 1, maxLength: 160 },
              },
              attestedAt: { type: "string", format: "date-time" },
              notes: { type: "string", maxLength: 2000 },
            },
          },
        },
      },
    },
    oralHistoryRefs: {
      type: "array",
      maxItems: 100,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["oralHistoryId", "relationship", "visibility"],
        properties: {
          oralHistoryId: { type: "string", minLength: 1, maxLength: 128 },
          relationship: {
            enum: [
              "primary-account",
              "variant-account",
              "ritual-account",
              "historical-account",
            ],
          },
          visibility: { enum: ["public", "community-only", "embargoed"] },
        },
      },
    },
    yatraRefs: {
      type: "array",
      maxItems: 100,
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "yatraId",
          "title",
          "lunarRule",
          "routeVisibility",
          "generalizedRoute",
        ],
        properties: {
          yatraId: { type: "string", minLength: 1, maxLength: 128 },
          title: { type: "string", minLength: 1, maxLength: 160 },
          routeVisibility: { enum: ["public", "generalized", "restricted"] },
          lunarRule: {
            type: "object",
            additionalProperties: false,
            required: ["calendarType", "month", "paksha", "tithi"],
            properties: {
              calendarType: {
                enum: ["regional-lunisolar", "vikram-samvat", "local-traditional"],
              },
              month: { type: "string", minLength: 1, maxLength: 80 },
              paksha: { enum: ["shukla", "krishna"] },
              tithi: { type: "string", minLength: 1, maxLength: 80 },
              notes: { type: "string", maxLength: 1000 },
            },
          },
          generalizedRoute: {
            type: "array",
            maxItems: 100,
            items: { $ref: "#/$defs/generalizedLocation" },
          },
        },
      },
    },
    sacredSite: { $ref: "#/$defs/generalizedLocation" },
    publication: {
      type: "object",
      additionalProperties: false,
      required: ["status", "sourceCitationIds", "communityReviewRequired"],
      properties: {
        status: { enum: ["draft", "published", "withdrawn"] },
        reviewedBy: { type: "string", maxLength: 128 },
        reviewedAt: { type: "string", format: "date-time" },
        sourceCitationIds: {
          type: "array",
          maxItems: 100,
          items: { type: "string", minLength: 1, maxLength: 128 },
        },
        communityReviewRequired: { type: "boolean" },
        communityReviewedAt: { type: "string", format: "date-time" },
      },
    },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
  },
  $defs: {
    generalizedLocation: {
      type: "object",
      additionalProperties: false,
      required: ["visibility", "districtId", "precisionMeters"],
      properties: {
        visibility: { enum: ["public", "generalized", "restricted"] },
        districtId: { type: "string", minLength: 1, maxLength: 80 },
        localityLabel: { type: "string", maxLength: 160 },
        latitude: { type: "number", minimum: 30.2, maximum: 33.2 },
        longitude: { type: "number", minimum: 75.5, maximum: 79.0 },
        precisionMeters: { type: "number", minimum: 100, maximum: 50000 },
        reasonForObfuscation: { type: "string", maxLength: 1000 },
      },
      allOf: [
        {
          if: {
            properties: { visibility: { const: "restricted" } },
            required: ["visibility"],
          },
          then: {
            not: {
              anyOf: [{ required: ["latitude"] }, { required: ["longitude"] }],
            },
          },
        },
      ],
    },
  },
} as const;
