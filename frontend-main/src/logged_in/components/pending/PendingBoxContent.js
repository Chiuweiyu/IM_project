import React, { useCallback, useState, useEffect } from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableRow,
  withStyles
} from "@material-ui/core";
import EnhancedTableHead from "../../../shared/components/EnhancedTableHead";
import ColorfulChip from "../../../shared/components/ColorfulChip";
// import unixToDateString from "../../../shared/functions/unixToDateString";
import HighlightedInformation from "../../../shared/components/HighlightedInformation";
// import currencyPrettyPrint from "../../../shared/functions/currencyPrettyPrint";
import { getUserDraftBox } from "../mails_api";
// import  { Redirect } from 'react-router-dom'

const styles = theme => ({
  tableWrapper: {
    overflowX: "auto",
    width: "100%"
  },
  blackBackground: {
    backgroundColor: theme.palette.primary.main
  },
  contentWrapper: {
    padding: theme.spacing(3),
    [theme.breakpoints.down("xs")]: {
      padding: theme.spacing(2)
    },
    width: "100%"
  },
  dBlock: {
    display: "block !important"
  },
  dNone: {
    display: "none !important"
  },
  firstData: {
    paddingLeft: theme.spacing(3)
  },
  button:{
    borderRadius: 18
  }
});

const rows = [
  {
    id: "title",
    numeric: false,
    label: "信件標題"
  },
  {
    id: "condition",
    numeric: false,
    label: "信件發送條件"
  },
  {
    id: "cancel",
    numeric: false,
    label: "退回草稿區"
  },
  {
    id: "status",
    numeric: false,
    label: "等待中 or 已寄達"
  }
];


function PendingBoxContent(props) {
  const {
    theme,
    classes,
    pendingMails,
    handlePendingMailsChange,
    rowsPerPage,
    page,
    onCancel,
    DAY_TO_MIN,
    HOUR_TO_MIN
  } = props;
  const [pendingMailsContent, setPendingMailsContent] = useState(pendingMails);
  const [loading, setLoading] = useState(true);
  const [pendingBoxStatus, setPendingBoxStatus] = useState(0);

  //handle pending mails fetch
  const fecthPendingMails = useCallback(() =>{
    setLoading(true);
    getUserDraftBox("pending").then(response=>{
        console.log("fetching user's pendingbox...");
        console.log(response["drafts"]);
        //success
        if(Array.isArray(response["drafts"])){
            //change draft's Content
            setPendingMailsContent(response["drafts"]);
            //pass to parent component
            handlePendingMailsChange(response["drafts"]);
            //status = null, if request success
            setPendingBoxStatus(null);
            setLoading(false);
        }
        //failed
        else{
            setPendingBoxStatus(response);
            setLoading(false);
        }
    })
  }, [setPendingBoxStatus, 
    setLoading, 
    handlePendingMailsChange, 
    setPendingMailsContent]);

  const handleCancel = (mail) =>{
    onCancel(mail);
  }

  //call fetchDrafts only once
  // fetch user's draftbox content
  useEffect(()=>{
    if(loading === true){
        fecthPendingMails();
    }
  },[loading, fecthPendingMails])

  if(loading){ 
      return(
          <Box m={2}>
              <HighlightedInformation>
                  請稍等...
              </HighlightedInformation>
          </Box>
      )       
  }

  if(pendingBoxStatus !== null){
    return(
        <Box m={2}>
            <HighlightedInformation>
                {pendingBoxStatus}
            </HighlightedInformation>
        </Box>
    )        
  }

  if (pendingMailsContent.length > 0) {
    return (
      <div className={classes.tableWrapper}>
        <Table aria-labelledby="tableTitle">
          <EnhancedTableHead rowCount={pendingMailsContent.length} rows={rows} />
          <TableBody>
            {pendingMailsContent
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((pendingMail, index) => (
                <TableRow hover tabIndex={-1} key={index}>
                  <TableCell
                    component="th"
                    scope="row"
                    className={classes.firstData}
                    align='center'
                  >
                    {pendingMail.title}
                  </TableCell>
                  <TableCell component="th" scope="row" align='center'>
                    {/* {unixToDateString(pendingMail.date)} */}
                    <HighlightedInformation>
                      每{pendingMail.send_veri_interval/DAY_TO_MIN}天寄送一次例行確認信<br/>
                      錯過第{pendingMail.max_miss_time}封緊急確認信時發送信件<br/>
                      緊急確認信間隔{pendingMail.veri_mail_expiration/HOUR_TO_MIN}小時
                    </HighlightedInformation>
                  </TableCell>
                  <TableCell component="th" scope="row" align='center'>
                    <Button
                      className={classes.button}
                      color="secondary"
                      onClick={ () => { handleCancel(pendingMail); } }
                    >
                      取消寄送
                    </Button>
                  </TableCell>
                  <TableCell component="th" scope="row" align='center'>
                    <ColorfulChip
                        label="等待中"
                        color={theme.palette.error.dark}
                    />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className={classes.contentWrapper}>
      <HighlightedInformation>
        目前沒有已完成並等待寄送的信件，前往草稿區開始您的第一封信吧!
      </HighlightedInformation>
    </div>
  );
}

export default withStyles(styles, { withTheme: true })(PendingBoxContent);
