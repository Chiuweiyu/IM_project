import React, { Fragment, useEffect } from "react";
import HeadSection from "./HeadSection";
import FeatureSection from "./FeatureSection";
import PricingSection from "./PricingSection";

function Home(props) {
  const { selectHome, openRegisterDialog } = props;
  useEffect(() => {
    selectHome();
  }, [selectHome]);
  return (
    <Fragment>
      <HeadSection openRegisterDialog={openRegisterDialog}/>
      <FeatureSection />
      <PricingSection />
    </Fragment>
  );
}

export default Home;
