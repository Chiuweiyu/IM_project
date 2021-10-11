import React, { useState, useEffect, useCallback} from "react";
import {
    Grid,
    Box
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import SendIcon from "@material-ui/icons/Send";
import EditIcon from '@material-ui/icons/Edit';
import { getUserDraftBox } from "../mails_api";
import SelfAligningImage from "../../../shared/components/SelfAligningImage";
import HighlightedInformation from "../../../shared/components/HighlightedInformation";
// import  { Redirect } from 'react-router-dom'


function DraftBoxContent(props){
    const {
        openUpdateDraftModal,
        page,
        rowsPerPage,
        handleDraftsChange,
        drafts,
        onDelete,
        onPending,
        pushMessageToSnackbar
    } = props;
    const [loading, setLoading] = useState(true);
    const [draftBoxStatus, setDraftBoxStatus] = useState(0);
    const [draftsContent, setDraftsContent] = useState(drafts);
    // const [jwtFail, setJwtFail] = useState(false);

    //image source
    const src = `${process.env.PUBLIC_URL}/images/logged_in/letterImg2.jpg`;

    //action option of each draft
    const draftOption = (draft) => {
        return (
        [{
            name: "刪除",
            onClick: () => { handleDelete(draft); },
            icon: <DeleteIcon />,
        },
        {
            name: "修改",
            onClick: () => { openUpdateDraftModal(draft); },
            icon: <EditIcon />,                        
        },
        {
            name: "正式放入等待寄送區",
            onClick: () => { handlePending(draft); },
            icon: <SendIcon />,
        }]
        );
    }
    //handle draft deletion
    const handleDelete = (draft) => {
        onDelete(draft);
    }

    //change the status from draft to pending
    const handlePending = (draft)=>{
        if ((draft.send_veri_interval === null) ||
        (draft.max_miss_time === null) ||
        (draft.veri_mail_expiration === null)){
            console.log();
            pushMessageToSnackbar({
                text: "信件發送條件尚未編輯完成，無法寄出",
              });
            return;
        }
        onPending(draft);
    }

    //handle draft fetch
    const fecthDrafts = useCallback(() =>{
        setLoading(true);
        getUserDraftBox("draft").then(response=>{
            console.log("fetching user's draftbox...");
            console.log(response["drafts"]);
            //success
            if(Array.isArray(response["drafts"])){
                //change draft's Content
                setDraftsContent(response["drafts"]);
                //pass to parent component
                handleDraftsChange(response["drafts"]);
                //status = null, if request success
                setDraftBoxStatus(null);
                setLoading(false);
            }
            //failed
            else{
                setDraftBoxStatus(response);
                setLoading(false);
            }
        })
    }, [setDraftBoxStatus, 
        setLoading, 
        handleDraftsChange, 
        setDraftsContent,
    ]);

    //call fetchDrafts only once
    // fetch user's draftbox content
    useEffect(()=>{
        if(loading === true){
            fecthDrafts();
        }
    },[loading, fecthDrafts])

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
    if(draftBoxStatus !== null){
        return(
            <Box m={2}>
                <HighlightedInformation>
                    {draftBoxStatus}
                </HighlightedInformation>
            </Box>
        )        
    }

    if (draftsContent.length > 0) {
        return (
        <Box p={1}>
            <Grid container spacing={1}>
            {draftsContent
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((draft) => (
                <Grid item xs={6} sm={4} md={3} key={draft.id}>
                    <SelfAligningImage
                        src={src}
                        title={draft.title}                   
                        options={draftOption(draft)}
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
                目前沒有草稿，點擊「新增草稿」開始您的第一封信吧!
            </HighlightedInformation>
        </Box>            
    );
};

export default DraftBoxContent;
