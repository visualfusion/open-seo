import { z } from "zod";
import { getTranslation } from "@/client/lib/i18n";
import {
  HOSTED_PASSWORD_MAX_LENGTH,
  HOSTED_PASSWORD_MIN_LENGTH,
} from "@/lib/auth-options";

export const passwordSchema = z
  .string()
  .min(HOSTED_PASSWORD_MIN_LENGTH, {
    error: () =>
      getTranslation("auth.password_rules.min_length", undefined, {
        min: HOSTED_PASSWORD_MIN_LENGTH,
      }),
  })
  .max(HOSTED_PASSWORD_MAX_LENGTH, {
    error: () =>
      getTranslation("auth.password_rules.max_length", undefined, {
        max: HOSTED_PASSWORD_MAX_LENGTH,
      }),
  });
