import * as React from "react";
// #FOLD_BLOCK
import { ViewState, EditingState, GroupingState, IntegratedGrouping } from "@devexpress/dx-react-scheduler";
// #FOLD_BLOCK
import {
	Scheduler,
	WeekView,
	DayView,
	MonthView,
	Appointments,
	Toolbar,
	DateNavigator,
	ViewSwitcher,
	AllDayPanel,
	AppointmentTooltip,
	AppointmentForm,
	GroupingPanel,
	Resources,
	EditRecurrenceMenu,
	ConfirmationDialog
} from "@devexpress/dx-react-scheduler-material-ui";
import { connectProps } from "@devexpress/dx-react-core";
import { styled, alpha } from "@mui/material/styles";
import PriorityHigh from "@mui/icons-material/PriorityHigh";
import LowPriority from "@mui/icons-material/LowPriority";
import Lens from "@mui/icons-material/Lens";
import Event from "@mui/icons-material/Event";
import AccessTime from "@mui/icons-material/AccessTime";
import Paper from "@mui/material/Paper";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import classNames from "clsx";


import { appointmentStatus, priorities } from "./demo-data/tasks";
import { data as tasks } from "./demo-data/grouping";
import { appointments } from './demo-data/appointments';
import { toast, ToastContainer } from "react-toastify";


import { BASE_URL } from "../config";

const grouping = [
	{
		resourceName: "priorityId",
	},
];

const filterTasks = (items, priorityId) =>
	items.filter((task) => !priorityId || task.priorityId === priorityId);

const getIconById = (id) => {
	if (id === 1) {
		return LowPriority;
	}
	if (id === 2) {
		return Event;
	}
	return PriorityHigh;
};

const PREFIX = "Scheduler";
// #FOLD_BLOCK
const classes = {
	flexibleSpace: `${PREFIX}-flexibleSpace`,
	prioritySelector: `${PREFIX}-prioritySelector`,
	content: `${PREFIX}-content`,
	contentContainer: `${PREFIX}-contentContainer`,
	text: `${PREFIX}-text`,
	title: `${PREFIX}-title`,
	icon: `${PREFIX}-icon`,
	contentItemIcon: `${PREFIX}-contentItemIcon`,
	grayIcon: `${PREFIX}-grayIcon`,
	colorfulContent: `${PREFIX}-colorfulContent`,
	lens: `${PREFIX}-lens`,
	textCenter: `${PREFIX}-textCenter`,
	dateAndTitle: `${PREFIX}-dateAndTitle`,
	titleContainer: `${PREFIX}-titleContainer`,
	container: `${PREFIX}-container`,
	bullet: `${PREFIX}-bullet`,
	prioritySelectorItem: `${PREFIX}-prioritySelectorItem`,
	priorityText: `${PREFIX}-priorityText`,
	priorityShortText: `${PREFIX}-priorityShortText`,
	cellLowPriority: `${PREFIX}-cellLowPriority`,
	cellMediumPriority: `${PREFIX}-cellMediumPriority`,
	cellHighPriority: `${PREFIX}-cellHighPriority`,
	headerCellLowPriority: `${PREFIX}-headerCellLowPriority`,
	headerCellMediumPriority: `${PREFIX}-headerCellMediumPriority`,
	headerCellHighPriority: `${PREFIX}-headerCellHighPriority`,
	additionalField: `${PREFIX}-additionalField`,
};
// #FOLD_BLOCK
const stylesByPriority = priorities.reduce(
	(acc, priority) => ({
		...acc,
		[`cell${priority.text.replace(" ", "")}`]: {
			backgroundColor: alpha(priority.color[400], 0.1),
			"&:hover": {
				backgroundColor: alpha(priority.color[400], 0.15),
			},
			"&:focus": {
				backgroundColor: alpha(priority.color[400], 0.2),
			},
		},
		[`headerCell${priority.text.replace(" ", "")}`]: {
			backgroundColor: alpha(priority.color[400], 0.1),
			"&:hover": {
				backgroundColor: alpha(priority.color[400], 0.1),
			},
			"&:focus": {
				backgroundColor: alpha(priority.color[400], 0.1),
			},
		},
	}),
	{}
);
// #FOLD_BLOCK
const groupingStyles = ({ theme }) => ({
	[`&.${classes.cellLowPriority}`]: stylesByPriority.cellLowPriority,
	[`&.${classes.cellMediumPriority}`]: stylesByPriority.cellMediumPriority,
	[`&.${classes.cellHighPriority}`]: stylesByPriority.cellHighPriority,
	[`&.${classes.headerCellLowPriority}`]: stylesByPriority.headerCellLowPriority,
	[`&.${classes.headerCellMediumPriority}`]: stylesByPriority.headerCellMediumPriority,
	[`&.${classes.headerCellHighPriority}`]: stylesByPriority.headerCellHighPriority,
	[`& .${classes.icon}`]: {
		paddingLeft: theme.spacing(1),
		verticalAlign: "middle",
	},
	[theme.breakpoints.down('sm')]: {
        [`& .Cell-text`]: {
            fontSize: "12px",
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
        },
		[`& .${classes.icon}`]: {
			paddingLeft: 0,
			width: "0.8em",
			height: "0.8em",
		},
    }
});

