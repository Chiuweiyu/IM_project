import React, { memo } from "react";
import { Switch } from "react-router-dom";
import { withStyles } from "@material-ui/core";
import Inbox from "./inbox/Inbox";
import PendingBox from "./pending/PendingBox";
import Drafts from "./drafts/Drafts";
import PropsRoute from "../../shared/components/PropsRoute";
import useLocationBlocker from "../../shared/functions/useLocationBlocker";

const styles = (theme) => ({
  wrapper: {
    margin: theme.spacing(1),
    width: "auto",
    [theme.breakpoints.up("xs")]: {
      width: "95%",
      marginLeft: "auto",
      marginRight: "auto",
      marginTop: theme.spacing(4),
      marginBottom: theme.spacing(4),
    },
    [theme.breakpoints.up("sm")]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      width: "90%",
      marginLeft: "auto",
      marginRight: "auto",
    },
    [theme.breakpoints.up("md")]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      width: "82.5%",
      marginLeft: "auto",
      marginRight: "auto",
    },
    [theme.breakpoints.up("lg")]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      width: "70%",
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
});

function Routing(props) {
  const {
    classes,
    DateTimePicker,
    pushMessageToSnackbar,
    selectInbox,
    selectDraftBox,
    selectPendingBox
  } = props;
  useLocationBlocker();

  return (
    <div className={classes.wrapper}>
      <Switch>
        <PropsRoute
          path="/c/drafts"
          component={Drafts}
          DateTimePicker={DateTimePicker}
          pushMessageToSnackbar={pushMessageToSnackbar}
          selectDraftBox={selectDraftBox}
        />
        <PropsRoute
          path="/c/pending"
          component={PendingBox}
          DateTimePicker={DateTimePicker}
          pushMessageToSnackbar={pushMessageToSnackbar}
          selectPendingBox={selectPendingBox}
        />
        <PropsRoute
          path=""
          component={Inbox}
          pushMessageToSnackbar={pushMessageToSnackbar}
          selectInbox={selectInbox}
        />
      </Switch>
    </div>
  );
}

export default withStyles(styles, { withTheme: true })(memo(Routing));
