import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ParticipantList from './ParticipantList/ParticipantList';
import CloseIcon from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import * as toolareaActions from '../../actions/toolareaActions';

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
		classes,
		closeToolArea
	} = props;

	return (
		<div className={classes.root}>
			<div style={{ textAlign: 'right' }}>
				<Button onClick={closeToolArea}>
					<CloseIcon />
				</Button>
			</div>
			<ParticipantList />
		</div>
	);
};
const mapDispatchToProps = (dispatch) =>
	({
		closeToolArea : () =>
		{
			dispatch(toolareaActions.closeToolArea());
		}
	});

MeetingDrawer.propTypes =
{
	classes       : PropTypes.object.isRequired,
	closeToolArea : PropTypes.func.isRequired
};

export default connect(
	null,
	mapDispatchToProps,
	null
)(withStyles(styles, { withTheme: true })(MeetingDrawer));