// #FOLD_BLOCK
const StyledToolbarFlexibleSpace = styled(Toolbar.FlexibleSpace)(() => ({
	[`&.${classes.flexibleSpace}`]: {
		margin: "0 auto 0 0",
	},
}));

const StyledFormControl = styled(FormControl)(({ theme: { spacing } }) => ({
	[`&.${classes.prioritySelector}`]: {
		minWidth: 140,
		marginLeft: spacing(2),
		"@media (max-width: 500px)": {
			minWidth: 0,
			fontSize: "0.75rem",
			marginLeft: spacing(0.5),
		},
	},
}));

// #FOLD_BLOCK
const StyledPrioritySelectorItem = styled("div")(({ theme: { palette, spacing }, color }) => ({
	[`& .${classes.bullet}`]: {
		backgroundColor: color ? color[400] : palette.divider,
		borderRadius: "50%",
		width: spacing(2),
		height: spacing(2),
		marginRight: spacing(2),
		display: "inline-block",
	},
	[`&.${classes.prioritySelectorItem}`]: {
		display: "flex",
		alignItems: "center",
	},
	[`& .${classes.priorityText}`]: {
		"@media (max-width: 500px)": {
			display: "none",
		},
	},
	[`& .${classes.priorityShortText}`]: {
		"@media (min-width: 500px)": {
			display: "none",
		},
	},
}));
// #FOLD_BLOCK
const StyledWeekViewTimeTableCell = styled(WeekView.TimeTableCell)(groupingStyles);
// #FOLD_BLOCK
const StyledTooltipContent = styled("div")(
	({ theme: { spacing, typography, palette }, color }, priority) => ({
		[`&.${classes.content}`]: {
			padding: spacing(3, 1),
			paddingTop: 0,
			backgroundColor: palette.background.paper,
			boxSizing: "border-box",
			width: "400px",
		},
		[`& .${classes.contentContainer}`]: {
			paddingBottom: spacing(1.5),
		},
		[`& .${classes.text}`]: {
			...typography.body2,
			display: "inline-block",
		},
		[`& .${classes.title}`]: {
			...typography.h6,
			color: palette.text.secondary,
			fontWeight: typography.fontWeightBold,
			overflow: "hidden",
			textOverflow: "ellipsis",
			whiteSpace: "normal",
		},
		[`& .${classes.icon}`]: {
			verticalAlign: "middle",
		},
		[`& .${classes.contentItemIcon}`]: {
			textAlign: "center",
		},
		[`& .${classes.grayIcon}`]: {
			color: palette.action.active,
		},
		// [`& .${classes.colorfulContent}`]: {
		// 	color: color[400],
		// },
		[`& .${classes.lens}`]: {
			width: spacing(4.5),
			height: spacing(4.5),
			verticalAlign: "super",
		},
		[`& .${classes.textCenter}`]: {
			textAlign: "center",
		},
		[`& .${classes.dateAndTitle}`]: {
			lineHeight: 1.1,
		},
		[`& .${classes.titleContainer}`]: {
			paddingBottom: spacing(2),
		},
		[`& .${classes.container}`]: {
			paddingBottom: spacing(1.5),
		},
	})
);

