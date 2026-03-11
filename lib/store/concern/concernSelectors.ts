import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "..";
import { PriorityLevel } from "./ConcernTypes";

const selectConcernState = (state: RootState) => state.concerns;

export const selectConcerns = createSelector(
  selectConcernState,
  (state) => state.concerns
);

export const selectConcernLoading = createSelector(
  selectConcernState,
  (state) => state.loading
);

export const selectConcernActionLoading = createSelector(
  selectConcernState,
  (state) => state.actionLoading
);

export const selectUnresolvedConcerns = createSelector(
  selectConcerns,
  (concerns) => concerns.filter((c) => !c.isResolved)
);

export const selectConcernsBySeverity = (severity: PriorityLevel) =>
  createSelector(selectConcerns, (concerns) =>
    concerns.filter((c) => c.severity === severity)
  );