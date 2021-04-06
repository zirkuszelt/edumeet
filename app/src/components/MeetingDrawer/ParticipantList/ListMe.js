import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { withRoomContext } from '../../../RoomContext';
import PropTypes from 'prop-types';
import * as appPropTypes from '../../appPropTypes';
import EmptyAvatar from '../../../images/avatar-empty.jpeg';

const styles = (theme) =>
	({
		root :
		{
			width    : '100%',
			overflow : 'hidden',
			cursor   : 'auto',
			display  : 'flex'
		},
		avatar :
		{
			borderRadius : '50%',
			height       : '2rem',
			marginTop    : theme.spacing(0.5)
		},
		peerInfo :
		{
			fontSize    : '1rem',
			display     : 'flex',
			paddingLeft : theme.spacing(1),
			flexGrow    : 1,
			alignItems  : 'center'
		},
		buttons :
		{
			padding : theme.spacing(1)
		},
		green :
		{
			color : 'rgba(0, 153, 0, 1)'
		}
	});

const ListMe = (props) =>
{
	const {
		me,
		settings,
		classes
	} = props;

	const picture = me.picture || EmptyAvatar;

	return (
		<div className={classes.root}>
			<img alt='My avatar' className={classes.avatar} src={picture} />

			<div className={classes.peerInfo}>
				{settings.displayName}
			</div>
		</div>
	);
};

ListMe.propTypes =
{
	roomClient : PropTypes.object.isRequired,
	me         : appPropTypes.Me.isRequired,
	settings   : PropTypes.object.isRequired,
	classes    : PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
	me       : state.me,
	settings : state.settings
});

export default withRoomContext(connect(
	mapStateToProps,
	null,
	null,
	{
		areStatesEqual : (next, prev) =>
		{
			return (
				prev.me === next.me &&
				prev.settings === next.settings
			);
		}
	}
)(withStyles(styles)(ListMe)));