// #FOLD_BLOCK
const StyledDayViewDayScaleCell = styled(DayView.DayScaleCell)(groupingStyles);

const StyledWeekViewDayScaleCell = styled(WeekView.DayScaleCell)(groupingStyles);

const StyledAllDayPanelCell = styled(AllDayPanel.Cell)(groupingStyles);

const StyledGroupingPanelCell = styled(GroupingPanel.Cell)(groupingStyles);

const StyledDayViewTimeTableCell = styled(DayView.TimeTableCell)(groupingStyles);

const DayViewTimeTableCell = ({ groupingInfo, ...restProps }) => {
	const groupId = groupingInfo[0].id;
	return (
		<StyledDayViewTimeTableCell
			className={classNames({
				[classes.cellLowPriority]: groupId === 1,
				[classes.cellMediumPriority]: groupId === 2,
				[classes.cellHighPriority]: groupId === 3,
			})}
			groupingInfo={groupingInfo}
			{...restProps}
		/>
	);
};
// #FOLD_BLOCK
const DayViewDayScaleCell = ({
	groupingInfo,
	...restProps
	// #FOLD_BLOCK
}) => {
	const groupId = groupingInfo[0].id;
	return (
		<StyledDayViewDayScaleCell
			className={classNames({
				[classes.headerCellLowPriority]: groupId === 1,
				[classes.headerCellMediumPriority]: groupId === 2,
				[classes.headerCellHighPriority]: groupId === 3,
			})}
			groupingInfo={groupingInfo}
			{...restProps}
		/>
	);
};
// #FOLD_BLOCK
const WeekViewTimeTableCell = ({
	groupingInfo,
	...restProps
	// #FOLD_BLOCK
}) => {
	const groupId = groupingInfo[0].id;
	return (
		<StyledWeekViewTimeTableCell
			className={classNames({
				[classes.cellLowPriority]: groupId === 1,
				[classes.cellMediumPriority]: groupId === 2,
				[classes.cellHighPriority]: groupId === 3,
			})}
			groupingInfo={groupingInfo}
			{...restProps}
		/>
	);
};
// #FOLD_BLOCK
const WeekViewDayScaleCell = ({
	groupingInfo,
	...restProps
	// #FOLD_BLOCK
}) => {
	const groupId = groupingInfo[0].id;
	return (
		<StyledWeekViewDayScaleCell
			className={classNames({
				[classes.headerCellLowPriority]: groupId === 1,
				[classes.headerCellMediumPriority]: groupId === 2,
				[classes.headerCellHighPriority]: groupId === 3,
			})}
			groupingInfo={groupingInfo}
			{...restProps}
		/>
	);
};
// #FOLD_BLOCK
const AllDayCell = ({
	groupingInfo,
	...restProps
	// #FOLD_BLOCK
}) => {
	const groupId = groupingInfo[0].id;
	return (
		<StyledAllDayPanelCell
			className={classNames({
				[classes.cellLowPriority]: groupId === 1,
				[classes.cellMediumPriority]: groupId === 2,
				[classes.cellHighPriority]: groupId === 3,
			})}
			groupingInfo={groupingInfo}
			{...restProps}
		/>
	);
};
// #FOLD_BLOCK
const GroupingPanelCell = ({
	group,
	...restProps
	// #FOLD_BLOCK
}) => {
	const groupId = group.id;
	const Icon = getIconById(groupId);
	return (
		<StyledGroupingPanelCell
			className={classNames({
				[classes.headerCellLowPriority]: groupId === 1,
				[classes.headerCellMediumPriority]: groupId === 2,
				[classes.headerCellHighPriority]: groupId === 3,
			})}
			group={group}
			{...restProps}
		>
			<Icon className={classes.icon} />
		</StyledGroupingPanelCell>
	);
};

