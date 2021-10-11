import React, { useState, useEffect, useCallback } from "react";
import {
    Grid,
    Box
} from "@material-ui/core";
import { getInbox } from "../mails_api";
import DeleteIcon from "@material-ui/icons/Delete";
import VisibilityIcon from '@material-ui/icons/Visibility';
import SelfAligningImage from "../../../shared/components/SelfAligningImage";
import HighlightedInformation from "../../../shared/components/HighlightedInformation";
// import  { Redirect } from 'react-router-dom'


function InboxContent(props){
    const {
        openMailModal,
        page,
        rowsPerPage,
        handleMailChange,
        mails,
        onDelete,
    } = props;
    const [loading, setLoading] = useState(true);
    const [inboxStatus, setInboxStatus] = useState(0);
    const [inboxContent, setInboxContent] = useState(mails);
    // const [jwtFail, setJwtFail] = useState(false);

    //image source
    const src = `${process.env.PUBLIC_URL}/images/logged_in/letterImg2.jpg`;
    // const downloadMail = () =>{
    //   console.log("downloading...");
    // }

    //handle inbox mail deletion
    const handleDelete = (mail)=>{
        onDelete(mail);
    }
    //action option of each draft
    const mailOption = (mail) => {
      return (
        [{
            name: "刪除",
            onClick: () => { handleDelete(mail); },
            icon: <DeleteIcon />,
          },
          {
            name: "查看",
            onClick: () => { openMailModal(mail); },
            icon: <VisibilityIcon />
          },
        //   {
        //     name: "下載",
        //     onClick: () => { downloadMail(mail); },
        //     icon: <GetAppIcon />,
        //   }
        ]
      );
    }

    //handle mail fetch
    const fecthInboxMails = useCallback(() =>{
        setLoading(true);
        getInbox().then(response=>{
            console.log("fetching user's inbox...");
            console.log(response["inbox_letters"]);
            //success
            if(Array.isArray(response["inbox_letters"])){
                //change draft's Content
                setInboxContent(response["inbox_letters"]);
                //pass to parent component
                handleMailChange(response["inbox_letters"]);
                //status = null, if request success
                setInboxStatus(null);
                setLoading(false);
            }
            //failed
            else{
                setInboxStatus(response);
                setLoading(false);
            }
        })
    }, [setInboxStatus, 
        setLoading, 
        handleMailChange,
        setInboxContent]);

    //call fecthInboxMails only once
    // fetch user's inbox content
    useEffect(()=>{
        if(loading === true){
            fecthInboxMails();
        }
    },[loading, fecthInboxMails])

    // if(jwtFail){
    //     return (<Redirect to='/' />)
    // }

    if(loading){ 
        return(
            <Box m={2}>
                <HighlightedInformation>
                    請稍等...
                </HighlightedInformation>
            </Box>
        )       
    }
    if(inboxStatus !== null){
        return(
            <Box m={2}>
                <HighlightedInformation>
                    {inboxStatus}
                </HighlightedInformation>
            </Box>
        )        
    }

    if (inboxContent.length > 0) {
        return (
        <Box p={1}>
            <Grid container spacing={1}>
            {inboxContent
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((mail) => (
                <Grid item xs={6} sm={4} md={3} key={mail.id}>
                    <SelfAligningImage
                      src={src}
                      title={mail.title}                   
                      options={mailOption(mail)}
                    />
                </Grid>
                ))}
            </Grid>
        </Box>
        );
    }
    return (
        <Box m={2}>
            <HighlightedInformation>
                目前沒有來信喔！
            </HighlightedInformation>
        </Box>            
    );
};

export default InboxContent;

