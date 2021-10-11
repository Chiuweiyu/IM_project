import React from "react";
import { Grid, Typography, isWidthUp, withWidth } from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import HowToRegIcon from "@material-ui/icons/HowToReg";
import ImportContactsIcon from "@material-ui/icons/ImportContacts";
import SendIcon from "@material-ui/icons/Send";
import FavoriteIcon from "@material-ui/icons/Favorite";
import BuildIcon from "@material-ui/icons/Build";
import calculateSpacing from "./calculateSpacing";
import FeatureCard from "./FeatureCard";

const iconSize = 30;

const features = [
  {
    color: "#00C853",
    headline: "我希望信件不被竄改",
    text:
      "（測試中，敬請期待）平台使用區塊鏈技術對所有信件加密，不用擔心遭人竄改，保證寄送及儲存信件時的安全性。",
    icon: <BuildIcon style={{ fontSize: iconSize }} />,
    mdDelay: "0",
    smDelay: "0"
  },
  {
    color: "#6200EA",
    headline: "我希望發送條件多元彈性",
    text:
      "（測試中，敬請期待）發送信件的條件多元，層層關卡包括定期電子郵件確認、守門人確認、最遲寄送時間等等。",
    icon: <SendIcon style={{ fontSize: iconSize }} />,
    mdDelay: "200",
    smDelay: "200"
  },
  {
    color: "#0091EA",
    headline: "我希望對方能永久保存",
    text:
      "線上化的書信不只方便寄送給國內外親友，收信者也能永久保存這份溫暖。",
    icon: <FavoriteIcon style={{ fontSize: iconSize }} />,
    mdDelay: "400",
    smDelay: "0"
  },
  {
    color: "#d50000",
    headline: "我希望告訴大家",
    text:
      "（測試中，敬請期待）除了寄送書信給指定的親友，您也可以選擇寫一封公開信，寫下您想告訴大眾的那些故事，我們將為您公告在平台的「公開信專區」。",
    icon: <ImportContactsIcon style={{ fontSize: iconSize }} />,
    mdDelay: "0",
    smDelay: "200"
  },
  {
    color: "#DD2C00",
    headline: "我希望對方一定要收到",
    text:
      "不用擔心書信藏在某處許久後才被發現，當您所設定的寄送條件皆達成後，便會將其信件寄出，並通知對方。",
    icon: <VisibilityIcon style={{ fontSize: iconSize }} />,
    mdDelay: "200",
    smDelay: "0"
  },
  {
    color: "#64DD17",
    headline: "我希望書信隱密安全",
    text:
      "若是重要機密書信，使用線上寄送能讓您更加安心，降低實體書信不小心洩漏的風險。",
    icon: <HowToRegIcon style={{ fontSize: iconSize }} />,
    mdDelay: "400",
    smDelay: "200"
  }
];

function FeatureSection(props) {
  const { width } = props;
  return (
    <div style={{ backgroundColor: "#FFFFFF" }}>
      <div className="container-fluid lg-p-top">
        <Typography variant="h3" align="center" className="lg-mg-bottom">
          服務特色
        </Typography>
        <div className="container-fluid">
          <Grid container spacing={calculateSpacing(width)}>
            {features.map(element => (
              <Grid
                item
                xs={6}
                md={4}
                data-aos="zoom-in-up"
                data-aos-delay={
                  isWidthUp("md", width) ? element.mdDelay : element.smDelay
                }
                key={element.headline}
              >
                <FeatureCard
                  Icon={element.icon}
                  color={element.color}
                  headline={element.headline}
                  text={element.text}
                />
              </Grid>
            ))}
          </Grid>
        </div>
      </div>
    </div>
  );
}

export default withWidth()(FeatureSection);
