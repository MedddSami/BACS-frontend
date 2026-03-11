import { RootState } from "..";

export const selectSuggestions = (state: RootState) =>
    state.suggestions.suggestions;

export const selectSuggestionLoading = (state: RootState) =>
    state.suggestions.loading;

export const selectSuggestionActionLoading = (state: RootState) =>
    state.suggestions.actionLoading;

export const selectSuggestionPageData = (state: RootState) =>
    state.suggestions.pageData;

export const selectPendingSuggestions = (state: RootState) =>
    state.suggestions.suggestions.filter((s) => !s.isImplemented);

export const selectImplementedSuggestions = (state: RootState) =>
    state.suggestions.suggestions.filter((s) => s.isImplemented);