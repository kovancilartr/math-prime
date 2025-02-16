type QueryStoreState = {
  chapterSideBarVisible: boolean;
};

type QueryStoreActions = {
  toggleChapterSideBarVisible: () => void;
};

export type QueryStore = QueryStoreState & QueryStoreActions;
