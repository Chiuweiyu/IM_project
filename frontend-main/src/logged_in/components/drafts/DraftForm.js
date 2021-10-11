import React, { Fragment, useState } from "react";
import {
  Typography,
  Grid,
  Card,
  CardHeader,
  CardActions,
  CardContent,
  TextField,
  Box,
  FormGroup,
  FormControlLabel,
  Switch,
  withStyles,
} from "@material-ui/core";
import Collapse from '@material-ui/core/Collapse';

// import DateTimePicker from "../../../shared/components/DateTimePicker";

const styles = (theme) => ({
  root: {
    width: "90px",
    height: "50px",
    padding: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  track: {
    width: "40px",
    height: "20px",
    borderRadius: "10px",
  },
  switchBase: {
    "&$checked": {
      transform: "translateX(40px)",
    },
    "& + $track": {
      backgroundColor: "rgba(0,125,129,0.3)",
    },
  },
  checked: {},
  thumb: {
    width: "32px",
    height: "32px",
    transform: "translateX(0px)",
  },
  floatButtonWrapper: {
    position: "absolute",
    top: theme.spacing(1),
    right: theme.spacing(1),
    zIndex: 1000,
  },
  inputRoot: {
    width: 190,
    "@media (max-width:  400px)": {
      width: 160,
    },
    "@media (max-width:  360px)": {
      width: 140,
    },
    "@media (max-width:  340px)": {
      width: 120,
    },
  },
  uploadIcon: {
    fontSize: 48,
    transition: theme.transitions.create(["color", "box-shadow", "border"], {
      duration: theme.transitions.duration.short,
      easing: theme.transitions.easing.easeInOut,
    }),
  },
  imgWrapper: { position: "relative" },
  img: {
    width: "100%",
    border: "1px solid rgba(0, 0, 0, 0.23)",
    borderRadius: theme.shape.borderRadius,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  uploadText: {
    transition: theme.transitions.create(["color", "box-shadow", "border"], {
      duration: theme.transitions.duration.short,
      easing: theme.transitions.easing.easeInOut,
    }),
  },
  numberInput: {
    width: 110,
  },
  numberInputInput: {
    padding: "9px 34px 9px 14.5px",
  },
  emojiTextArea: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    marginRight: -1,
  },
  dNone: {
    display: "none",
  },
  card: {
    minWidth: 200,
    minHeight: 100,
    maxWidth: 300,
    maxHeight: 200,
  },
  cardTitleContainer: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.common.white
  },
  cardDescription: {
    paddingTop: theme.spacing(2)
  }
});

