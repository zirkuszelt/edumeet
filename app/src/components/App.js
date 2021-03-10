import React, { useEffect, Suspense } from 'react';
import { useParams } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import JoinDialog from './JoinDialog';
import LoadingView from './Loader/LoadingView';
import { LazyPreload } from './Loader/LazyPreload';
import * as settingsActions from '../actions/settingsActions';
import { withRoomContext } from '../RoomContext';

const Room = LazyPreload(() => import(/* webpackChunkName: "room" */ './Room'));

const urlParser = new URL(window.location);
const parameters = urlParser.searchParams;
const localeParam = parameters.get('locale');

const App = (props) =>
{
	const {
		room,
		roomClient,
		autoJoin,
		locale,
		disableAutoJoin
	} = props;

	const id = useParams().id.toLowerCase();

	useEffect(() =>
	{
		Room.preload();

		return;
	}, []);

	if (!room.joined)
	{
		if (localeParam && localeParam !== locale)
		{
			// eslint-disable-next-line no-console
			console.log(`set locale ${localeParam}`);
			roomClient.setLocale(localeParam);
		}

		if (autoJoin)
		{
			disableAutoJoin();
			roomClient.join({
				id : id
			});

		}

		return <div />;
	}
	else
	{
		return (
			<Suspense fallback={<LoadingView />}>
				<Room />
			</Suspense>
		);
	}
};

App.propTypes =
{
	room   : PropTypes.object.isRequired,
	locale : PropTypes.string.isRequired
};

const mapStateToProps = (state) =>
	({
		room     : state.room,
		autoJoin : state.settings.autoJoin,
		locale   : state.intl.locale
	});

const mapDispatchToProps = (dispatch) =>
{
	return {
		disableAutoJoin : () =>
		{
			dispatch(settingsActions.setAutoJoin(false));
		}

	};
};

export default withRoomContext(connect(
	mapStateToProps,
	mapDispatchToProps,
	null,
	{
		areStatesEqual : (next, prev) =>
		{
			return (
				prev.room === next.room
			);
		}
	}
)(App));