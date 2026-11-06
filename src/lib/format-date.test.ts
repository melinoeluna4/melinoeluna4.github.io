import { describe, expect, it } from "vitest";
import {
  formatDate,
  formatDateRange,
  formatDateShort,
  formatMonthYear,
  toIsoDate,
} from "./format-date";

describe("formatDate", () => {
  it("formats a date in Spanish using UTC", () => {
    expect(formatDate(new Date("2026-10-28T00:00:00Z"))).toBe("28 octubre 2026");
  });

  it("accepts an ISO date string", () => {
    expect(formatDate("2026-09-12")).toBe("12 septiembre 2026");
  });

  it("keeps the UTC day even when the local timezone is behind", () => {
    expect(formatDate(new Date("2026-01-01T00:00:00Z"))).toBe("1 enero 2026");
  });

  it("rejects invalid dates", () => {
    expect(() => formatDate("not-a-date")).toThrow("Invalid date");
  });

  it("formats short and month-year variants", () => {
    expect(formatDateShort("2026-02-03")).toBe("3 feb 2026");
    expect(formatMonthYear("2026-02-03")).toBe("feb 2026");
  });

  it("formats an open and a closed range", () => {
    expect(formatDateRange("2025-09-01", "2026-02-15")).toBe("sep 2025 — feb 2026");
    expect(formatDateRange("2026-03-10")).toBe("mar 2026 — presente");
  });

  it("collapses a range that starts and ends in the same month", () => {
    expect(formatDateRange("2026-11-01", "2026-11-06")).toBe("nov 2026");
  });

  it("serialises a date to an ISO day", () => {
    expect(toIsoDate("2026-10-28T15:30:00Z")).toBe("2026-10-28");
  });
});