const PrioritySelectorItem = ({ color, text: resourceTitle }) => {
	const text = resourceTitle || "Alle Aufgaben";
	const shortText = resourceTitle ? text.substring(0, 1) : "All";

	return (
		<StyledPrioritySelectorItem className={classes.prioritySelectorItem} color={color}>
			<span className={classes.bullet} />
			<span className={classes.priorityText}>{text}</span>
			<span className={classes.priorityShortText}>{shortText}</span>
		</StyledPrioritySelectorItem>
	);
};

const PrioritySelector = ({ priorityChange, priority }) => {
	const currentPriority = priority > 0 ? priorities[priority - 1] : {};
	return (
		<StyledFormControl className={classes.prioritySelector} variant="standard">
			<Select
				disableUnderline
				value={priority}
				onChange={(e) => {
					priorityChange(e.target.value);
				}}
				renderValue={() => (
					<PrioritySelectorItem
						text={currentPriority.text}
						color={currentPriority.color}
					/>
				)}
			>
				<MenuItem value={0}>
					<PrioritySelectorItem />
				</MenuItem>
				{priorities.map(({ id, color, text }) => (
					<MenuItem value={id} key={id.toString()}>
						<PrioritySelectorItem color={color} text={text} />
					</MenuItem>
				))}
			</Select>
		</StyledFormControl>
	);
};

const FlexibleSpace = ({ priority, priorityChange, ...restProps }) => (
	<StyledToolbarFlexibleSpace {...restProps} className={classes.flexibleSpace}>
		<PrioritySelector priority={priority} priorityChange={priorityChange} />
	</StyledToolbarFlexibleSpace>
);

// #FOLD_BLOCK
const TooltipContent = ({
	appointmentData,
	formatDate,
	appointmentResources,
	// #FOLD_BLOCK
}) => {
	const resource = appointmentResources[0];
	let icon = <LowPriority className={classes.icon} />;
	if (appointmentData.priorityId === 2) {
		icon = <Event className={classes.icon} />;
	}
	if (appointmentData.priorityId === 3) {
		icon = <PriorityHigh className={classes.icon} />;
	}
	return (

		<StyledTooltipContent className={classes.content}>
			<Grid container alignItems="center" className={classes.titleContainer}>
				<Grid item xs={2} className={classNames(classes.textCenter)} display="flex" justifyContent="center">
					<Lens className={classNames(classes.lens, classes.colorfulContent)} />
				</Grid>
				<Grid item xs={10}>
					<div>
						<div className={classNames(classes.title, classes.dateAndTitle)}>
							{appointmentData.title}
						</div>
						{/* <div className={classNames(classes.text, classes.dateAndTitle)}>
							{formatDate(appointmentData.startDate, {
								day: "numeric",
								weekday: "long",
							})}
						</div> */}
					</div>
				</Grid>
			</Grid>
			<Grid container alignItems="center" className={classes.contentContainer}>
				<Grid item xs={2} className={classes.textCenter}>
					<AccessTime className={classes.icon} />
				</Grid>
				<Grid item xs={10}>
					<div className={classes.text}>
						{`${formatDate(appointmentData.startDate, {
							month: '2-digit',
							day: '2-digit',
							year: 'numeric',
							hour: '2-digit',
							minute: '2-digit',
							hour12: true
						})}
              			- ${formatDate(appointmentData.endDate, {
							month: '2-digit',
							day: '2-digit',
							year: 'numeric',
							hour: '2-digit',
							minute: '2-digit',
							hour12: true
						})}`}
					</div>
				</Grid>
			</Grid>
			<Grid container alignItems="center" key={`${resource.fieldName}_${resource.id}`}>
				<Grid
					className={classNames(
						classes.contentItemIcon,
						classes.icon,
						classes.colorfulContent
					)}
					item
					xs={2}
				>
					{icon}
				</Grid>
				<Grid item xs={10}>
					<span className={classNames(classes.text, classes.colorfulContent)}>
						{resource.text}
					</span>
				</Grid>
			</Grid>
		</StyledTooltipContent>
	);
};


export default class Calender extends React.PureComponent {

