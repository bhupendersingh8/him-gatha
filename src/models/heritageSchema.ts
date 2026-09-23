export const HERITAGE_SCHEMA_VERSION = "1.0.0" as const;

export const RelationTypes = [
  "alliance",
  "lineage",
  "ritual-dependency",
  "jurisdiction-overlap",
] as const;

export const CommunityRoles = ["gur", "kardar", "elder"] as const;
export const ConsentLevels = ["public", "community-only", "embargoed"] as const;
export const PublicationStatuses = ["draft", "published", "withdrawn"] as const;
export const SacredSiteVisibilities = ["public", "generalized", "restricted"] as const;
export const Pakshas = ["shukla", "krishna"] as const;

export type RelationType = (typeof RelationTypes)[number];
export type CommunityRole = (typeof CommunityRoles)[number];
export type ConsentLevel = (typeof ConsentLevels)[number];
export type PublicationStatus = (typeof PublicationStatuses)[number];
export type SacredSiteVisibility = (typeof SacredSiteVisibilities)[number];
export type Paksha = (typeof Pakshas)[number];

export interface CanonicalName {
  devanagari: string;
  roman: string;
  localVariants: string[];
}

export interface CommunityAttestation {
  status: "attested" | "contested" | "unverified";
  attestedBy: string[];
  attestedAt: string;
  notes?: string;
}

export interface DeityRelationship {
  targetDeityId: string;
  relationType: RelationType;
  communityAttestation: CommunityAttestation;
}

export interface OralHistoryReference {
  oralHistoryId: string;
  relationship: "primary-account" | "variant-account" | "ritual-account" | "historical-account";
  visibility: ConsentLevel;
}

export interface GeneralizedLocation {
  visibility: SacredSiteVisibility;
  districtId: string;
  localityLabel?: string;
  latitude?: number;
  longitude?: number;
  precisionMeters: number;
  reasonForObfuscation?: string;
}

export interface LunarRule {
  calendarType: "regional-lunisolar" | "vikram-samvat" | "local-traditional";
  month: string;
  paksha: Paksha;
  tithi: string;
  notes?: string;
}

export interface YatraReference {
  yatraId: string;
  title: string;
  lunarRule: LunarRule;
  routeVisibility: SacredSiteVisibility;
  generalizedRoute: GeneralizedLocation[];
}

export interface PublicationControl {
  status: PublicationStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  sourceCitationIds: string[];
  communityReviewRequired: boolean;
  communityReviewedAt?: string;
}

export interface DeityArchiveEntry {
  schemaVersion: typeof HERITAGE_SCHEMA_VERSION;
  canonicalName: CanonicalName;
  districtId: string;
  traditionType: "devta" | "devi" | "kul-devta" | "gram-devta" | "regional-deity";
  relationships: DeityRelationship[];
  oralHistoryRefs: OralHistoryReference[];
  yatraRefs: YatraReference[];
  sacredSite: GeneralizedLocation;
  publication: PublicationControl;
  createdAt: string;
  updatedAt: string;
}

export interface OralHistoryRecord {
  deityId: string;
  narrator: {
    displayName: string;
    communityRole: CommunityRole;
    consentLevel: ConsentLevel;
  };
  language: string;
  dialect: string;
  transcription: string;
  translation?: string;
  recordedAt: string;
  collector: string;
  reviewStatus: "pending" | "community-approved" | "withdrawn";
  publication: {
    status: PublicationStatus;
  };
}
