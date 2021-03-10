import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { withRoomContext } from '../../RoomContext';
import * as settingsActions from '../../actions/settingsActions';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { useIntl } from 'react-intl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

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

const AdvancedSettings = ({
	settings,
	onToggleAdvancedMode,
	onToggleNotificationSounds,
	classes
}) =>
{
	const intl = useIntl();

	return (
		<React.Fragment>
			<FormControlLabel
				className={classnames(classes.setting, classes.switchLabel)}
				control={<Switch checked={settings.advancedMode} onChange={onToggleAdvancedMode} value='advancedMode' />}
				labelPlacement='start'
				label={intl.formatMessage({
					id             : 'settings.advancedMode',
					defaultMessage : 'Advanced mode'
				})}
			/>
			<FormControlLabel
				className={classnames(classes.setting, classes.switchLabel)}
				control={<Switch checked={settings.notificationSounds} onChange={onToggleNotificationSounds} value='notificationSounds' />}
				labelPlacement='start'
				label={intl.formatMessage({
					id             : 'settings.notificationSounds',
					defaultMessage : 'Notification sounds'
				})}
			/>
		</React.Fragment>
	);
};

AdvancedSettings.propTypes =
{
	roomClient                 : PropTypes.any.isRequired,
	settings                   : PropTypes.object.isRequired,
	onToggleAdvancedMode       : PropTypes.func.isRequired,
	onToggleNotificationSounds : PropTypes.func.isRequired,
	classes                    : PropTypes.object.isRequired
};

const mapStateToProps = (state) =>
	({
		settings : state.settings
	});

const mapDispatchToProps = {
	onToggleAdvancedMode       : settingsActions.toggleAdvancedMode,
	onToggleNotificationSounds : settingsActions.toggleNotificationSounds
};

export default withRoomContext(connect(
	mapStateToProps,
	mapDispatchToProps,
	null,
	{
		areStatesEqual : (next, prev) =>
		{
			return (
				prev.settings === next.settings
			);
		}
	}
)(withStyles(styles)(AdvancedSettings)));