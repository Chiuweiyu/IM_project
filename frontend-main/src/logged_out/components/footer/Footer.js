import React from "react";
import {
  Grid,
  Typography,
  Box,
  IconButton,
  Hidden,
  withStyles,
  withWidth,
  isWidthUp
} from "@material-ui/core";
import MailIcon from "@material-ui/icons/Mail";
import WaveBorder from "../../../shared/components/WaveBorder";
import transitions from "@material-ui/core/styles/transitions";

const styles = theme => ({
  footerInner: {
    backgroundColor: theme.palette.common.darkBlack,
    paddingTop: theme.spacing(8),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(6),
    [theme.breakpoints.up("sm")]: {
      paddingTop: theme.spacing(10),
      paddingLeft: theme.spacing(16),
      paddingRight: theme.spacing(16),
      paddingBottom: theme.spacing(10)
    },
    [theme.breakpoints.up("md")]: {
      paddingTop: theme.spacing(10),
      paddingLeft: theme.spacing(10),
      paddingRight: theme.spacing(10),
      paddingBottom: theme.spacing(10)
    }
  },
  brandText: {
    fontFamily: "'Baloo Bhaijaan', cursive",
    fontWeight: 400,
    color: theme.palette.common.white
  },
  footerLinks: {
    marginTop: theme.spacing(2.5),
    marginBot: theme.spacing(1.5),
    color: theme.palette.common.white
  },
  infoIcon: {
    color: `${theme.palette.common.white} !important`,
    backgroundColor: "#33383b !important"
  },
  socialIcon: {
    fill: theme.palette.common.white,
    backgroundColor: "#33383b",
    borderRadius: theme.shape.borderRadius,
    "&:hover": {
      backgroundColor: theme.palette.primary.light
    }
  },
  link: {
    cursor: "Pointer",
    color: theme.palette.common.white,
    transition: transitions.create(["color"], {
      duration: theme.transitions.duration.shortest,
      easing: theme.transitions.easing.easeIn
    }),
    "&:hover": {
      color: theme.palette.primary.light
    }
  },
  whiteBg: {
    backgroundColor: theme.palette.common.white
  }
});

const infos = [
  {
    icon: <MailIcon />,
    description: "improjectletter@gmail.com"
  }
];

function Footer(props) {
  const { classes, theme, width } = props;
  return (
    <footer className="lg-p-top">
      <WaveBorder
        upperColor="#FFFFFF"
        lowerColor={theme.palette.common.darkBlack}
        animationNegativeDelay={4}
      />
      <div className={classes.footerInner}>
        <Grid container spacing={isWidthUp("md", width) ? 10 : 5}>
          <Grid item xs={12} sm={6} md={6} lg={6}>
            <Box display="flex" justifyContent="center">
              <div>
                {infos.map((info, index) => (
                  <Box display="flex" mb={1} key={index}>
                    <Box mr={2}>
                      <IconButton
                        className={classes.infoIcon}
                        tabIndex={-1}
                        disabled
                      >
                        {info.icon}
                      </IconButton>
                    </Box>
                    <Box
                      display="flex"
                      flexDirection="column"
                      justifyContent="center"
                    >
                      <Typography variant="h6" className="text-white">
                        {info.description}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </div>
            </Box>
          </Grid>
          <Hidden smDown>
            <Grid item xs={12} sm={6} md={6} lg={6}>
              <Typography variant="h6" paragraph className="text-white">
                關於平台
              </Typography>
              <Typography style={{ color: "#8f9296" }} paragraph>
                這個平台的初心是希望幫助大家跨時空的傳遞溫暖甚至是那些來不及說出口的話。
              </Typography>
            </Grid>
          </Hidden>
        </Grid>
      </div>
    </footer>
  );
}

export default withWidth()(withStyles(styles, { withTheme: true })(Footer));
