import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { meProducersSelector } from '../Selectors';
import { withStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import classnames from 'classnames';
import * as appPropTypes from '../appPropTypes';
import { withRoomContext } from '../../RoomContext';
import { useIntl } from 'react-intl';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import VideoIcon from '@material-ui/icons/Videocam';
import VideoOffIcon from '@material-ui/icons/VideocamOff';
import ScreenIcon from '@material-ui/icons/ScreenShare';
import * as roomActions from '../../actions/roomActions';
import SettingsIcon from '@material-ui/icons/Settings';
import AppsIcon from '@material-ui/icons/Apps';
import { VideoLabel } from '@material-ui/icons';
const styles = (theme) =>
	({
		root :
		{
			position                     : 'fixed',
			display                      : 'flex',
			zIndex                       : 30,
			[theme.breakpoints.up('md')] :
			{
				top            : '50%',
				transform      : 'translate(0%, -50%)',
				flexDirection  : 'column',
				justifyContent : 'center',
				alignItems     : 'center',
				left           : theme.spacing(1)
			},
			[theme.breakpoints.down('sm')] :
			{
				flexDirection : 'row',
				bottom        : theme.spacing(1),
				left          : '50%',
				transform     : 'translate(-50%, -0%)'
			}
		},
		fab :
		{
			margin : theme.spacing(0.3)
		},
		show :
		{
			opacity    : 1,
			transition : 'opacity .5s'
		},
		hide :
		{
			opacity    : 0,
			transition : 'opacity .5s'
		},
		move :
		{
			left                           : '30vw',
			top                            : '50%',
			transform                      : 'translate(0%, -50%)',
			flexDirection                  : 'column',
			justifyContent                 : 'center',
			alignItems                     : 'center',
			[theme.breakpoints.down('lg')] :
			{
				left : '40vw'
			},
			[theme.breakpoints.down('md')] :
			{
				left : '50vw'
			},
			[theme.breakpoints.down('sm')] :
			{
				left : '70vw'
			},
			[theme.breakpoints.down('xs')] :
			{
				left : '90vw'
			}
		}
	});

const ButtonControlBar = (props) =>
{
	const intl = useIntl();

	const {
		roomClient,
		toolbarsVisible,
		hiddenControls,
		drawerOverlayed,
		toolAreaOpen,
		me,
		micProducer,
		webcamProducer,
		screenProducer,
		classes,
		theme,
		setSettingsOpen,
		currentMode,
		handleChangeMode
	} = props;

	let micState;

	let micTip;

	if (!me.canSendMic)
	{
		micState = 'unsupported';
		micTip = intl.formatMessage({
			id             : 'device.audioUnsupported',
			defaultMessage : 'Audio unsupported'
		});
	}
	else if (!micProducer)
	{
		micState = 'off';
		micTip = intl.formatMessage({
			id             : 'device.activateAudio',
			defaultMessage : 'Activate audio'
		});
	}
	else if (!micProducer.locallyPaused && !micProducer.remotelyPaused)
	{
		micState = 'on';
		micTip = intl.formatMessage({
			id             : 'device.muteAudio',
			defaultMessage : 'Mute audio'
		});
	}
	else
	{
		micState = 'muted';
		micTip = intl.formatMessage({
			id             : 'device.unMuteAudio',
			defaultMessage : 'Unmute audio'
		});
	}

	let webcamState;

	let webcamTip;

	if (!me.canSendWebcam)
	{
		webcamState = 'unsupported';
		webcamTip = intl.formatMessage({
			id             : 'device.videoUnsupported',
			defaultMessage : 'Video unsupported'
		});
	}
	else if (webcamProducer)
	{
		webcamState = 'on';
		webcamTip = intl.formatMessage({
			id             : 'device.stopVideo',
			defaultMessage : 'Stop video'
		});
	}
	else
	{
		webcamState = 'off';
		webcamTip = intl.formatMessage({
			id             : 'device.startVideo',
			defaultMessage : 'Start video'
		});
	}

	let screenState;

	let screenTip;

	if (!me.canShareScreen)
	{
		screenState = 'unsupported';
		screenTip = intl.formatMessage({
			id             : 'device.screenSharingUnsupported',
			defaultMessage : 'Screen sharing not supported'
		});
	}
	else if (screenProducer)
	{
		screenState = 'on';
		screenTip = intl.formatMessage({
			id             : 'device.stopScreenSharing',
			defaultMessage : 'Stop screen sharing'
		});
	}
	else
	{
		screenState = 'off';
		screenTip = intl.formatMessage({
			id             : 'device.startScreenSharing',
			defaultMessage : 'Start screen sharing'
		});
	}

	const settingsTip = intl.formatMessage({
		id             : 'tooltip.settings',
		defaultMessage : 'Show settings'
	});

	// eslint-disable-next-line no-console
	console.log('theme', theme.breakpoints);
	const smallScreen = useMediaQuery(theme.breakpoints.down('xs'));

	// eslint-disable-next-line no-console
	console.log('isSmallScreen', smallScreen);

	const modeTip = currentMode === 'filmstrip' ? intl.formatMessage({
		id             : 'label.democratic',
		defaultMessage : 'Democratic view'
	}) : intl.formatMessage({
		id             : 'label.filmstrip',
		defaultMessage : 'Filmstrip view'
	});

	return (
		<div
			className={
				classnames(
					classes.root,
					hiddenControls ?
						(toolbarsVisible ? classes.show : classes.hide) :
						classes.show,
					toolAreaOpen &&
						(me.browser.platform !== 'mobile' && !drawerOverlayed) ?
						classes.move : null
				)
			}
		>
			<Tooltip title={micTip} placement={smallScreen ? 'top' : 'right'}>
				<Fab
					aria-label={intl.formatMessage({
						id             : 'device.muteAudio',
						defaultMessage : 'Mute audio'
					})}
					className={classes.fab}
					disabled={!me.canSendMic || me.audioInProgress}
					color={micState === 'on' ? 'primary' : 'secondary'}
					size='small'
					onClick={() =>
					{
						if (micState === 'off')
							roomClient.updateMic({ start: true });
						else if (micState === 'on')
							roomClient.muteMic();
						else
							roomClient.unmuteMic();
					}}
				>
					{ micState === 'on' ?
						<MicIcon />
						:
						<MicOffIcon />
					}
				</Fab>
			</Tooltip>
			<Tooltip title={webcamTip} placement={smallScreen ? 'top' : 'right'}>
				<Fab
					aria-label={intl.formatMessage({
						id             : 'device.startVideo',
						defaultMessage : 'Start video'
					})}
					className={classes.fab}
					disabled={!me.canSendWebcam || me.webcamInProgress}
					color={webcamState === 'on' ? 'primary' : 'secondary'}
					size='small'
					onClick={() =>
					{
						webcamState === 'on' ?
							roomClient.disableWebcam() :
							roomClient.updateWebcam({ start: true });
					}}
				>
					{ webcamState === 'on' ?
						<VideoIcon />
						:
						<VideoOffIcon />
					}
				</Fab>
			</Tooltip>
			{ me.browser.platform !== 'mobile' && !smallScreen &&
				<Tooltip title={screenTip} placement={smallScreen ? 'top' : 'right'}>
					<Fab
						aria-label={intl.formatMessage({
							id             : 'device.startScreenSharing',
							defaultMessage : 'Start screen sharing'
						})}
						className={classes.fab}
						disabled={!me.canShareScreen || me.screenShareInProgress}
						color={screenState === 'on' ? 'primary' : 'secondary'}
						size='small'
						onClick={() =>
						{
							if (screenState === 'off')
								roomClient.updateScreenSharing({ start: true });
							else if (screenState === 'on')
								roomClient.disableScreenSharing();
						}}
					>
						<ScreenIcon/>
					</Fab>
				</Tooltip>
			}
			{
				!smallScreen && <Tooltip title={modeTip} placement={smallScreen ? 'top' : 'right'}>
					<Fab
						aria-label={modeTip}
						className={classes.fab}
						size='small'
						onClick={() =>
						{
							if (currentMode === 'filmstrip')
							{
								handleChangeMode('democratic');
							}
							else
							{
								handleChangeMode('filmstrip');
							}
						}}
					>
						{
							currentMode === 'filmstrip' ? <AppsIcon /> : <VideoLabel />
						}
					</Fab>
				</Tooltip>
			}

			{
				!smallScreen && <Tooltip title={settingsTip} placement={smallScreen ? 'top' : 'right'}>
					<Fab
						aria-label={settingsTip}
						className={classes.fab}
						size='small'
						onClick={() =>
						{
							setSettingsOpen(true);
						}}
					>
						<SettingsIcon />
					</Fab>
				</Tooltip>
			}
		</div>
	);
};

ButtonControlBar.propTypes =
{
	roomClient       : PropTypes.any.isRequired,
	toolbarsVisible  : PropTypes.bool.isRequired,
	hiddenControls   : PropTypes.bool.isRequired,
	drawerOverlayed  : PropTypes.bool.isRequired,
	toolAreaOpen     : PropTypes.bool.isRequired,
	me               : appPropTypes.Me.isRequired,
	micProducer      : appPropTypes.Producer,
	webcamProducer   : appPropTypes.Producer,
	screenProducer   : appPropTypes.Producer,
	classes          : PropTypes.object.isRequired,
	theme            : PropTypes.object.isRequired,
	setSettingsOpen  : PropTypes.func.isRequired,
	currentMode      : PropTypes.bool.isRequired,
	handleChangeMode : PropTypes.func.isRequired
};

const mapStateToProps = (state) =>
	({
		toolbarsVisible : state.room.toolbarsVisible,
		hiddenControls  : state.settings.hiddenControls,
		drawerOverlayed : state.settings.drawerOverlayed,
		currentMode     : state.room.mode,
		toolAreaOpen    : state.toolarea.toolAreaOpen,
		...meProducersSelector(state),
		me              : state.me
	});

const mapDispatchToProps = (dispatch) =>
	({

		setSettingsOpen : (settingsOpen) =>
		{
			dispatch(roomActions.setSettingsOpen(settingsOpen));
		},
		handleChangeMode : (target) =>
		{
			dispatch(roomActions.setDisplayMode(target));
		}
	});

export default withRoomContext(connect(
	mapStateToProps,
	mapDispatchToProps,
	null,
	{
		areStatesEqual : (next, prev) =>
		{
			return (
				Math.round(prev.peerVolumes[prev.me.id]) ===
				Math.round(next.peerVolumes[prev.me.id]) &&
				prev.room.toolbarsVisible === next.room.toolbarsVisible &&
				prev.room.mode === next.room.mode &&
				prev.settings.hiddenControls === next.settings.hiddenControls &&
				prev.settings.drawerOverlayed === next.settings.drawerOverlayed &&
				prev.toolarea.toolAreaOpen === next.toolarea.toolAreaOpen &&
				prev.producers === next.producers &&
				prev.me === next.me
			);
		}
	}
)(withStyles(styles, { withTheme: true })(ButtonControlBar)));