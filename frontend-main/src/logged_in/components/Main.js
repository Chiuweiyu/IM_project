import React, { memo, useCallback, useState, Fragment } from "react";
import classNames from "classnames";
import { withStyles } from "@material-ui/core";
import Routing from "./Routing";
import NavBar from "./navigation/NavBar";
import ConsecutiveSnackbarMessages from "../../shared/components/ConsecutiveSnackbarMessages";
import smoothScrollTop from "../../shared/functions/smoothScrollTop";

const styles = (theme) => ({
  main: {
    marginLeft: theme.spacing(9),
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    [theme.breakpoints.down("xs")]: {
      marginLeft: 0,
    },
  },
});


function Main(props) {
  const { classes } = props;
  const [selectedTab, setSelectedTab] = useState(null);
  const [pushMessageToSnackbar, setPushMessageToSnackbar] = useState(null);
  
  const selectDraftBox = useCallback(() => {
    smoothScrollTop();
    document.title = "LetterYou - draftbox";
    setSelectedTab("草稿區");
  }, [
    setSelectedTab,
  ]);

  const selectPendingBox = useCallback(() => {
    smoothScrollTop();
    document.title = "LetterYou - pendingbox";
    setSelectedTab("寄信區");
  }, [
    setSelectedTab,
  ]);

  const selectInbox = useCallback(() => {
    smoothScrollTop();
    document.title = "LetterYou - inbox";
    setSelectedTab("收信區");
  }, [
    setSelectedTab,
  ]);


  const getPushMessageFromChild = useCallback(
    (pushMessage) => {
      setPushMessageToSnackbar(() => pushMessage);
    },
    [setPushMessageToSnackbar]
  );

  return (
    <Fragment>
      <NavBar
        selectedTab={selectedTab}
      />
      <ConsecutiveSnackbarMessages
        getPushMessageFromChild={getPushMessageFromChild}
      />
      <main className={classNames(classes.main)}>
        <Routing
          pushMessageToSnackbar={pushMessageToSnackbar}
          selectInbox={selectInbox}
          selectDraftBox={selectDraftBox}
          selectPendingBox={selectPendingBox}
        />
      </main>
    </Fragment>
  );
}

export default withStyles(styles, { withTheme: true })(memo(Main));