	constructor(props) {
		super(props);

		this.state = {
			user: JSON.parse(localStorage.getItem("user")),
			currentDate: new Date(),
			data: appointments,
			addedAppointment: {},
			appointmentChanges: {},
			editingAppointment: undefined,
			// data: tasks,
			currentPriority: 0,
			workers: [],
			selectedWorker: {},
			appointmentCurrentStatus: "",
			resources: [
				{
					fieldName: "priorityId",
					title: "Priorität",
					instances: priorities,
				},
				{
					fieldName: "appointmentStatus",
					title: "Terminstatus",
					instances: appointmentStatus,
				}
			],
		};
		this.priorityChange = (value) => {
			const { resources } = this.state;
			const nextResources = [
				{
					...resources[0],
					instances: value > 0 ? [priorities[value - 1]] : priorities,
				},
			];

			this.setState({ currentPriority: value, resources: nextResources });
		};
		this.flexibleSpace = connectProps(FlexibleSpace, () => {
			const { currentPriority } = this.state;
			return {
				priority: currentPriority,
				priorityChange: this.priorityChange,
			};
		});
		this.commitChanges = this.commitChanges.bind(this);
		this.changeAddedAppointment = this.changeAddedAppointment.bind(this);
		this.changeAppointmentChanges = this.changeAppointmentChanges.bind(this);
		this.changeEditingAppointment = this.changeEditingAppointment.bind(this);
		this.getAllAppointments = this.getAllAppointments.bind(this);
		this.fetchWorkers = this.fetchWorkers.bind(this);
	}

	handleSelectWorkerDropdown = (selectedOption) => {
		this.state({ selectedWorker: selectedOption });
	};

