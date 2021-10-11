import React, { useState, useCallback, useEffect } from "react";
import InboxContainer from "./InboxContainer";
import Mail from "./Mail";

function Inbox(props) {
  const { selectInbox, pushMessageToSnackbar } = props;
  const [isMailPaperOpen, setIsMailPaperOpen] = useState(false);
  const [mail, setMail] = useState(null);

  useEffect(() => {
    selectInbox();
  }, [selectInbox]);

  const closeMailModal = useCallback(() => {
    setIsMailPaperOpen(false);
    setMail(null);
  }, [setIsMailPaperOpen]);

  const openMailModal = useCallback((mail) => {
    setIsMailPaperOpen(true);
    setMail(mail);
  }, 
  [setIsMailPaperOpen, setMail]);

  if (isMailPaperOpen) {
    return <Mail
      onClose={closeMailModal}
      mail={mail}
    />
  }
  else{
    return <InboxContainer
      openMailModal={openMailModal}
      selectInbox={selectInbox}
      pushMessageToSnackbar={pushMessageToSnackbar}
    />
  }
}

export default Inbox;