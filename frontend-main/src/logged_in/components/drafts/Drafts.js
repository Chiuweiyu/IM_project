import React, { useState, useCallback, useEffect } from "react";
import DraftBox from "./DraftBox";
import DraftCreation from "./DraftCreation";

const DAY_TO_MIN = 24*60;
const HOUR_TO_MIN = 60;

function Drafts(props) {
  const {DateTimePicker, pushMessageToSnackbar, selectDraftBox} = props;
  const [isDraftPaperOpen, setIsDraftPaperOpen] = useState(false);
  const [updatedDraft, setUpdatedDraft] = useState(null);

  useEffect(() => {
    selectDraftBox();
  }, [selectDraftBox]);

  const openDraftModal = useCallback(() => {
    setIsDraftPaperOpen(true);
  }, [setIsDraftPaperOpen]);

  const closeDraftModal = useCallback(() => {
    setIsDraftPaperOpen(false);
    setUpdatedDraft(null);
  }, [setIsDraftPaperOpen]);

  const openUpdateDraftModal = useCallback((draft) => {
    setIsDraftPaperOpen(true);
    setUpdatedDraft(draft);
  }, 
  [setIsDraftPaperOpen, setUpdatedDraft]);

  if (isDraftPaperOpen) {
    return <DraftCreation
      onClose={closeDraftModal}
      DateTimePicker={DateTimePicker}
      pushMessageToSnackbar={pushMessageToSnackbar}
      updatedDraft={updatedDraft}
      DAY_TO_MIN={DAY_TO_MIN}
      HOUR_TO_MIN={HOUR_TO_MIN}
    />
  }
  else{
    return <DraftBox
      openUpdateDraftModal={openUpdateDraftModal}
      openDraftModal={openDraftModal}
      pushMessageToSnackbar={pushMessageToSnackbar}
    />
  }
}

export default Drafts;
