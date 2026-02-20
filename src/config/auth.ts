import type { Secret, SignOptions } from "jsonwebtoken";

export const authConfig: {
  jwt: {
    secret: Secret;
    expiresIn: SignOptions["expiresIn"];
  };
} = {
  jwt: {
    secret: (process.env.JWT_SECRET ?? "fallback_dev_secret_change_me") as Secret,
    expiresIn: (process.env.JWT_EXPIRES_IN ?? "1d") as SignOptions["expiresIn"],
  },
};
