import { GrSort } from 'react-icons/gr'
import { useSelector } from 'react-redux'
import { utilService } from '../../../services/util.service'

export function ActivityLog() {
	const board = useSelector((state) => state.boardModule.board)

	if (!board) return null

	return (
		<section className="board-activity-log">
			<p className="board-activity-log-header">Activity</p>

			{board.activities && board.activities.length !== 0 && (
				<ul className="clean-list board-activity-list">
					{board.activities.map((activity) => (
						<li className="board-activity-preview" key={activity.id}>
							<div className="member-img">
								<img
									src={activity.byMember?.imgUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${activity.byMember?.fullname || 'user'}`}
									referrerPolicy="no-referrer"
									alt="member"
								/>
							</div>
							<section className="board-activity-description">
								<p>
									<span className="username">{activity.byMember?.fullname || 'Membre'}</span>
									<span className="activity-txt">{activity.txt}</span>
								</p>
								<p className="time">
									{utilService.timeSince(activity.createdAt)}
								</p>
							</section>
						</li>
					))}
				</ul>
			)}
		</section>
	)
}
