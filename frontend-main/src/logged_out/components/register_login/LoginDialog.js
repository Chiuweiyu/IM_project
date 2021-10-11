import React, { useState, useCallback, useRef, Fragment } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withRouter } from "react-router-dom";
import {
  Grid,
  TextField,
  Button,
  Checkbox,
  Typography,
  FormControlLabel,
  withStyles,
} from "@material-ui/core";
import FormDialog from "../../../shared/components/FormDialog";
import HighlightedInformation from "../../../shared/components/HighlightedInformation";
import ButtonCircularProgress from "../../../shared/components/ButtonCircularProgress";
import VisibilityPasswordTextField from "../../../shared/components/VisibilityPasswordTextField";
import {authenticateUser} from "./register_login_api.js";


const styles = (theme) => ({
  forgotPassword: {
    marginTop: theme.spacing(2),
    color: theme.palette.primary.main,
    cursor: "pointer",
    "&:enabled:hover": {
      color: theme.palette.primary.dark,
    },
    "&:enabled:focus": {
      color: theme.palette.primary.dark,
    },
  },
  disabledText: {
    cursor: "auto",
    color: theme.palette.text.disabled,
  },
  formControlLabel: {
    marginRight: 0,
  },
  button: {
    borderRadius: 20
  }
});

function LoginDialog(props) {
  const {
    setStatus,
    history,
    classes,
    onClose,
    openChangePasswordDialog,
    status,
  } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const loginUsername = useRef();
  const loginPassword = useRef();

  const login = useCallback(() => {
    setIsLoading(true);
    setStatus(null);
    authenticateUser(loginUsername.current.value, loginPassword.current.value).then(
      response =>{
        setIsLoading(false);
        if(response === "loggedIn"){
          onClose();
          setStatus(null);
          history.push("/c/inbox");
        }
        else if(response === "invalidUsername"){
          setStatus("invalidUsername");
        }
        else if(response === "invalidPassword"){
          setStatus("invalidPassword");
        }
        else{
          setStatus("failed");
        }
      }
    )
  }, [setIsLoading, 
    loginUsername, 
    loginPassword, 
    history, 
    setStatus,
    onClose]);

  return (
    <Fragment>
      <FormDialog
        open
        onClose={onClose}
        loading={isLoading}
        onFormSubmit={(e) => {
          e.preventDefault();
          login();
        }}
        hideBackdrop
        headline="登入"
        content={
          <Fragment>
            <TextField
              variant="outlined"
              margin="normal"
              error={status === "invalidUsername"}
              required
              fullWidth
              label="用戶名稱"
              inputRef={loginUsername}
              autoFocus
              onChange={() => {
                if (status === "invalidUsername") {
                  setStatus(null);
                }
              }}
              helperText={
                status === "invalidUsername" &&
                "用戶名稱不存在"
              }
              FormHelperTextProps={{ error: true }}
            />
            <VisibilityPasswordTextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              error={status === "invalidPassword"}
              label="密碼"
              inputRef={loginPassword}
              autoComplete="off"
              onChange={() => {
                if (status === "invalidPassword") {
                  setStatus(null);
                }
              }}
              helperText={
                status === "invalidPassword" ? (
                  <span>
                    密碼錯誤，請再嘗試一次，或是點選{" "}
                    <b>&quot;忘記密碼？&quot;</b> 重設密碼
                  </span>
                ) : (
                  ""
                )
              }
              FormHelperTextProps={{ error: true }}
              onVisibilityChange={setIsPasswordVisible}
              isVisible={isPasswordVisible}
            />
            <FormControlLabel
              className={classes.formControlLabel}
              control={<Checkbox color="primary" />}
              label={<Typography variant="body1">記住密碼</Typography>}
            />
            {status === "verificationEmailSend" && (
              <HighlightedInformation>
                我們已寄給您重設密碼的指示說明至您填入的電子信箱
              </HighlightedInformation>
            )}
            {status === "failed" && (
              <HighlightedInformation>
                登入失敗
              </HighlightedInformation>
            )}
          </Fragment>
        }
        actions={
          <Fragment>
          <Grid
            container
            justify="center"
            alignItems="center"
          >
              <Button
                type="submit"
                // fullWidth
                variant="contained"
                color="secondary"
                disabled={isLoading}
                size="large"
                className={classes.button}
              >
                登入
                {isLoading && <ButtonCircularProgress />}
              </Button>

          </Grid>
            <Typography
              align="center"
              className={classNames(
                classes.forgotPassword,
                isLoading ? classes.disabledText : null
              )}
              color="primary"
              onClick={isLoading ? null : openChangePasswordDialog}
              tabIndex={0}
              role="button"
              onKeyDown={(event) => {
                // For screenreaders listen to space and enter events
                if (
                  (!isLoading && event.keyCode === 13) ||
                  event.keyCode === 32
                ) {
                  openChangePasswordDialog();
                }
              }}
            >
              忘記密碼？
            </Typography>
          </Fragment>
        }
      />
    </Fragment>
  );
}

LoginDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  setStatus: PropTypes.func.isRequired,
  openChangePasswordDialog: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  status: PropTypes.string,
};

export default withRouter(withStyles(styles)(LoginDialog));
