import React, { useState, useCallback, useEffect } from "react";
import {
  Divider,
  Toolbar,
  Typography,
  Paper,
  withStyles,
  TablePagination
} from "@material-ui/core";


// import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import PendingBoxContent from './PendingBoxContent';
import ConfirmationDialog from "../../../shared/components/ConfirmationDialog";
import { cancel } from "../mails_api";

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

const DAY_TO_MIN = 24*60;
const HOUR_TO_MIN = 60;

function PendingBox(props) {
  const { 
    pushMessageToSnackbar,
    classes,
    selectPendingBox
  } = props;
  const [pendingMails, setPendingMails] = useState([]);
  const [canceledMail, setCanceledMail] = useState(null);
  const [page, setPage] = useState(0);

  const rowsPerPage = 25;
  const [isCancelMailDialogOpen, setIsCancelMailDialogOpen] 
    = useState(false);
  const [isCancelMailDialogLoading, setIsCancelMailDialogLoading] 
    = useState(false);    

  useEffect(() => {
    //undefined: sendbox page, draft: draftbox page
      selectPendingBox();
  }, [selectPendingBox]);

  const onCancel = (mail) => {
    setCanceledMail(mail);
    setIsCancelMailDialogOpen(true);
    };

  const closeCancelMailDialog = useCallback(() => {
    setCanceledMail(null);
    setIsCancelMailDialogOpen(false);
    setIsCancelMailDialogLoading(false);
  }, [
    setCanceledMail,
    setIsCancelMailDialogOpen,
    setIsCancelMailDialogLoading]);


  const handleCancelMail = useCallback(() => {
    console.log("handling cancel pending mail... mail_id: ", canceledMail.id);
    setIsCancelMailDialogLoading(true);
    cancel(canceledMail.id).then(response =>{
      pushMessageToSnackbar({
        text: response,
      });
      closeCancelMailDialog();
    });
  }, [
    setIsCancelMailDialogLoading,
    pushMessageToSnackbar,
    closeCancelMailDialog,
    canceledMail
  ]);


  const handlePendingMailsChange = (_mail)=>{
    setPendingMails(_mail);
  };

  const handleChangePage = useCallback(
    (_, page) => {
      setPage(page);
    },
    [setPage]
  );

  return (
    <Paper>
      <Toolbar className={classes.toolbar}>
        <Typography
          color="primary"
          variant="h5" 
          style={{fontWeight: 700, fontFamily: 'Noto Sans TC'}}>
          寄信區
        </Typography>
      </Toolbar>
      <Divider />
      <PendingBoxContent 
        pendingMails={pendingMails}
        handlePendingMailsChange={handlePendingMailsChange}
        rowsPerPage={rowsPerPage}
        page={page}
        onCancel={onCancel}
        DAY_TO_MIN={DAY_TO_MIN}
        HOUR_TO_MIN={HOUR_TO_MIN}
      />
      <TablePagination
        component="div"
        count={pendingMails.length}
        rowsPerPage={rowsPerPage}
        page={page}
        backIconButtonProps={{
          "aria-label": "Previous Page"
        }}
        nextIconButtonProps={{
          "aria-label": "Next Page"
        }}
        onChangePage={handleChangePage}
        classes={{
          select: classes.dNone,
          selectIcon: classes.dNone,
          actions: pendingMails.length > 0 ? classes.dBlock : classes.dNone,
          caption: pendingMails.length > 0 ? classes.dBlock : classes.dNone
        }}
        labelRowsPerPage=""
      />
      <ConfirmationDialog
        open={isCancelMailDialogOpen}
        title="取消寄送"
        content="確定要取消寄送本信嗎? 信件將會回到草稿區，草稿區中的信件即便寄信條件成立也不會寄出喔！"
        onClose={closeCancelMailDialog}
        loading={isCancelMailDialogLoading}
        onConfirm={handleCancelMail}
      />
    </Paper>
  );
}

export default withStyles(styles)(PendingBox);
