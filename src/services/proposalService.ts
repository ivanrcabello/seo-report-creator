
import { v4 as uuidv4 } from "uuid";

// Re-export everything from the individual files
export * from "./proposal/proposalCrud";
export * from "./proposal/proposalStatus";
export * from "./proposal/proposalReports";
export * from "./proposal/proposalCreation";
export * from "./proposal/proposalMappers";

// Import generatePublicProposalUrl to maintain compatibility with existing code
import { generatePublicProposalUrl } from "./reportSharingService";
export { generatePublicProposalUrl };