function DraftForm(props) {
  const {
    draftStatus,
    onChangeDraftStatus,
    classes,
    // sendAt,
    // onChangeSendAt,
    onTitle,
    onEmail,
    onContent,
    onSendVeriInterval,
    onMaxMissTime,
    onVeriMailExpiration,
    draftDefault,
    DAY_TO_MIN,
    HOUR_TO_MIN,
  } = props;

  const [showExample, setShowExample] = useState(false);
  const [title, setTitle] = useState(
    draftDefault ? draftDefault.title : "未命名信件"
  );
  const [email, setEmail] = useState(
    draftDefault ? draftDefault.to_user_email : ""
  );
  const [content, setContent] = useState(
    draftDefault ? draftDefault.context : ""
  );
  const [sendVeriInterval, setSendVeriInterval] = useState(
    draftDefault ? (draftDefault.send_veri_interval/DAY_TO_MIN).toString() : ""
  );
  const [maxMissTime, setMaxMissTime] = useState(
    draftDefault ? (draftDefault.max_miss_time).toString() : ""
  );
  const [veriMailExpiration, setVeriMailExpiration] = useState(
    draftDefault ? (draftDefault.veri_mail_expiration/HOUR_TO_MIN).toString() : ""
  );
  const handleShowExample = () => {
    setShowExample(showExample === true? false: true);
  };

  const handleTitleChange = (e) => {
    if (draftStatus === "emptyDraftTitle") {
      onChangeDraftStatus(null);
    }
    const value = e.target.value;
    setTitle(value);
    onTitle(value);
  };

  const handleEmailChange = (e) => {
    if (draftStatus === "invalidEmail") {
      onChangeDraftStatus(null);
    }
    const value = e.target.value;
    setEmail(value);
    onEmail(value);
  };

  const handleContentChange = (e) => {
    const value = e.target.value;
    setContent(value);
    onContent(value);
  };

  const handleSendVeriIntervalChange = (e) => {
    const value = e.target.value;
    setSendVeriInterval(value);
    onSendVeriInterval(value);
  };

  const handleMaxMissTimeChange = (e) => {
    const value = e.target.value;
    setMaxMissTime(value);
    onMaxMissTime(value);
  };

  const handleVeriMailExpirationChange = (e) => {
    const value = e.target.value;
    setVeriMailExpiration(value);
    onVeriMailExpiration(value);
  };

  return (
    <Fragment>
      <Typography paragraph variant="h5">
        編輯草稿
      </Typography>

      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        label="信件標題"
        error={draftStatus === "emptyDraftTitle"}
        helperText={
          draftStatus === "emptyDraftTitle" &&
          "請填入標題"
        }
        FormHelperTextProps={{ error: true }}
        autoFocus
        onChange={handleTitleChange}
        value={title}
      />

      <TextField
        variant="outlined"
        margin="normal"
        fullWidth
        error={draftStatus === "invalidEmail"}
        label="收件者電子信箱"
        autoComplete="off"
        type="email"
        FormHelperTextProps={{ error: true }}
        onChange={handleEmailChange}
        value={email}
      />

      <Box mb={2}>
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          label="信件內容"
          multiline={true}
          rows={16}
          onChange={handleContentChange}
          value={content}
        />
      </Box>
      <Grid container direction="row" spacing={5}>
        <Grid item>
          <Typography paragraph variant="h5">
            信件寄送條件
          </Typography>
        </Grid>
        <Grid item>
          <FormGroup>
            <FormControlLabel control={
              <Switch 
              checked={showExample}
              onChange={handleShowExample}
              name="show-example"
              size="small"
              color="secondary"
              />
            } label="查看範例" 
            />
          </FormGroup>
        </Grid>
      </Grid>
      <Collapse in={showExample}>
        <Typography paragraph>
          假設您做以下設定：<br/>
          每7天要發送一次例行確認信，<br/>
          錯過3封緊急確認信後，即自動寄出信件，<br/>
          發送緊急確認信的間隔時間為24小時。<br/><br/>
          則假設您在 10/1 早上將信件放入「寄送區」等待寄送，<br/>
          平台會在7天後，10/8 早上寄送一封「例行確認信」給您，<br/>
          假設您7天都沒有回覆該信，<br/>
          平台會馬上寄出一封「緊急確認信」給您，<br/>
          若您24小時內都沒有回覆緊急確認信，<br/>
          平台會寄第二封緊急確認信給您，<br/>
          若48小時內都沒有回覆緊急確認信，<br/>
          平台會寄第三封緊急確認信給您，<br/>
          若72小時內都沒有回覆的話，<br/><br/>
          因為已錯過3次緊急確認信，因此平台將會替您寄出信件。
        </Typography>
      </Collapse>
      {/* <Card className={classes.card}>
        <CardHeader
          className={classes.cardTitleContainer}
          title=""
        />
        <Box 
          display="flex" 
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
        >
          <CardContent>
            <Typography className={classes.cardDescription}>
                此封信的寄送時間為：
            </Typography>
          </CardContent>
          <CardActions>
            {DateTimePicker && (
              <DateTimePicker
              value={sendAt}
              format="yyyy/MM/dd hh:mm a"
              onChange={onChangeSendAt}
              disablePast
              />)}
          </CardActions>
        </Box>
      </Card> */}
      <Grid
        container
        justifyContent="center"
        spacing={2}
      >
        <Grid item>
          <Card className={classes.card}>
            <CardHeader
              className={classes.cardTitleContainer}
              title=""
            />
            <Box 
              display="flex" 
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
            >
              <CardContent>
                <Typography className={classes.cardDescription}>
                    我想要平台多久寄送一次是否要發送信件的例行確認信：
                </Typography>
              </CardContent>
              <CardActions>
                <Box display="flex" alignItems="flex-start">
                  <Box>
                    <TextField 
                      label=""
                      onChange={handleSendVeriIntervalChange}
                      value={sendVeriInterval}
                    />
                  </Box>
                  <Box>
                    <Typography paragraph>
                      天
                    </Typography>
                  </Box>
                </Box>
              </CardActions>
            </Box>
          </Card>
        </Grid>
        <Grid item>
          <Card className={classes.card}>
            <CardHeader
              className={classes.cardTitleContainer}
              title=""
            />
            <Box 
              display="flex" 
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
            >
              <CardContent>
                <Typography className={classes.cardDescription}>
                  在我錯過幾封緊急確認信後，即自動幫我送出信件
                </Typography>
              </CardContent>
              <CardActions>
              <Box display="flex" alignItems="flex-start">
                  <Box>
                    <TextField 
                      label=""
                      onChange={handleMaxMissTimeChange}
                      value={maxMissTime}
                    />
                  </Box>
                  <Box>
                    <Typography paragraph>
                      封
                    </Typography>
                  </Box>
                </Box>
              </CardActions>
            </Box>
          </Card>
        </Grid>
        <Grid item>
          <Card className={classes.card}>
            <CardHeader
              className={classes.cardTitleContainer}
              title=""
            />
            <Box 
              display="flex" 
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
            >
              <CardContent>
                <Typography className={classes.cardDescription}>
                  發送緊急確認信的間隔時間為何
                </Typography>
              </CardContent>
              <CardActions>
              <Box display="flex" alignItems="flex-start">
                  <Box>
                    <TextField 
                      label=""
                      onChange={handleVeriMailExpirationChange}
                      value={veriMailExpiration}
                    />
                  </Box>
                  <Box>
                    <Typography paragraph>
                      小時
                    </Typography>
                  </Box>
                </Box>
              </CardActions>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Fragment>
  );
}

export default withStyles(styles, { withTheme: true })(DraftForm);
