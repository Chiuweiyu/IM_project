import React, { useState } from "react";
import jsPDF from 'jspdf';
import { 
    Button,
    Box,
    Card,
    CardContent,
    CardActions,
    Typography,
    withStyles
} from '@material-ui/core';
import ButtonCircularProgress from "../../../shared/components/ButtonCircularProgress";
import GetAppIcon from "@material-ui/icons/GetApp";

const styles = (theme) => ({
    root: {
        margin: theme.spacing(1),
    },
    button:{
      borderRadius: 20
    }
});
function Mail(props) {
    const { 
        onClose,
        mail,
        classes
    } = props;

    const [loading, setLoading] = useState(false);
    
    const handleDownload = () => {
        setLoading(true);
        var doc = new jsPDF('p', 'pt', 'a4');
        // var margin = {top: 10, right: 20, bottom: 10, left: 20};
        doc.setFontSize(15)
        doc.text(40, 40, mail.title);
    
        doc.addFont('helvetica', 'normal');
        doc.text(40, 80, `To: ${mail.to_user_email}`);
        doc.text(40, 120, mail.context);
    
        
        doc.save(mail.title)
        setLoading(false);
      } 

    return(
        <div className={classes.root}>
            <Card>
                <CardContent>
                    <Typography variant="h6">{mail.title}</Typography>
                    <Typography variant="body2">To: {mail.to_user_email}</Typography>
                    <Typography variant="body2">{mail.context}</Typography>
                </CardContent>
            <CardActions>
                <Box mr={1}>
                    <Button onClick={onClose} disabled={loading}>
                        返回
                    </Button>
                </Box>
                <Button
                    onClick={handleDownload}
                    variant="contained"
                    color="secondary"
                    disabled={loading}
                    startIcon={<GetAppIcon />}
                >
                    下載 
                    {loading && <ButtonCircularProgress />}
                </Button>
            </CardActions>
        </Card>
        </div>
    )
}

export default withStyles(styles)(Mail);
