// types.ts (Company)

export interface CompanyData {
  email: string; // Contact email of the company
  companyLogo: string; // URL of the company logo
  companyName: string; // Name of the company
  companyDescription: string; // Overview or bio of the company
  howWeWork: string; // Description of company culture or workflow
  provider?: string; // OAuth provider if applicable
  userType?: string; // Default to "employer"
}
