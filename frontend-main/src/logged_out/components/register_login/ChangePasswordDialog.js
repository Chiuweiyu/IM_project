import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import {
  TextField,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  withStyles,
} from "@material-ui/core";
import ButtonCircularProgress from "../../../shared/components/ButtonCircularProgress";

const styles = (theme) => ({
  dialogContent: {
    paddingTop: theme.spacing(2),
  },
  dialogActions: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
});

function ChangePassword(props) {
  const { onClose, classes, setLoginStatus } = props;
  const [isLoading, setIsLoading] = useState(false);

  const sendPasswordEmail = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setLoginStatus("verificationEmailSend");
      setIsLoading(false);
      onClose();
    }, 1500);
  }, [setIsLoading, setLoginStatus, onClose]);

  return (
    <Dialog
      open
      hideBackdrop
      onClose={onClose}
      disableBackdropClick={isLoading}
      disableEscapeKeyDown={isLoading}
      maxWidth="xs"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendPasswordEmail();
        }}
      >
        <DialogContent className={classes.dialogContent}>
          <Typography paragraph>
            在下方填入您的電子郵件，我們會寄給您重設密碼的指示說明
          </Typography>
          <TextField
            variant="outlined"
            margin="dense"
            required
            fullWidth
            label="電子信箱"
            autoFocus
            type="email"
            autoComplete="off"
          />
        </DialogContent>
        <DialogActions className={classes.dialogActions}>
          <Button onClick={onClose} disabled={isLoading} style={{ borderRadius: 20 }}>
            取消
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            disabled={isLoading}
            style={{ borderRadius: 20 }}
          >
            重設密碼
            {isLoading && <ButtonCircularProgress />}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

ChangePassword.propTypes = {
  onClose: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  setLoginStatus: PropTypes.func.isRequired,
};

export default withStyles(styles, { withTheme: true })(ChangePassword);
