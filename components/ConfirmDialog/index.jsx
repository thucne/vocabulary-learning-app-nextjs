import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { Colors, SXs } from '@styles';

import _ from 'lodash';

export default function FormDialog({ open, handleClose, data }) {
    return (
        <Dialog open={open} onClose={handleClose} sx={{
            '& .MuiPaper-root': {
                borderRadius: '10px',
                borderTop: `8px solid ${getColor(data?.type || 'info')}`,
            }
        }} fullWidth>
            <DialogTitle>{data?.title}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {data?.message}
                </DialogContentText>
                {data?.children}
            </DialogContent>
            <DialogActions>
                <Button
                    sx={{
                        ...SXs.COMMON_BUTTON_STYLES,
                        color: theme => theme.palette.grey[600],
                    }}
                    onClick={() => {
                        if (_.isFunction(data?.onClose)) {
                            data.onClose();
                        }
                        handleClose();
                    }}
                >
                    {data?.closeText || 'Cancel'}
                </Button>
                <Button
                    sx={{
                        ...SXs.COMMON_BUTTON_STYLES,
                        backgroundColor: getColor(data?.type || 'info'),
                        "&:hover": {
                            filter: `brightness(0.95)`,
                            backgroundColor: getColor(data?.type || 'info'),
                        }
                    }}
                    onClick={() => data.onNext()}
                    disabled={!data?.onNext || !_.isFunction(data?.onNext)}
                    variant="contained"
                    disableElevation
                >
                    {data?.nextText || 'Next'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

const getColor = (type) => {
    switch (type) {
        case 'info':
            return Colors.DIALOG_BLUE;
        case 'warning':
            return Colors.DIALOG_YELLOW;
        default:
            return Colors.DIALOG_RED;
    }
}
