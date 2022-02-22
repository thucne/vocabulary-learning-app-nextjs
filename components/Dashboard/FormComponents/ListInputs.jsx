import React from 'react';

import {
    Grid, Box, TextField,
    FormControl, Button, FormHelperText,
} from '@mui/material';

import { SXs } from '@styles';

const ListInput = ({
    temptField,
    formField,
    error = false,
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
            <FormControl fullWidth>
                <Box sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                    width: "100%"
                }}>
                    <TextField
                        fullWidth
                        required={required}
                        label={label}
                        size="small"
                        margin="dense"
                        value={temptInput[temptField]}
                        error={error}
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
                    {helperText || (required ? "Required field" : "Optional")}
                </FormHelperText>
            </FormControl>
        </Grid>
    </React.Fragment>
);

export default ListInput;