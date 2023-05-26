import WebDAV, { YupSchema } from '@/components/Form/WebDAV';
import StyledMuiListItemButton from '@/components/Styled/MuiListItemButton';
import useWebDAVClient from '@/hooks/useWebDAVClient';
import {
  CheckCircleOutlineRounded,
  ErrorOutlineRounded,
  StorageRounded,
} from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ListItemIcon,
  ListItemText,
  Skeleton,
  Stack,
} from '@mui/material';
import { Form, Formik } from 'formik';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

const WebDAVSetting = () => {
  const { t } = useTranslation();
  const [{ info, error, loading: loadingWebDAV }, { setInfo }] =
    useWebDAVClient();
  const [openDialog, setOpenDialog] = useState(false);
  const handleClickItem = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);
  const handleSubmitSetting = (i: typeof info) => {
    setInfo(i);
    setOpenDialog(false);
  };

  const webDAVTitle = useMemo(() => {
    if (loadingWebDAV)
      return <Skeleton variant="rounded" animation="wave" width="50%" />;
    if (!info) return t('unsetting');
    const url = new URL(info?.url);
    return `${url.host}${url.pathname}`;
  }, [info, loadingWebDAV, t]);

  const webDAVSubtitle = useMemo(() => {
    if (loadingWebDAV)
      return (
        <Skeleton
          variant="rounded"
          animation="wave"
          width="30%"
          sx={{ mt: 1 }}
        />
      );
    return error ? error : info ? t('connected') : t('unsetting');
  }, [info, error, loadingWebDAV, t]);

  const webDAVIcon = loadingWebDAV ? undefined : error ? (
    <ErrorOutlineRounded color="error" />
  ) : info ? (
    <CheckCircleOutlineRounded color="success" />
  ) : undefined;

  return (
    <>
      <StyledMuiListItemButton
        onClick={handleClickItem}
        disabled={loadingWebDAV}>
        <ListItemIcon>
          <StorageRounded />
        </ListItemIcon>
        <ListItemText primary={webDAVTitle} secondary={webDAVSubtitle} />
        {webDAVIcon}
      </StyledMuiListItemButton>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{t('webDAV Configuration')}</DialogTitle>
        <Formik
          initialValues={{
            url: info?.url || '',
            dirBasePath: info?.dirBasePath || '',
            username: info?.username || '',
            password: info?.password || '',
          }}
          validationSchema={Yup.object(YupSchema)}
          // @ts-ignore
          onSubmit={(v: typeof info) => {
            if (!v?.url) handleSubmitSetting(undefined);
            else handleSubmitSetting(v);
          }}>
          <Form>
            <DialogContent>
              <Stack gap={2}>
                <WebDAV />
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button type="submit">{t('action.save')}</Button>
            </DialogActions>
          </Form>
        </Formik>
      </Dialog>
    </>
  );
};

export default WebDAVSetting;
