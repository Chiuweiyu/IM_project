import React, { memo } from "react";
import { Switch } from "react-router-dom";
import PropsRoute from "../../shared/components/PropsRoute";
import Home from "./home/Home";
import Blog from "./blog/Blog";
import BlogPost from "./blog/BlogPost";
import VerifyOk from "./verify/VerifyOk";
import VerifyFail from "./verify/VerifyFail";
import ResetPage from "./register_login/ResetPage";
import useLocationBlocker from "../../shared/functions/useLocationBlocker";

function Routing(props) {
  const { blogPosts, selectOpenLetter, selectHome, openRegisterDialog} = props;
  useLocationBlocker();
  return (
    <Switch>
      {blogPosts.map((post) => (
        <PropsRoute
          path={post.url}
          component={BlogPost}
          title={post.title}
          key={post.title}
          src={post.src}
          date={post.date}
          content={post.content}
          otherArticles={blogPosts.filter(
            (blogPost) => blogPost.id !== post.id
          )}
        />
      ))}
      <PropsRoute
        exact
        path="/blog"
        component={Blog}
        selectOpenLetter={selectOpenLetter}
        blogPosts={blogPosts}
      />
      <PropsRoute
        exact
        path="/verify-ok"
        component={VerifyOk}
      />
      <PropsRoute
        exact
        path="/verify-fail"
        component={VerifyFail}
      />
      <PropsRoute
        exact
        path="/email-verify-page"
        component={ResetPage}
      />
      <PropsRoute path="/" component={Home} selectHome={selectHome} openRegisterDialog={openRegisterDialog} />
    </Switch>
  );
}

export default memo(Routing);
