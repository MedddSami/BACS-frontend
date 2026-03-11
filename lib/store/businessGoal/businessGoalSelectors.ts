import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "..";
import { BusinessGoalStatus } from "./businessGoalTypes";

const selectBusinessGoalState = (state: RootState) =>
  state.businessGoals;

export const selectBusinessGoals = createSelector(
  selectBusinessGoalState,
  (state) => state.goals
);

export const selectBusinessGoalLoading = createSelector(
  selectBusinessGoalState,
  (state) => state.loading
);

export const selectBusinessGoalActionLoading = createSelector(
  selectBusinessGoalState,
  (state) => state.actionLoading
);

export const selectBusinessGoalError = createSelector(
  selectBusinessGoalState,
  (state) => state.error
);

export const selectBusinessGoalPage = createSelector(
  selectBusinessGoalState,
  (state) => state.page
);

export const selectSelectedBusinessGoal = createSelector(
  selectBusinessGoalState,
  (state) => state.selectedGoal
);


// PAGINATION HELPERS 
export const selectTotalElements = createSelector(
  selectBusinessGoalPage,
  (page) => page?.totalElements ?? 0
);

export const selectTotalPages = createSelector(
  selectBusinessGoalPage,
  (page) => page?.totalPages ?? 0
);

export const selectCurrentPage = createSelector(
  selectBusinessGoalPage,
  (page) => page?.number ?? 0
);



export const selectGoalById = (id: number) =>
  createSelector(selectBusinessGoals, (goals) =>
    goals.find((g) => g.id === id)
  );

export const selectGoalsByStatus = (status: BusinessGoalStatus) =>
  createSelector(selectBusinessGoals, (goals) =>
    goals.filter((g) => g.status === status)
  );

export const selectCompletedGoals = createSelector(
  selectBusinessGoals,
  (goals) =>
    goals.filter((g) => g.status === BusinessGoalStatus.COMPLETED)
);

export const selectActiveGoals = createSelector(
  selectBusinessGoals,
  (goals) =>
    goals.filter(
      (g) =>
        g.status !== BusinessGoalStatus.COMPLETED &&
        g.status !== BusinessGoalStatus.CANCELLED
    )
);


export const selectOverdueGoalsDerived = createSelector(
  selectBusinessGoals,
  (goals) => {
    const today = new Date();

    return goals.filter((goal) => {
      if (!goal.deadline) return false;
      return (
        new Date(goal.deadline) < today &&
        goal.status !== BusinessGoalStatus.COMPLETED
      );
    });
  }
);

export const selectGoalsGroupedByStatus = createSelector(
  selectBusinessGoals,
  (goals) => {
    return goals.reduce<Record<string, typeof goals>>((acc, goal) => {
      if (!acc[goal.status]) {
        acc[goal.status] = [];
      }
      acc[goal.status].push(goal);
      return acc;
    }, {});
  }
);

// COUNTS

export const selectGoalsCount = createSelector(
  selectBusinessGoals,
  (goals) => goals.length
);

export const selectCompletedGoalsCount = createSelector(
  selectCompletedGoals,
  (goals) => goals.length
);

export const selectActiveGoalsCount = createSelector(
  selectActiveGoals,
  (goals) => goals.length
);