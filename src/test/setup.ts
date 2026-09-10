import "@testing-library/jest-dom";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

window.__ENV__ = {
  KEYCLOAK_URL: "http://localhost:8080",
  KEYCLOAK_REALM: "adyl-creation",
  KEYCLOAK_CLIENT_ID: "adyl-creation-scalar",
};