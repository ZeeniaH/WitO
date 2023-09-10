import React, { useEffect } from "react";
import ReactSelect from "react-select";
import MuiTextField from "./MuiTextField";

function ReactSelectMui({ options, handleSelectDropdown, selectedDropdown, label }) {
	return (
		<>
			<ReactSelect
				placeholder=""
				options={options}
				components={{
					Input: (props) => (
						<MuiTextField
							label={label}
							selectedDropdown={selectedDropdown && selectedDropdown.label}
							{...props}
						/>
					),
					DropdownIndicator: () => null,
					IndicatorSeparator: () => null,
				}}
				onChange={handleSelectDropdown}
				value={selectedDropdown}
				menuPortalTarget={document.body}
				styles={{
					menuPortal: (base) => ({
						...base,
						zIndex: 9999,
					}),
					valueContainer: (provided, state) => ({
						...provided,
						display: "flex",
						flexDirection: "column",
						alignItems: "flex-start",
						padding: 0,
						overflow: "visible",
					}),
					singleValue: (provided, state) => ({
						...provided,
						display: "none",
					}),
					control: (provided, state) => ({
						...provided,
						backgroundColor: "transparent",
						border: "none",
						boxShadow: "none",
					}),
				}}
			/>
		</>
	);
}

export default ReactSelectMui;
