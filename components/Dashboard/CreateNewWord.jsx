import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { LoadingButton } from "@mui/lab";
import { Send as SendIcon } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";

import {
	Grid,
	TextField,
	InputLabel,
	Select,
	MenuItem,
	FormControl,
	IconButton,
} from "@mui/material";

import { Fonts } from "@styles";

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: [400, 600],
	bgcolor: "background.paper",
	boxShadow: 24,
	borderRadius: "5px",
	textAlign: "center",
	p: 6,
};

const vocabTypes = ["vocab", "idiom", "phrase"];

export default function CreateNewWord({ open, setOpen }) {

	const [form, setForm] = useState({
		vip: "",
		type: vocabTypes[0],
		examples: "",
		meanings: "",
		pronounce: "",
	});

	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState({});
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log("submit", { form });
	};

	const handleChangeValue = (e, name) => {
		setForm((state) => ({ ...state, [name]: e.target.value }));
	};

	const handleChangeSelectTypeValue = (e) => {
		setForm((state) => ({ ...state, type: e.target.value }));
	};

	const handleUploadImage = e => {
		if (e.target.files && e.target.files[0]) {
			let reader = new FileReader();

			reader.onload = function (e) {
				setForm((state) => ({ ...state, illustration: e.target.result }));
			};
			reader.readAsDataURL(e.target.files[0]);
		}
	}

	const canSubmit = () =>
		(form.vip.length &&
			form.examples.length &&
			form.meanings.length &&
			form.pronounce.length &&
			!errors?.vip.error &&
			!errors?.examples.error &&
			!errors?.meanings.error &&
			!errors?.pronounce.error) ?? false;

	const checkInputCriteria = (e, name) => {
		setErrors(state => ({ ...state, [name]: e.target.value.length > 0 ? {} : { error: true, message: `${name} is required` } }))
	}
	return (
		<div>
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={style}>
					<Typography
						id="modal-modal-title"
						component="h2"
						sx={{ fontSize: Fonts.FS_34 }}
					>
						Create your own word!
					</Typography>

					<Box component="form" noValidate onSubmit={handleSubmit}>
						<Grid container spacing={2} sx={{ mt: 4 }}>
							<Grid item xs={12}>
								<TextField
									fullWidth
									label="Word"
									id="word"
									error={errors?.vip?.error}
									helperText={errors?.vip?.message}
									onChange={(e) => { handleChangeValue(e, "vip"); checkInputCriteria(e, "vip") }}
								/>
							</Grid>
							<Grid item xs={6}>
								<TextField
									fullWidth
									label="Pronouncs"
									id="pronounce"
									error={errors?.pronounce?.error}
									helperText={errors?.pronounce?.message}
									onChange={(e) => { handleChangeValue(e, "pronounce"); checkInputCriteria(e, "pronounce") }}
								/>
							</Grid>
							<Grid item xs={6}>
								<FormControl fullWidth>
									<InputLabel id="demo-simple-select-label">Type</InputLabel>
									<Select
										labelId="demo-simple-select-label"
										id="demo-simple-select"
										value={form.type}
										label="Type"
										onChange={handleChangeSelectTypeValue}
									>
										{vocabTypes.map((type, index) => (
											<MenuItem key={`${type}-${index}`} value={type}>
												{type}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Grid>
							<Grid item xs={12}>
								<TextField
									fullWidth
									label="Examples"
									multiline
									error={errors?.examples?.error}
									helperText={errors?.examples?.message}
									onChange={(e) => { handleChangeValue(e, "examples"); checkInputCriteria(e, "examples") }}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									fullWidth
									label="Meanings"
									multiline
									error={errors?.meanings?.error}
									helperText={errors?.meanings?.message}
									onChange={(e) => { handleChangeValue(e, "meanings"); checkInputCriteria(e, "meanings") }}
								/>
							</Grid>
							<Grid item xs={12}>
								<label htmlFor="image-upload">
									<IconButton variant="contained" component="label">
										<AddIcon disabled />
										<input
											id="image-upload"
											hidden
											type="file"
											onChange={handleUploadImage}
										/>
									</IconButton>
								</label>

							</Grid>
						</Grid>

						<LoadingButton
							type="submit"
							variant="contained"
							loadingPosition="start"
							sx={{
								"&.MuiLoadingButton-root": {
									textTransform: "none !important",
								},
								mt: 4,
							}}
							disabled={!canSubmit()}
							loading={loading}
							startIcon={<SendIcon />}
						>
							Create
						</LoadingButton>
					</Box>
				</Box>
			</Modal>
		</div>
	);
}
