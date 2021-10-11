import React, { Fragment, useCallback, useState } from "react";
import classNames from "classnames";
import {
  Grid,
  Card,
  Box,
  withStyles,
  withWidth,
  Button,
  Typography,
  isWidthUp
} from "@material-ui/core";
import { emailVerifyUser } from "./register_login_api";
import ButtonCircularProgress from "../../../shared/components/ButtonCircularProgress";
import HighlightedInformation from "../../../shared/components/HighlightedInformation";

const styles = (theme) => ({
  card: {
    boxShadow: theme.shadows[4],
    marginLeft: theme.spacing(6),
    marginRight: theme.spacing(6),
    [theme.breakpoints.up("xs")]: {
      paddingTop: theme.spacing(3),
      paddingBottom: theme.spacing(3),
    },
    [theme.breakpoints.up("sm")]: {
      paddingTop: theme.spacing(5),
      paddingBottom: theme.spacing(5),
      paddingLeft: theme.spacing(4),
      paddingRight: theme.spacing(4),
    },
    [theme.breakpoints.up("md")]: {
      paddingTop: theme.spacing(5.5),
      paddingBottom: theme.spacing(5.5),
      paddingLeft: theme.spacing(5),
      paddingRight: theme.spacing(5),
    },
    [theme.breakpoints.up("lg")]: {
      paddingTop: theme.spacing(6),
      paddingBottom: theme.spacing(6),
      paddingLeft: theme.spacing(6),
      paddingRight: theme.spacing(6),
    },
    [theme.breakpoints.down("lg")]: {
      width: "auto",
    },
  },
  wrapper: {
    position: "relative",
    backgroundColor: theme.palette.secondary.main,
    paddingBottom: theme.spacing(2),
  },
  image: {
    minWidth: "30%",
    maxWidth: "30%",
    verticalAlign: "middle",
  },
  container: {
    marginTop: theme.spacing(6),
    marginBottom: theme.spacing(12),
    [theme.breakpoints.down("md")]: {
      marginBottom: theme.spacing(9),
    },
    [theme.breakpoints.down("sm")]: {
      marginBottom: theme.spacing(6),
    },
    [theme.breakpoints.down("sm")]: {
      marginBottom: theme.spacing(3),
    },
  },
  containerFix: {
    [theme.breakpoints.up("md")]: {
      maxWidth: "none !important",
    }
  },
});

function ResetPage(props) {
  const { classes, width } = props;
  const [verified, setVerfied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleVerify = useCallback(()=>{
    setLoading(true);
    emailVerifyUser().then(response=>{
        console.log("verifying user...");
        setMessage(response);
        setVerfied(true);
        setLoading(false);
    })
  }, [setMessage, setVerfied, setLoading]);

  return (
    <Fragment>
      <div className={classNames("lg-p-top", classes.wrapper)}>
        <div className={classNames("container-fluid", classes.container)}>
            <Card
              className={classes.card}
              data-aos-delay="200"
              data-aos="zoom-in"
            >
              <div className={classNames(classes.containerFix, "container")}>
                <Grid container>
                    <Grid item xs={12} sm={12}>
                      <Box display='flex' alignItems='center' justifyContent='center' mb={2}>
                        <Typography color='primary' variant={isWidthUp("md", width) ? "h4" : "subtitle1"}>
                            請點擊下方按鈕驗證帳號
                        </Typography>
                      </Box>
                    </Grid>
                    {verified && (
                    <Grid item xs={12} sm={12}>
                      <Box display='flex' alignItems='center' justifyContent='center' mb={2}>
                        <HighlightedInformation>
                          {message}
                        </HighlightedInformation>
                      </Box>
                    </Grid>)}
                    <Grid item xs={12} sm={12}>
                      <Box display='flex' alignItems='center' justifyContent='center'>
                        <Button
                            color="secondary"
                            onClick={()=>{handleVerify()}}
                            variant="contained"
                            size="large"
                            disabled={loading}
                            style={{borderRadius: 20}}
                        >
                            Verify{loading && <ButtonCircularProgress />}
                        </Button>
                      </Box>
                    </Grid>
                </Grid>
              </div>
            </Card>
        </div>
      </div>
    </Fragment>
  );
}

export default withWidth()(
  withStyles(styles, { withTheme: true })(ResetPage)
);
