import React, { Fragment, useState, useCallback } from "react";
import { Button, Box } from "@material-ui/core";
import ActionPaper from "../../../shared/components/ActionPaper";
import ButtonCircularProgress from "../../../shared/components/ButtonCircularProgress";
import DraftForm from "./DraftForm";
import {createDraft, updateDraft} from "../mails_api";

function DraftCreation(props) {
  const {
    pushMessageToSnackbar,
    onClose,
    updatedDraft,
    DAY_TO_MIN,
    HOUR_TO_MIN,
  } = props;
  const [draftStatus, setDraftStatus] = useState(null);
  const [sendAt, setSendAt] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(
    updatedDraft?updatedDraft.title:"未命名信件"
  );
  const [email, setEmail] = useState(
    updatedDraft?updatedDraft.to_user_email:""
  );
  const [content, setContent] = useState(
    updatedDraft?updatedDraft.context:""
  );  
  const [sendVeriInterval, setSendVeriInterval] = useState(
    updatedDraft?(updatedDraft.send_veri_interval/DAY_TO_MIN).toString():""
  ); 
  const [maxMissTime, setMaxMissTime] = useState(
    updatedDraft?(updatedDraft.max_miss_time).toString():""
  ); 
  const [veriMailExpiration, setVeriMailExpiration] = useState(
    updatedDraft?(updatedDraft.veri_mail_expiration/HOUR_TO_MIN).toString():""
  ); 

  const handleTitleChange = (title) =>{
    setTitle(title);
  }
  const handleEmailChange = (email) =>{
    setEmail(email);
  }
  const handleContentChange = (content) =>{
    setContent(content);
  }
  const handleSendVeriIntervalChange = (interval) =>{
    setSendVeriInterval(interval);
  }
  const handleMaxMissTimeChange = (miss) =>{
    setMaxMissTime(miss);
  }
  const handleVeriMailExpirationChange = (expiration) =>{
    setVeriMailExpiration(expiration);
  }

  const handleUpdate =  useCallback(() =>{
    console.log("updating..., draft_id: ", updatedDraft.id);
    console.log("sendVeriInterval: ", sendVeriInterval, "days");
    console.log("maxMissTime: ", maxMissTime, "times");
    console.log("veriMailExpiration: ", veriMailExpiration, "hours");
    setLoading(true);
    updateDraft(
      updatedDraft.id, 
      title, 
      email, 
      content, 
      parseFloat(sendVeriInterval)*DAY_TO_MIN,
      parseInt(maxMissTime),
      parseFloat(veriMailExpiration)*HOUR_TO_MIN
      ).then(response =>{
      if (response === "draftUpdated"){
        setTitle(null);
        setEmail(null);
        setContent(null);
        setSendVeriInterval(null);
        setMaxMissTime(null);
        setVeriMailExpiration(null);
        setLoading(false);
        onClose();
        pushMessageToSnackbar({
          text: "您的草稿已更新",
        });
      }
      else{
        console.log("draft-update failed")
        setLoading(false);
        pushMessageToSnackbar({
          text: "更新失敗",
        });
      }
    });
  },[setLoading, 
    setTitle, 
    setEmail, 
    setContent, 
    setSendVeriInterval,
    setMaxMissTime,
    setVeriMailExpiration,
    title, 
    email, 
    content, 
    sendVeriInterval,
    maxMissTime,
    veriMailExpiration,
    pushMessageToSnackbar, 
    onClose,
    updatedDraft,
    DAY_TO_MIN,
    HOUR_TO_MIN]);

  const handleUpload = useCallback(() =>{
    console.log("uploading...");
    console.log("sendVeriInterval: ", sendVeriInterval, "days");
    console.log("maxMissTime: ", maxMissTime, "times");
    console.log("veriMailExpiration: ", veriMailExpiration, "hours");
    setLoading(true);
    createDraft(
      title,
      email,
      content,
      parseFloat(sendVeriInterval)*DAY_TO_MIN,
      parseInt(maxMissTime),
      parseFloat(veriMailExpiration)*HOUR_TO_MIN
    ).then(response =>{
      if (response === "draftCreated"){
        setTitle(null);
        setEmail(null);
        setContent(null);
        setSendVeriInterval(null);
        setMaxMissTime(null);
        setVeriMailExpiration(null);
        setLoading(false);
        onClose();
        pushMessageToSnackbar({
          text: "您的草稿已建立",
        });
      }
      else{
        console.log("draft-creation failed")
        setLoading(false);
        pushMessageToSnackbar({
          text: "新增失敗",
        });
      }
    });
  },[setLoading, 
    setTitle, 
    setEmail, 
    setContent, 
    setSendVeriInterval,
    setMaxMissTime,
    setVeriMailExpiration,
    title, 
    email, 
    content, 
    sendVeriInterval,
    maxMissTime,
    veriMailExpiration,
    pushMessageToSnackbar, 
    onClose,
    DAY_TO_MIN,
    HOUR_TO_MIN]);

  const handleSubmit = useCallback(() =>{
    if(title === ""){
      setDraftStatus("emptyDraftTitle");
      return;
    }

    setDraftStatus(null);
    //create draft
    if(updatedDraft === null){
      handleUpload();
    }
    //update draft
    else{
      handleUpdate();
    }
  }, [title, handleUpload, handleUpdate, updatedDraft]);

  return (
    <Fragment>
      <ActionPaper
        helpPadding
        maxWidth="md"
        content={
          <DraftForm
            onTitle={handleTitleChange}
            onEmail={handleEmailChange}
            onContent={handleContentChange}
            onSendVeriInterval={handleSendVeriIntervalChange}
            onMaxMissTime={handleMaxMissTimeChange}
            onVeriMailExpiration={handleVeriMailExpirationChange}
            draftDefault={updatedDraft}
            sendAt={sendAt}
            onChangeSendAt={setSendAt}
            draftStatus={draftStatus}
            onChangeDraftStatus={setDraftStatus}
            DAY_TO_MIN={DAY_TO_MIN}
            HOUR_TO_MIN={HOUR_TO_MIN}
          />
        }
        actions={
          <Fragment>
            <Box mr={1}>
              <Button onClick={onClose} disabled={loading}>
                取消
              </Button>
            </Box>
            <Button
              onClick={handleSubmit}
              variant="contained"
              color="secondary"
              disabled={loading}
            >
              {(updatedDraft === null)?"儲存草稿": "更新草稿"} 
              {loading && <ButtonCircularProgress />}
            </Button>
          </Fragment>
        }
      />
    </Fragment>
  );
}

export default DraftCreation;
