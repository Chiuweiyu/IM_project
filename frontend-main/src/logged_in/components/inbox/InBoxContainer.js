import React, { useState, useCallback, useEffect } from "react";
import {
  TablePagination,
  Divider,
  Toolbar,
  Typography,
  Paper,
  withStyles,
} from "@material-ui/core";

import ConfirmationDialog from "../../../shared/components/ConfirmationDialog";
import InboxContent from "./InboxContent";
import { deleteDraft } from "../mails_api";

const styles = (theme) => ({
  dBlock: { display: "block" },
  dNone: { display: "none" },
  toolbar: {
    justifyContent: "space-between",
  },
  button:{
    borderRadius: 20
  }
});



function InboxContainer(props) {
  const { 
    pushMessageToSnackbar,
    openMailModal,
    classes,
    selectInbox,
  } = props;
  const [page, setPage] = useState(0);
  const [mails, setMails] = useState([]);
  const [deletedMail, setDeletedMail] = useState(null);
  const rowsPerPage = 25;
  const [isDeleteMailDialogOpen, setIsDeleteMailDialogOpen] = useState(false);
  const [isDeleteMailDialogLoading, setIsDeleteMailDialogLoading] = useState(false);    

  useEffect(() => {
    selectInbox();
  }, [selectInbox]);

  const onDelete = (mail) => {
    setDeletedMail(mail);
    console.log("ondelete... : ", deletedMail);
      setIsDeleteMailDialogOpen(true);
    };

  const closeDeleteMailDialog = useCallback(() => {
  setIsDeleteMailDialogOpen(false);
  setIsDeleteMailDialogLoading(false);
  }, [setIsDeleteMailDialogOpen, setIsDeleteMailDialogLoading]);


  const handleDeleteMail = useCallback(() => {
    console.log("handling deletedMail... draft_id: ", deletedMail.id);
    setIsDeleteMailDialogLoading(true);
    deleteDraft(deletedMail.id).then(response =>{
      pushMessageToSnackbar({
        text: response,
      });
      closeDeleteMailDialog();
    });
  }, [
    setIsDeleteMailDialogLoading,
    pushMessageToSnackbar,
    closeDeleteMailDialog,
    deletedMail
  ]);


  const handleChangePage = useCallback(
    (__, page) => {
      setPage(page);
    },
    [setPage]
  );

  const handleMailChange = (_mails)=>{
    setMails(_mails);
  };

  return (
    <Paper>
      <Toolbar className={classes.toolbar}>
        <Typography
          color="primary"
          variant="h5" 
          style={{fontWeight: 700, fontFamily: 'Noto Sans TC'}}>
          收信區
        </Typography>
      </Toolbar>
      <Divider />
        <InboxContent 
          openMailModal={openMailModal}
          page={page}
          rowsPerPage={rowsPerPage}
          handleMailChange={handleMailChange}
          mails={mails}
          onDelete={onDelete}
        />
      <TablePagination
        component="div"
        count={mails.length}
        rowsPerPage={rowsPerPage}
        page={page}
        backIconButtonProps={{
          "aria-label": "Previous Page",
        }}
        nextIconButtonProps={{
          "aria-label": "Next Page",
        }}
        onChangePage={handleChangePage}
        classes={{
          select: classes.dNone,
          selectIcon: classes.dNone,
          actions: mails.length > 0 ? classes.dBlock : classes.dNone,
          caption: mails.length > 0 ? classes.dBlock : classes.dNone,
        }}
        labelRowsPerPage=""
      />
      <ConfirmationDialog
        open={isDeleteMailDialogOpen}
        title="刪除信件"
        content="確定要刪除本信嗎? 建議您可先下載本信保存再進行刪除。"
        onClose={closeDeleteMailDialog}
        loading={isDeleteMailDialogLoading}
        onConfirm={handleDeleteMail}
      />
    </Paper>
  );
}

export default withStyles(styles)(InboxContainer);
