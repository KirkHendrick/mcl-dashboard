import React, { useEffect, useState, useRef } from 'react';
import NavigationTree from "./NavigationTree/NavigationTree";
import DashItem from "./DashItem/DashItem";
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { connect } from "react-redux";
import { getPages } from '../redux/actions/pageActions';
import { getWidgets } from '../redux/actions/widgetActions';
import { startAutoRefresh, stopAutoRefresh } from "../redux/actions/refreshActions";
import { connectToWebSocket } from "../redux/actions/websocketActions";
import { openWidgetInModal } from "../redux/actions/widgetActions";
import { closeModal } from "../redux/actions/uiActions";
import GridLayout from 'react-grid-layout';
import localStorageApi from "../api/localStorageApi";
import styled from "styled-components";
import Header from "./Header";

function Dashboard(
	{
		getPages, getWidgets, closeModal,
		startAutoRefresh, stopAutoRefresh,
		connectToWebSocket, connected, ui, openWidgetInModal,
		pages, widgets, autoRefresh, ...props
	}) {
	// const [layout, setLayout] = useState({});
	const [selectedPage, setSelectedPage] = useState();
	const contentRef = useRef();
	// const [contentWidth, setContentWidth] = useState(0);

	useEffect(() => {
		connectToWebSocket();

		getPages();
		getWidgets();

	}, [getPages, getWidgets, connectToWebSocket]);

	useEffect(() => {
		let timeout;

		if (!connected) {
			reconnect();
		}

		function reconnect() {
			timeout = setTimeout(() => {
				if (!connected) {
					console.log('trying to reconnect...');
					connectToWebSocket();
					reconnect();
				} else {
					getPages();
					getWidgets();
				}
			}, 5000);
		}

		return () => clearTimeout(timeout);
		//eslint-disable-next-line
	}, [connected, connectToWebSocket]);

	useEffect(() => {
		if (contentRef) {
			// setContentWidth(contentRef.current.offsetWidth);
		}
	}, [contentRef]);

	useEffect(() => {
		if (pages && pages.length) {
			let page = pages.find(page => page.selected);

			const localLayout = localStorageApi.get(page.id);

			if (localLayout) {
				// setLayout(localLayout);
			}
			setSelectedPage(page);
		}

	}, [pages]);

	return (
		<>
			<Container>
				<ContentContainer>
					<NavigationTree/>
					<OverallContent>
						<Header />
						<MainContent ref={contentRef}>
							{selectedPage ?
								<GridLayout className="layout"
								            width={contentRef.current.offsetWidth}
								            cols={contentRef.current.offsetWidth * 0.005}>
									{selectedPage.widgets.map((w, widgetIndex) => {
										return <WidgetContainer key={widgetIndex}
										                        data-grid={getDataGrid(selectedPage, w, widgetIndex)}>
											<DashItem widget={w} key={widgetIndex}
											          componentProps={w.props} page={selectedPage}
											/>
										</WidgetContainer>
									})
									}
								</GridLayout> : <></>
							}
						</MainContent>
					</OverallContent>
				</ContentContainer>

			</Container>
		</>
	);

	// function onLayoutChange(pageId, lo) {
	// 	localStorageApi.set(pageId, lo);
	// 	setLayout(lo);
	// }

	function getDataGrid(page, widget, widgetIndex) {
		if (page && widget) {
			let sumWidths = page.widgets.slice(0, widgetIndex).reduce((sumWidth, wid) => {
				sumWidth += wid.width;
				return sumWidth;
			}, 0);

			let coords = {};
			if (widget.coordinates) {
				let coordsConfig = JSON.parse(widget.coordinates);
				if (coordsConfig[page.Name]) {
					coords = {
						...coords,
						x: coordsConfig[page.Name].x,
						y: coordsConfig[page.Name].y,
					}
				}
			}

			return {
				x: coords.x !== undefined ? coords.x : sumWidths,
				y: coords.y !== undefined ? coords.y : 0,

				w: widget.width,
				h: widget.height,
				isResizable: Boolean(widget.isResizable)
			};
		}

		return {
			x: widgetIndex, y: 0
		};
	}
}

const Container = styled.div`
	display: flex;
	flex-direction: column;
`;

// const WidgetGrid = styled.div`
// 	// display: flex;
// 	// flex-wrap: wrap;
// `;

const WidgetContainer = styled.div`
	// width: ${props => props.width * props.colSize}rem;
	// height: ${props => props.height * props.rowSize}rem;
	
	// margin-right: 1rem;
`;

const ContentContainer = styled.div`
	display: flex;
	height: 100vh;
	flex-basis: 10%;
`;

const OverallContent = styled.div`
	display: flex;
	flex-direction: column;

	flex-basis: 85%;
	margin-top: 10px;
	height: 100%;
	
	flex-grow: 1;
`;

const MainContent = styled.div`
	display: flex;
	flex-wrap: wrap;
	align-content: flex-start;
	flex-basis: 90%;
`;

// const SpinnerContainer = styled.div`
// 	height: 100%;
// 	transform: translate(0px, -1rem) scale(0.3);
// 	/*opacity: 0.3;*/
// `;

function mapStateToProps(state, ownProps) {
	return {
		loading: state.apiCallsInProgress > 0,
		autoRefresh: state.autoRefresh,
		pages: !state.widgets.length ? [] : state.pages.map(page => {
			return {
				...page,
				widgets: state.widgets.filter(widget => {
					if (!page['Widget Names']) {
						return false;
					}

					return page['Widget Names'].indexOf(widget.Name) >= 0;
				})
			}
		}),
		widgets: state.widgets,
		connected: state.socketConnection.connected,
		ui: state.ui
	};
}

const mapDispatchToProps = {
	getPages, getWidgets, startAutoRefresh, stopAutoRefresh,
	connectToWebSocket, openWidgetInModal, closeModal
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