	async fetchWorkers() {
		// dispatch(setLoading(true));
		let { companyId } = this.props;
		fetch(`${BASE_URL}/worker/workers/${companyId}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${this.state.user.tokens.access.token}`,
			},
		})
			.then((res) => res.json())
			.then((data) => {
				const newResource = {
					fieldName: "workerId",
					title: "Arbeitskräfte",
					instances: data && data.length > 0 ? data.map((worker) => ({
						text: `${worker.firstName} ${worker.lastName}`,
						id: worker.id,
					})) : [],
				};
				this.setState(prevState => ({
					resources: [...prevState.resources, newResource]
				}));
			})

		// dispatch(setLoading(false));
	};

	changeAddedAppointment(addedAppointment) {
		this.setState({ addedAppointment });
	}

	changeAppointmentChanges(appointmentChanges) {
		this.setState({ appointmentChanges });
	}

	changeEditingAppointment(editingAppointment) {
		this.setState({ editingAppointment });
	}

	commitChanges({ added, changed, deleted }) {
		if (!this.validateForm(added, changed)) {
			return;
		}
		this.setState(async (state) => {
			let { data } = state;
			let { companyId } = this.props;
			const user = JSON.parse(localStorage.getItem("user"));
			if (added) {
				// dispatch(setLoading(true));

				const appointment = {
					// "selectCompany": "Name of company Who's id is selected",
					// "selectWorker": added.workerId,
					"workerId": added.workerId,
					"title": added.title,
					"priorityId": added.priorityId,
					"startDate": added.startDate,
					"endDate": added.endDate,
					"notes": added.notes,
					"appointmentStatus": added.appointmentStatus
				};

				const response = await fetch(`${BASE_URL}/calendar/${companyId}/appointment`, {
					method: "POST",
					body: JSON.stringify(appointment),
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${user.tokens.access.token}`,
					},
				});
				const json = await response.json();
				if (!response.ok) {
					// setError(json.error);
					// dispatch(setLoading(false));
				}
				if (response.ok) {
					// dispatch(setLoading(false));
					// const startingAddedId = data.length > 0 ? data[data.length - 1].id + 1 : 0;
					// data = [...data, { id: startingAddedId, ...added }];

					const notifyResponse = await fetch(`${BASE_URL}/notify/create`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${user.tokens.access.token}`,
						},
						body: JSON.stringify({
							isRead: false,
							message: `Created by ${user.user.name}`,
							heading: "Calendar",
							icon: "calendar",
							companyId: companyId,
							workerId: json.workerId
						}),
					});
					const notifyJson = await notifyResponse.json();

					if (!notifyResponse.ok) {
						console.error('Failed to create notification:', notifyJson.message);
					}

					this.getAllAppointments();
				}
			}
			if (changed) {
				const appointmentId = Object.keys(changed)[0];
				const appointment = {};

				if (changed[appointmentId].title) {
					appointment.title = changed[appointmentId].title;
				}
				if (changed[appointmentId].priorityId) {
					appointment.priorityId = changed[appointmentId].priorityId;
				}
				if (changed[appointmentId].startDate) {
					appointment.startDate = changed[appointmentId].startDate;
				}
				if (changed[appointmentId].endDate) {
					appointment.endDate = changed[appointmentId].endDate;
				}
				if (changed[appointmentId].notes) {
					appointment.notes = changed[appointmentId].notes;
				}
				if (changed[appointmentId].workerId) {
					appointment.workerId = changed[appointmentId].workerId;
				}
				if (changed[appointmentId].appointmentStatus) {
					appointment.appointmentStatus = changed[appointmentId].appointmentStatus;
				}

				const response = await fetch(`${BASE_URL}/calendar/${companyId}/appointments/${appointmentId}`, {
					method: "PATCH",
					body: JSON.stringify(appointment),
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${user.tokens.access.token}`,
					},
				});
				const json = await response.json();
				if (!response.ok) {
					// setError(json.error);
					// dispatch(setLoading(false));
				}
				if (response.ok) {
					// dispatch(setLoading(false));
					// const startingAddedId = data.length > 0 ? data[data.length - 1].id + 1 : 0;
					// data = [...data, { id: startingAddedId, ...added }];
					this.getAllAppointments();
				}

				// data = data.map(appointment => (
				// 	changed[appointment.id] ? { ...appointment, ...changed[appointment.id] } : appointment));
			}
			if (deleted !== undefined) {
				const response = await fetch(`${BASE_URL}/calendar/${companyId}/appointments/${deleted}`, {
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${user.tokens.access.token}`,
					},
				});
				// const json = await response.json();
				if (!response.ok) {
					// setError(json.error);
					// dispatch(setLoading(false));
				}
				if (response.ok) {
					// dispatch(setLoading(false));
					// const startingAddedId = data.length > 0 ? data[data.length - 1].id + 1 : 0;
					// data = [...data, { id: startingAddedId, ...added }];
					this.getAllAppointments();
				}

				// data = data.filter(appointment => appointment.id !== deleted);
			}
			return { data };
		});
	}


	async getAllAppointments() {
		const { companyId, workerId } = this.props;
		if (workerId) {
			const response = await fetch(`${BASE_URL}/calendar/${companyId}/worker/${workerId}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${this.state.user.tokens.access.token}`,
				},
			});
			const json = await response.json();
			if (!response.ok) {
				// setError(json.error);
				// dispatch(setLoading(false));
			}
			if (response.ok) {
				// dispatch(setLoading(false));
				this.setState({ data: json });
			}
		} else {
			const response = await fetch(`${BASE_URL}/calendar/appointments/${companyId}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${this.state.user.tokens.access.token}`,
				},
			});
			const json = await response.json();
			if (!response.ok) {
				// setError(json.error);
				// dispatch(setLoading(false));
			}
			if (response.ok) {
				// dispatch(setLoading(false));
				this.setState({ data: json });
			}
		}
	}

	componentDidMount() {
		this.getAllAppointments();
		this.fetchWorkers();
	}

	componentDidUpdate() {
		this.flexibleSpace.update(); // #IMPORTANT_LINE
	}

	handleSelectWorkerDropdown = (selectedOption) => {
		this.setState({ selectedWorker: selectedOption });
	};

	handleAppointmentChange = (event) => {
		this.setState({ appointmentCurrentStatus: event.target.value });
	};

	currentDateChange = currentDate => {
		this.setState({
			currentDate
		});
	};

	// Validation function
	validateForm = (added, changed) => {

		if (added) {
			// Validate the title field
			if (!added.title || added.title.trim() === "") {
				toast.error("Unable to add appointment. Title was empty.");
				return false;
			}

			// Validate the resources field
			if (!added.appointmentStatus || added.appointmentStatus.trim() === "") {
				toast.error("Unable to add appointment. Appointment Status was not selected.");
				return false;
			}
		} else if (changed) {
			const appointmentId = Object.keys(changed)[0];
			// Validate the title field
			if (changed[appointmentId].title && changed[appointmentId].title.trim() === "") {
				toast.error("Unable to add appointment. Title was empty.");
				return false;
			}

			// Validate the resources field
			if (changed[appointmentId].appointmentStatus && changed[appointmentId].appointmentStatus.trim() === "") {
				toast.error("Unable to add appointment. Appointment Status was not selected.");
				return false;
			}
		}

		// Return true if there are no validation errors
		return true;
	};


	render() {

		const { data, currentDate, currentPriority, resources, addedAppointment, appointmentChanges, editingAppointment, } = this.state;

		const BooleanEditor = props => {
			return <AppointmentForm.BooleanEditor {...props} readOnly />;
		};

		return (
			<>
				<Paper>
					<ToastContainer autoClose={8000} />
					<Scheduler data={filterTasks(data, currentPriority)} locale="de">
						<ViewState
							currentDate={currentDate}
							onCurrentDateChange={this.currentDateChange}
						/>
						<GroupingState grouping={grouping} />
						<EditingState
							onCommitChanges={this.commitChanges}
							addedAppointment={addedAppointment}
							onAddedAppointmentChange={this.changeAddedAppointment}
							appointmentChanges={appointmentChanges}
							onAppointmentChangesChange={this.changeAppointmentChanges}
							editingAppointment={editingAppointment}
							onEditingAppointmentChange={this.changeEditingAppointment}
						/>
						<DayView
							startDayHour={0}
							endDayHour={24}
							timeTableCellComponent={DayViewTimeTableCell}
							dayScaleCellComponent={DayViewDayScaleCell}
							intervalCount={2}
							name="Tag"
						/>
						<WeekView
							startDayHour={0}
							endDayHour={24}
							excludedDays={[0, 6]}
							name="Arbeitswoche"
							timeTableCellComponent={WeekViewTimeTableCell}
							dayScaleCellComponent={WeekViewDayScaleCell}
						/>
						<MonthView name="Monat" />
						<AllDayPanel cellComponent={AllDayCell} messages={{ allDay: 'Den ganzen Tag' }} />
						<EditRecurrenceMenu />
						<ConfirmationDialog messages={{
							discardButton: 'Verwerfen',
							cancelButton: 'Stornieren',
							deleteButton: 'Löschen',
							confirmDeleteMessage: 'Sind Sie sicher, dass Sie diesen Termin löschen möchten?',
							confirmCancelMessage: 'Nicht gespeicherte Änderungen verwerfen?',
							// ... you can customize other messages as well
						}} />
						<Appointments />
						<Resources data={resources} />
						<IntegratedGrouping />

						<GroupingPanel cellComponent={GroupingPanelCell} />
						<Toolbar flexibleSpaceComponent={this.flexibleSpace} />
						<DateNavigator />
						<ViewSwitcher />
						<AppointmentTooltip
							contentComponent={TooltipContent}
							showOpenButton
							showCloseButton
						/>
						<AppointmentForm
							booleanEditorComponent={BooleanEditor}
							onCommit={(args) => {
								if (validateForm()) {
									args.cancel = false; // Allow the form to be committed
								} else {
									args.cancel = true; // Prevent the form from being committed
								}
							}}
							messages={{
								detailsLabel: "Einzelheiten",
								moreInformationLabel: "Mehr Informationen",
								notesLabel: "Anmerkungen",
								titleLabel: "Titel",
								allDayLabel: "Den ganzen Tag",
								repeatLabel: "Wiederholen",
								commitCommand: "Speichern"
							}}
						/>
					</Scheduler>
				</Paper>
			</>
		);
	}
}