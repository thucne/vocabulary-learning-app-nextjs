import React from 'react';

import {
    Grid, Box, TextField,
    FormControl, Button, FormHelperText,
} from '@mui/material';

import { SXs } from '@styles';

const ListInput = ({
    temptField,
    formField,
    error = "",
    helperText,
    label,
    required,
    temptInput,
    handleChangeTemptInput,
    checkInputCriteria,
    clearTemptInputField,
    addToFormState
}) => (
    <React.Fragment>
        <Grid item xs={12}>
            <FormControl fullWidth error={error?.length > 0} required={required}>
                <Box sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                    width: "100%"
                }}>
                    <TextField
                        fullWidth
                        label={label}
                        size="small"
                        margin="dense"
                        error={error?.length > 0}
                        value={temptInput[temptField]}
                        sx={{ marginRight: "10px" }}
                        onChange={(e) => {
                            handleChangeTemptInput(e, temptField);
                            checkInputCriteria(e, formField);
                        }}
                    />
                    <Button
                        variant="outlined"
                        sx={{ mt: '8px', height: '40px', ...SXs.COMMON_BUTTON_STYLES }}
                        onClick={(e) => {
                            addToFormState(e, temptField, formField);
                            clearTemptInputField(temptField);
                        }}
                    >
                        Add
                    </Button>
                </Box>
                <FormHelperText>
                    {error || helperText || (required ? "Required field" : "Optional")}
                </FormHelperText>
            </FormControl>
        </Grid>
    </React.Fragment>
);

export default ListInput;