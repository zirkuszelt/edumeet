import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ParticipantList from './ParticipantList/ParticipantList';

const styles = (theme) =>
	({
		root :
		{
			display         : 'flex',
			flexDirection   : 'column',
			width           : '100%',
			height          : '100%',
			backgroundColor : theme.palette.background.paper
		},
		appBar :
		{
			display       : 'flex',
			flexDirection : 'row'
		},
		tabsHeader :
		{
			flexGrow : 1
		}
	});

const MeetingDrawer = (props) =>
{

	const {
		classes
	} = props;

	return (
		<div className={classes.root}>
			<ParticipantList />
		</div>
	);
};

MeetingDrawer.propTypes =
{
	classes : PropTypes.object.isRequired
};

export default connect(
	null,
	null,
	null
)(withStyles(styles, { withTheme: true })(MeetingDrawer));
