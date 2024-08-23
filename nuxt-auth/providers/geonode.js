"use strict";

export default function GeoNode(options) {
  return {
    id: "keycloak",
    name: "Keycloak",
    wellKnown: `${options.issuer}/.well-known/openid-configuration`,
    type: "oauth",
    authorization: {
      params: {
        scope: "openid email profile"
      }
    },
    checks: ["pkce", "state"],
    idToken: true,

    profile(profile) {
      let _profile$name;

      return {
        id: profile.sub,
        name: (_profile$name = profile.name) !== null && _profile$name !== void 0 ? _profile$name : profile.preferred_username,
        email: profile.email,
        image: profile.picture
      };
    },

    style: {
      logo: "/keycloak.svg",
      bg: "#fff",
      text: "#000"
    },
    options
  };
}