import React from 'react';
import { connect } from 'react-redux';
import * as appPropTypes from '../appPropTypes';
import { withStyles } from '@material-ui/core/styles';
import * as roomActions from '../../actions/roomActions';
import * as settingsActions from '../../actions/settingsActions';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { useIntl, FormattedMessage } from 'react-intl';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Select from '@material-ui/core/Select';
import Switch from '@material-ui/core/Switch';
import { withRoomContext } from '../../RoomContext';

const styles = (theme) =>
	({
		setting :
		{
			padding : theme.spacing(2)
		},
		formControl :
		{
			display : 'flex'
		},
		switchLabel : {
			justifyContent : 'space-between',
			flex           : 'auto',
			display        : 'flex',
			padding        : theme.spacing(1),
			marginRight    : 0
		}
	});

const AppearanceSettings = (props) =>
{
	const {
		roomClient,
		settings,
		onToggleShowNotifications,
		onToggleMirrorOwnVideo,
		handleChangeAspectRatio,
		classes
	} = props;

	const intl = useIntl();

	const aspectRatios = window.config.aspectRatios || [ {
		value : 1.333,
		label : '4 : 3'
	}, {
		value : 1.777,
		label : '16 : 9'
	} ];

	return (
		<React.Fragment>

			<FormControl className={classes.setting}>
				<Select
					value={settings.aspectRatio || ''}
					onChange={(event) =>
					{
						if (event.target.value)
						{
							handleChangeAspectRatio(event.target.value);
							roomClient.updateWebcam({ restart: true });
						}
					}}
					name={intl.formatMessage({
						id             : 'settings.aspectRatio',
						defaultMessage : 'Video aspect ratio'
					})}
					autoWidth
					className={classes.selectEmpty}
				>
					{ aspectRatios.map((aspectRatio, index) =>
					{
						return (
							<MenuItem key={index} value={aspectRatio.value}>
								{aspectRatio.label}
							</MenuItem>
						);
					})}
				</Select>
				<FormHelperText>
					<FormattedMessage
						id='settings.selectAspectRatio'
						defaultMessage='Select video aspect ratio'
					/>
				</FormHelperText>
			</FormControl>
			<FormControlLabel
				className={classnames(classes.setting, classes.switchLabel)}
				control={
					<Switch checked={settings.mirrorOwnVideo} onChange={onToggleMirrorOwnVideo} value='mirrorOwnVideo' />}
				labelPlacement='start'
				label={intl.formatMessage({
					id             : 'settings.mirrorOwnVideo',
					defaultMessage : 'Mirror view of own video'
				})}
			/>

			<FormControlLabel
				className={classnames(classes.setting, classes.switchLabel)}
				control={<Switch checked={settings.showNotifications} onChange={onToggleShowNotifications} value='showNotifications' />}
				labelPlacement='start'
				label={intl.formatMessage({
					id             : 'settings.showNotifications',
					defaultMessage : 'Show notifications'
				})}
			/>
		</React.Fragment>
	);
};

AppearanceSettings.propTypes =
{
	roomClient          				  : PropTypes.any.isRequired,
	isMobile                  : PropTypes.bool.isRequired,
	room                      : appPropTypes.Room.isRequired,
	settings                  : PropTypes.object.isRequired,
	onTogglePermanentTopBar   : PropTypes.func.isRequired,
	onToggleHiddenControls    : PropTypes.func.isRequired,
	onToggleButtonControlBar  : PropTypes.func.isRequired,
	onToggleShowNotifications : PropTypes.func.isRequired,
	onToggleDrawerOverlayed   : PropTypes.func.isRequired,
	onToggleMirrorOwnVideo    : PropTypes.func.isRequired,
	handleChangeMode          : PropTypes.func.isRequired,
	handleChangeAspectRatio   : PropTypes.func.isRequired,
	classes                   : PropTypes.object.isRequired,
	intl                      : PropTypes.object.isRequired
};

const mapStateToProps = (state) =>
	({
		isMobile : state.me.browser.platform === 'mobile',
		room     : state.room,
		settings : state.settings
	});

const mapDispatchToProps = {
	onTogglePermanentTopBar   : settingsActions.togglePermanentTopBar,
	onToggleHiddenControls    : settingsActions.toggleHiddenControls,
	onToggleShowNotifications : settingsActions.toggleShowNotifications,
	onToggleButtonControlBar  : settingsActions.toggleButtonControlBar,
	onToggleDrawerOverlayed   : settingsActions.toggleDrawerOverlayed,
	onToggleMirrorOwnVideo    : settingsActions.toggleMirrorOwnVideo,
	handleChangeMode          : roomActions.setDisplayMode,
	handleChangeAspectRatio   : settingsActions.setAspectRatio
};

export default withRoomContext(connect(
	mapStateToProps,
	mapDispatchToProps,
	null,
	{
		areStatesEqual : (next, prev) =>
		{
			return (
				prev.me.browser === next.me.browser &&
				prev.room === next.room &&
				prev.settings === next.settings
			);
		}
	}
)(withStyles(styles)(AppearanceSettings)));