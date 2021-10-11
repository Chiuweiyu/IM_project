import React, { useState, useCallback, useRef, Fragment } from "react";
import PropTypes from "prop-types";
import {
  FormHelperText,
  TextField,
  Button,
  Checkbox,
  Typography,
  FormControlLabel,
  withStyles,
  Grid
} from "@material-ui/core";
import FormDialog from "../../../shared/components/FormDialog";
import HighlightedInformation from "../../../shared/components/HighlightedInformation";
import ButtonCircularProgress from "../../../shared/components/ButtonCircularProgress";
import VisibilityPasswordTextField from "../../../shared/components/VisibilityPasswordTextField";
import {registerUser} from "./register_login_api.js";

const styles = (theme) => ({
  link: {
    transition: theme.transitions.create(["background-color"], {
      duration: theme.transitions.duration.complex,
      easing: theme.transitions.easing.easeInOut,
    }),
    cursor: "pointer",
    color: theme.palette.primary.main,
    "&:enabled:hover": {
      color: theme.palette.primary.dark,
    },
    "&:enabled:focus": {
      color: theme.palette.primary.dark,
    },
  },
  button: {
    borderRadius: 20,
  }
});

function RegisterDialog(props) {
  const { setStatus, theme, onClose, openTermsDialog, status, classes } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [hasTermsOfServiceError, setHasTermsOfServiceError] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const registerUserName = useRef();
  const registerLastName = useRef();
  const registerFirstName = useRef();
  const registerPhone = useRef();
  const registerEmail = useRef();
  const registerPassword = useRef();
  const registerPasswordRepeat = useRef();
  const registerTermsCheckbox = useRef();

  const register = useCallback(() => {
    const validPhone = /^09[0-9]{8}$/;
    const isValidPhone = validPhone.test(registerPhone.current.value);
    const validUsername = /^[A-Za-z0-9]+$/;
    const isValidUsername = validUsername.test(registerUserName.current.value);
    if (!registerTermsCheckbox.current.checked) {
      setHasTermsOfServiceError(true);
      return;
    }
    if(!isValidUsername){
      setStatus("invalidUsername");
      return;
    }
    if(!isValidPhone){
      setStatus("invalidPhone");
      return;  
    }
    if(registerPassword.current.value.length < 8){
      setStatus("passwordTooShort");
      return;      
    }
    if (
      registerPassword.current.value !== registerPasswordRepeat.current.value
      ) {
        setStatus("passwordsDontMatch");
        return;
      }
      setStatus(null);
      setIsLoading(true);

      console.log(`
      registerName: ${registerLastName.current.value},
      registerName: ${registerFirstName.current.value},
      registerPhone: ${registerPhone.current.value},
      registerEmail: ${registerEmail.current.value},
      registerPassword: ${registerPassword.current.value},
      `);
      
      registerUser(
        registerUserName.current.value,
        registerLastName.current.value,
        registerFirstName.current.value,
        registerPhone.current.value,
        registerEmail.current.value,
        registerPassword.current.value
      ).then( response =>{
        setIsLoading(false);
        if (response === "accountCreated"){
          setStatus("accountCreated");
        }
        else if (response === "usernameExisted"){
          setStatus("usernameExisted"); 
        }
        else if(response === "emailExisted"){
          setStatus("emailExisted");
        }
        else{
          setStatus("failed"); 
        }
      });

  }, [
    setIsLoading,
    setStatus,
    setHasTermsOfServiceError,
    registerPassword,
    registerPasswordRepeat,
    registerPhone,
    registerTermsCheckbox,
  ]);

  return (
    <FormDialog
      loading={isLoading}
      onClose={onClose}
      open
      headline="註冊"
      onFormSubmit={(e) => {
        e.preventDefault();
        register();
      }}
      hideBackdrop
      hasCloseIcon
      content={
        <Fragment>
          <TextField 
            variant="outlined"
            margin="normal"
            required
            autoFocus 
            error={status === "usernameExisted" || status === "invalidUsername"}
            inputRef={registerUserName}
            label="用戶名稱（英文或數字）"
            size="small"
            onChange={() => {
              if (status === "usernameExisted" || status === "invalidUsername") {
                setStatus(null);
              }
            }}
            helperText={(() => {
              if (status === "usernameExisted") {
                return "很抱歉，用戶名稱已被使用";
              }
              else if(status === "invalidUsername"){
                return "用戶名稱只能是英文或數字";
              }
              return null;
            })()}
            FormHelperTextProps={{ error: true }}
          />  
          <Grid container spacing = {3} >
            <Grid item sm={3}>
              <TextField 
                variant="outlined"
                margin="normal"
                required
                inputRef={registerLastName}
                label="姓"
                size="small"
              />  
            </Grid> 
            <Grid  item sm={5}>        
              <TextField 
              variant="outlined"
              margin="normal"
              required
              inputRef={registerFirstName}
              label="名"
              size="small"
              /> 
            </Grid>            
          </Grid>
        
          <TextField 
            variant="outlined"
            margin="normal"
            required
            inputRef={registerPhone}
            error={status === "invalidPhone"}
            label="手機號碼"
            placeholder="0900123456"
            autoComplete="off"
            onChange={() => {
              if (status === "invalidPhone") {
                setStatus(null);
              }
            }}
            helperText={(() => {
              if (status === "invalidPhone") {
                return "手機號碼不符合格式";
              }
              return null;
            })()}
            FormHelperTextProps={{ error: true }}
            size="small"
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            inputRef={registerEmail}
            error={status === "emailExisted"}
            label="電子信箱"
            type="email"
            onChange={() => {
              if (status === "emailExisted") {
                setStatus(null);
              }
            }}
            helperText={
              status === "emailExisted" &&
              "此信箱已被註冊過"
            }
            FormHelperTextProps={{ error: true }}
            size="small"
          />

          <VisibilityPasswordTextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            error={
              status === "passwordTooShort" || status === "passwordsDontMatch"
            }
            label="密碼"
            inputRef={registerPassword}
            autoComplete="off"
            onChange={() => {
              if (
                status === "passwordTooShort" ||
                status === "passwordsDontMatch"
              ) {
                setStatus(null);
              }
            }}
            helperText={(() => {
              if (status === "passwordTooShort") {
                return "密碼長度需要至少6個字";
              }
              if (status === "passwordsDontMatch") {
                return "密碼不符";
              }
              return null;
            })()}
            FormHelperTextProps={{ error: true }}
            isVisible={isPasswordVisible}
            onVisibilityChange={setIsPasswordVisible}
            size="small"
          />
          <VisibilityPasswordTextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            error={
              status === "passwordTooShort" || status === "passwordsDontMatch"
            }
            label="再輸入一次密碼"
            inputRef={registerPasswordRepeat}
            autoComplete="off"
            onChange={() => {
              if (
                status === "passwordTooShort" ||
                status === "passwordsDontMatch"
              ) {
                setStatus(null);
              }
            }}
            helperText={(() => {
              if (status === "passwordTooShort") {
                return "密碼長度需要至少6個字";
              }
              if (status === "passwordsDontMatch") {
                return "密碼不符";
              }
              return null;
            })()}
            FormHelperTextProps={{ error: true }}
            isVisible={isPasswordVisible}
            onVisibilityChange={setIsPasswordVisible}
            size="small"
          />
          <FormControlLabel
            style={{ marginRight: 0 }}
            control={
              <Checkbox
                color="primary"
                inputRef={registerTermsCheckbox}
                onChange={() => {
                  setHasTermsOfServiceError(false);
                }}
              />
            }
            label={
              <Typography variant="body1">
                我同意
                {/* I agree to the */}
                <span
                  className={classes.link}
                  onClick={isLoading ? null : openTermsDialog}
                  tabIndex={0}
                  role="button"
                  onKeyDown={(event) => {
                    // For screenreaders listen to space and enter events
                    if (
                      (!isLoading && event.keyCode === 13) ||
                      event.keyCode === 32
                    ) {
                      openTermsDialog();
                    }
                  }}
                >
                  {" "}
                  服務條款
                </span>
              </Typography>
            }
          />
          {hasTermsOfServiceError && (
            <FormHelperText
              error
              style={{
                display: "block",
                marginTop: theme.spacing(-1),
              }}
            >
              註冊前，請先同意並勾選
            </FormHelperText>
          )}
          {(status === "accountCreated") && (
            <HighlightedInformation>
              您的帳號已創立，我們已將驗證信寄送至您的電子信箱，請點選信中連結以驗證。
            </HighlightedInformation>
          )}
          {(status === "failed") && (
            <HighlightedInformation>
              註冊失敗
            </HighlightedInformation>
          )}
        </Fragment>
      }
      actions={
        <Grid
          container
          justify="center"
          alignItems="center"
        >
          <Button
            className={classes.button}
            type="submit"
            variant="contained"
            size="large"
            color="secondary"
            disabled={isLoading}
          >
            註冊
            {isLoading && <ButtonCircularProgress />}
          </Button>
        </Grid>
      }
    />
  );
}

RegisterDialog.propTypes = {
  theme: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  openTermsDialog: PropTypes.func.isRequired,
  status: PropTypes.string,
  setStatus: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(RegisterDialog);
