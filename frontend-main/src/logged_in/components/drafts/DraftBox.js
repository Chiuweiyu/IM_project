import React, { useState, useCallback } from "react";
import {
  TablePagination,
  Divider,
  Toolbar,
  Typography,
  Button,
  Paper,
  withStyles,
} from "@material-ui/core";


import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

import ConfirmationDialog from "../../../shared/components/ConfirmationDialog";
import DraftBoxContent from "./DraftBoxContent";
import { deleteDraft} from "../mails_api";
import { pending } from "../mails_api";

const styles = () => ({
  dBlock: { display: "block" },
  dNone: { display: "none" },
  toolbar: {
    justifyContent: "space-between",
  },
  button:{
    borderRadius: 20
  }
});

const MIN_TO_MS = 60*1000;

function DraftBox(props) {
  const { 
    pushMessageToSnackbar,
    openUpdateDraftModal,
    openDraftModal,
    classes,
  } = props;
  const [page, setPage] = useState(0);
  const [drafts, setDrafts] = useState([]);
  const [deletedDraft, setDeletedDraft] = useState(null);
  const [draftToPending, setDraftToPending] = useState(null);
  const rowsPerPage = 25;
  const [isDeleteDraftDialogOpen, setIsDeleteDraftDialogOpen] = useState(false);
  const [isDeleteDraftDialogLoading, setIsDeleteDraftDialogLoading] = useState(false);    
  const [isPendingDialogOpen, setIsPendingDialogOpen] = useState(false);
  const [isPendingDialogLoading, setIsPendingDialogLoading] = useState(false);    

  const onDelete = (draft) => {
    setDeletedDraft(draft);
    console.log("ondelete... : ", deletedDraft);
      setIsDeleteDraftDialogOpen(true);
  };

  const onPending = (draft) => {
    setDraftToPending(draft);
    console.log("onPending... : ", draft);
    setIsPendingDialogOpen(true);
  };

  const closeDeleteDraftDialog = useCallback(() => {
    setIsDeleteDraftDialogOpen(false);
    setIsDeleteDraftDialogLoading(false);
  }, [setIsDeleteDraftDialogOpen, setIsDeleteDraftDialogLoading]);
  
  const closePendingDialog = useCallback(() => {
    setIsPendingDialogOpen(false);
    setIsPendingDialogLoading(false);
  }, [setIsPendingDialogOpen, setIsPendingDialogLoading]);

  const handleDeleteDraft = useCallback(() => {
    console.log("handling deletedDraft... draft_id: ", deletedDraft.id);
    setIsDeleteDraftDialogLoading(true);
    deleteDraft(deletedDraft.id).then(response =>{
      pushMessageToSnackbar({
        text: response,
      });
      closeDeleteDraftDialog();
    });
  }, [
    setIsDeleteDraftDialogLoading,
    pushMessageToSnackbar,
    closeDeleteDraftDialog,
    deletedDraft
  ]);

  const handlePendingDraft = useCallback(() => {
    console.log("handling pending... draft_id: ", draftToPending.id);
    setIsPendingDialogLoading(true);
    pending(
      draftToPending.id,
      parseInt(draftToPending.send_veri_interval)*MIN_TO_MS,
      parseInt(draftToPending.max_miss_time),
      parseInt(draftToPending.veri_mail_expiration)*MIN_TO_MS
    ).then(response =>{
      pushMessageToSnackbar({
        text: response,
      });
      closePendingDialog();
    });
  }, [
    setIsPendingDialogLoading,
    pushMessageToSnackbar,
    closePendingDialog,
    draftToPending
  ]);


  const handleChangePage = useCallback(
    (__, page) => {
      setPage(page);
    },
    [setPage]
  );

  const handleDraftsChange = (_drafts)=>{
    setDrafts(_drafts);
  };

  return (
    <Paper>
      <Toolbar className={classes.toolbar}>
        <Typography
          color="primary"
          variant="h5" 
          style={{fontWeight: 700, fontFamily: 'Noto Sans TC'}}>
          草稿區
        </Typography>
          <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={openDraftModal}
          startIcon={<AddCircleOutlineIcon />}
        >
          NEW
        </Button>
      </Toolbar>
      <Divider />
        <DraftBoxContent
          openUpdateDraftModal={openUpdateDraftModal}
          page={page}
          rowsPerPage={rowsPerPage}
          handleDraftsChange={handleDraftsChange}
          drafts={drafts}
          onDelete={onDelete}
          onPending={onPending}
          pushMessageToSnackbar={pushMessageToSnackbar}
        />
      <TablePagination
        component="div"
        count={drafts.length}
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
          actions: drafts.length > 0 ? classes.dBlock : classes.dNone,
          caption: drafts.length > 0 ? classes.dBlock : classes.dNone,
        }}
        labelRowsPerPage=""
      />
      <ConfirmationDialog
        open={isDeleteDraftDialogOpen}
        title="刪除確認"
        content="確定要刪除此草稿嗎？"
        onClose={closeDeleteDraftDialog}
        loading={isDeleteDraftDialogLoading}
        onConfirm={handleDeleteDraft}
      />
      <ConfirmationDialog
        open={isPendingDialogOpen}
        title="放入寄信區"
        content="確定要放入寄信區嗎? 寄信區裡的信件，一旦您設定的發送條件皆成立，就會自動寄出喔！"
        onClose={closePendingDialog}
        loading={isPendingDialogLoading}
        onConfirm={handlePendingDraft}
      />
    </Paper>
  );
}

export default withStyles(styles)(DraftBox);
