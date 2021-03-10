import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = (theme) =>
	({
		root :
		{
			height : '100%',
			width  : '100%'
		},
		dialogPaper :
		{
			padding : theme.spacing(4)
		}
	});

const LoadingView = ({
	classes
}) =>
{
	return (
		<div className={classes.root}>
			<Dialog
				open
				classes={{
					paper : classes.dialogPaper
				}}
			>
				<CircularProgress color='secondary' />
			</Dialog>
		</div>
	);
};

export default withStyles(styles)(LoadingView);
