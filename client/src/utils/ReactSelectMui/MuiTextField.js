import React from "react";
import { TextField, InputAdornment } from "@mui/material";

function MuiTextField({
	clearValue,
	getStyles,
	getClassNames,
	getValue,
	hasValue,
	isMulti,
	isRtl,
	selectOption,
	selectProps,
	setValue,
	innerRef,
	isDisabled,
	isHidden,
	theme,
	cx,
	selectedDropdown,
	...rest
}) {
	return (
		<>
			<TextField
				fullWidth
				{...rest}
				variant="outlined"
				InputProps={{
					startAdornment: selectedDropdown && (
						<InputAdornment
							position="start"
							sx={{
								"&.MuiInputAdornment-root": {
									"& .MuiTypography-root": {
										color: "#262626",
									},
								},
							}}
						>
							{selectedDropdown}
						</InputAdornment>
					),
				}}
			/>
		</>
	);
}

export default MuiTextField;
