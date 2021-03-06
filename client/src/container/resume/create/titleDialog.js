import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { TextField } from "@material-ui/core";
import Slide from "@material-ui/core/Slide";
import { PostResumeSchema } from "../../../utils/validation";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function TitleFieldDialog(props) {
  const { open, onclose, onsubmit } = props;

  const { t } = useTranslation();
  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(PostResumeSchema),
  });

  const handleClose = () => {
    if (onclose) onclose();
  };

  const onSubmit = (data) => {
    if (onsubmit) onsubmit(data);
  };

  return (
    <Dialog
      maxWidth="xs"
      fullWidth
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle style={{ paddingBottom: 0 }}>
        {t("resume.enterTitle")}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent style={{ paddingTop: 0 }}>
          <TextField
            fullWidth
            label={t("resume.titlePlaceholder")}
            name="title"
            inputRef={register}
          />
          {errors.title && <span>* {errors.title.message}</span>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            {t("resume.cancelButton")}
          </Button>
          <Button type="submit" color="primary">
            {t("resume.submit")}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
