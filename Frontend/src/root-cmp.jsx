import React from 'react'
import { Routes, Route } from 'react-router'

import { AppHeader } from '../src/cmps/home-page/app-header'
import { HomePage } from './pages/home-page'
import { Workspace } from './pages/workspace'
import { Board } from './pages/board'
import { TaskDetails } from './pages/task-details'
import { LoginSignup } from './pages/login-signup'
import { WatchDemo } from './pages/watch-demo'

export function RootCmp() {
	return (
		<section className="app">
			<AppHeader />

			<main className="app-main">
				<Routes>

					<Route element={<HomePage />} path="/" />
					<Route path="/:status" element={<LoginSignup />} />
					<Route element={<Workspace />} path="/workspace" />
					<Route element={<WatchDemo />} path="/watch-demo" />
					<Route element={<Board />} path="/board/:boardId">
						<Route
							element={<TaskDetails />}
							path="/board/:boardId/:groupId/:taskId"
						/>
					</Route>
					{/* <Route element={<HomePage />} path="/" /> */}

				</Routes>
			</main>
		</section>
	)
}
