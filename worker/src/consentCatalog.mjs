import catalog from "../../src/data/consentCatalog.json" with { type: "json" };

export const CONSENT_CATALOG = catalog;

export const getAuthorizationForForm = (formType, version) =>
  catalog.authorizations.find((authorization) =>
    authorization.formType === formType && authorization.version === version
  );
