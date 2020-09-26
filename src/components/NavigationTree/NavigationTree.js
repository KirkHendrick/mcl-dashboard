import React, { useEffect, useState } from 'react';
import './NavigationTree.css'
import { NavLink } from "react-router-dom";
import { getPages, selectPage } from "../../redux/actions/pageActions";
import { ReactComponent as MenuIcon } from '../../resources/menu-24px.svg';
import { connect } from "react-redux";
import styled from "styled-components";

function NavigationTree({pages, selectPage, ...props}) {
	const [renderedPages, setRenderedPages] = useState([]);
	const [hidden, setHidden] = useState(false);

	useEffect(() => {
		if (pages.length) {
			const pageMap = pages.filter(p => p.Active).reduce((pageMap, page) => {
					if (page.Subpages) {
						pageMap.directories.push({
							page,
							subPages: []
						});
					} else {
						pageMap.pages.push(page);
					}

					return pageMap;
				}, {
					pages: [],
					directories: []
				}
			);

			const directories = pageMap.directories.map(dir => {
				return {
					...dir.page,
					subPages: pageMap.pages.filter(page => {
						return dir.page['Subpage Names'].indexOf(page.Name) >= 0
					}),
					isDir: true
				};
			});

			const plainPages = pageMap.pages.filter(page => {
				let notDirectory = true;

				if (page.Subpages) {
					notDirectory = false;
				}

				directories.forEach(dir => {
					if (dir['Subpage Names'].indexOf(page.Name) >= 0) {
						notDirectory = false;
					}
				});

				return notDirectory;
			});

			setRenderedPages(plainPages.concat(directories));
		}
	}, [pages]);

	return (
		<>
			<Sidebar hidden={hidden}>
				<MenuIconContainer onClick={() => setHidden(!hidden)}>
					<MenuIcon/>
				</MenuIconContainer>
				{renderedPages.map(page => {
					return <div key={page.Name} className='nav-item'>
						{!page.isDir ?
							<div className='nav-item-link'>
								<NavLink to={page.Route} className='' exact
								         activeClassName='selected'
								         onClick={() => selectPage(page)}
								>{page.Name}</NavLink>
							</div> :
							<div className='nav-item-directory'>
								<div className='nav-item-directory-name' onClick={() => toggleDirectory()}>
									{page.Name}
								</div>
								{page.subPages.map(subPage => {
									return <div className='sub-nav-item-link' key={subPage.Name}>
										<NavLink to={subPage.Route} className='' exact
										         activeClassName='selected'
										         onClick={() => selectPage(subPage)}
										>{subPage.Name}
										</NavLink>
									</div>
								})}
							</div>
						}
					</div>
				})}
			</Sidebar>
		</>
	);

	function toggleDirectory(page) {
		debugger;
	}
}

// const Container = styled.div`
// 	display: flex;
// 	flex-direction: column;
// 	height: 100%;
// 	overflow: hidden;
// `;

const Sidebar = styled.div`
	margin-right: 10px;
	margin-top: 10px;
	display: flex;
	flex-direction: column;

	height: 100%;
	background-color: #353535;
	border-radius: 4px;
	box-shadow: 0 3px 4px rgba(0, 0, 0, 1);
	
	flex-basis: ${props => props.hidden ? 1.5 : 15}%;
	width: ${props => props.hidden ? '2rem' : 'unset'};
	transition: width 10s ease-in-out;
	overflow: hidden;
`;

const MenuIconContainer = styled.div`
	cursor: pointer;	
	padding-left: .2rem;
	padding-top: .2rem;
`;

function mapStateToProps(state, ownProps) {
	return {
		pages: state.pages
	}
}

const mapDispatchToProps = {
	getPages, selectPage
};

export default connect(mapStateToProps, mapDispatchToProps)(NavigationTree);
