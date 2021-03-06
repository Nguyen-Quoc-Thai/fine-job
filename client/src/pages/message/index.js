import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useSelector, useDispatch } from "react-redux";
import { Container, Grid, useMediaQuery } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import { getAllMessages, getMessage } from "../../actions/messageActions";
import MessageList from "../../container/message/pageContainer/messageList";
import MessageDetail from "../../container/message/pageContainer/messageDetail";
import MessageDialog from "../../container/message/dialog";

function MessagePage() {
  const myInfo = useSelector((state) => state.auth.user);
  const messageState = useSelector((state) => state.message);
  const messages = messageState.messages;
  const message = messageState.message;

  const theme = useTheme();
  const messageDialogAllow = useMediaQuery(theme.breakpoints.down("sm"));
  const messageGridAllow = useMediaQuery(theme.breakpoints.up("sm"));

  const [messageDialogShow, setMessageDialogShow] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllMessages());
  }, [dispatch, message]);

  const handleMessageClick = (partnerID) => {
    dispatch(getMessage(partnerID, 1));
    setMessageDialogShow(true);
  };

  return (
    <>
      <Helmet>
        <html lang="en" />
        <title>Message | Fine Job</title>
      </Helmet>

      <Container
        style={{
          height: "70vh",
          padding: 0,
          backgroundColor: "white",
          boxShadow: "0 3px 8px rgba(0, 0, 0, 0.15)",
        }}
      >
        <Grid container style={{ height: "100%" }}>
          <Grid
            item
            xs={12}
            md={6}
            style={{ height: "100%", borderRight: "2px solid #F4F4F4" }}
          >
            <MessageList
              messages={messages}
              onMessageClick={handleMessageClick}
              jobSelectHightLight={messageGridAllow}
            />
          </Grid>

          {messageGridAllow && (
            <Grid item md style={{ height: "100%" }}>
              <MessageDetail myInfo={myInfo} message={message} />
            </Grid>
          )}

          {messageDialogAllow && (
            <MessageDialog
              myInfo={myInfo}
              show={messageDialogShow && messageDialogAllow}
              message={message}
              close={() => setMessageDialogShow(false)}
            />
          )}
        </Grid>
      </Container>
    </>
  );
}

export default MessagePage;
