import { Gender as PrismaGender } from "@/generated/prisma_client";

/**
 * Gender type used throughout the application.
 * Based on the Prisma enum in the schema.
 */
export type Gender = PrismaGender;

/**
 * List of valid gender values, derived from the Prisma enum.
 */
export const GENDER_VALUES: Gender[] = Object.values(PrismaGender);

/**
 * Runtime validator for gender values.
 * Returns true if the input is a valid Gender.
 */
export const isValidGender = (value: unknown): value is Gender => {
  return typeof value === "string" && GENDER_VALUES.includes(value as Gender);
};
