import { useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { BoardCreate } from '../board/board-create'
import { UserMenu } from '../board/user-menu'
import { logout } from '../../store/user.actions'
// import { boardService } from '../../services/board.service' // <-- Remove unused import

import { ReactComponent as DownSvg } from '../../assets/img/icons-header/down.svg'
import { ReactComponent as TeamspaceSvg } from '../../assets/img/icons-header/teamspace.svg'

export function MainHeader() {
    const board = useSelector((storeState) => storeState.boardModule.board)
    const [isBoardComposerOpen, setIsBoardComposerOpen] = useState(false)
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
    const user = useSelector((storeState) => storeState.userModule.user)
    const navigate = useNavigate()

    // for create modal
    const createBtn = useRef()
    const refDataBtn = createBtn

    // create board
    function openBoardComposer() {
        setIsBoardComposerOpen(true)
    }
    function closeBoardComposer() {
        setIsBoardComposerOpen(false)
    }

    // user
    function openUserMenu() {
        setIsUserMenuOpen(true)
        console.log(user)
    }
    function closeUserMenu() {
        setIsUserMenuOpen(false)
    }

    function onLogout() {
        logout()
        navigate(`/`)
    }

    function getHeaderStyle() {
        if (!board.style) return { backgroundColor: `#046AA7` }
        if (board?.style.backgroundColor) {
            return {
                backgroundColor: `${board.style.backgroundColor}`,
            }
        }
        return {
            backgroundColor: `#046AA7`,
        }
    }

    function getHeaderTxtStyle({ backgroundColor }) {
        var r = parseInt(backgroundColor.substring(1, 3), 16)
        var g = parseInt(backgroundColor.substring(3, 5), 16)
        var b = parseInt(backgroundColor.substring(5, 7), 16)
        var yiq = (r * 299 + g * 587 + b * 114) / 1000
        return yiq >= 160 ? 'light-bg' : 'dark-bg'
    }

    if (!board) return null

    const headerStyle = getHeaderStyle()
    const txtStyle = getHeaderTxtStyle(headerStyle)

    return (
        <header className={`main-header-${txtStyle}`} style={headerStyle}>
            <span className="fade">
                <div className="logo-nav">
                    {/* <button>
                    <AppsSvg />
                </button> */}

                    <NavLink to="/workspace" className="header-logo">
                        <TeamspaceSvg />
                        <h1 className="teamspace-logo">TeamSpace</h1>
                    </NavLink>

                    <NavLink to="/workspace">
                        <button className="nav-btn">
                            Boards
                            <DownSvg />
                        </button>
                    </NavLink>

                    {/* <button className="nav-btn">
                        Recent
                        <DownSvg />
                    </button> */}

                    <button className="nav-btn">
                        Starred
                        <DownSvg />
                    </button>

                    <button
                        className="create-btn"
                        onClick={openBoardComposer}
                        ref={createBtn}
                    >
                        Create
                        {/* <CreateSvg /> */}
                    </button>
                </div>

                <div className="left-nav">
                    {/* <button className="search">
                        <SearchSvg />
                        Search
                    </button> */}

                    {/* <button>
                        <NotificationSvg />
                    </button> */}
                    {/* 
                    <button>
                        <HelpSvg />
                    </button> */}

                    {user && (
                        <button className="btn-member-img" onClick={openUserMenu}>
                            {/* <UserSvg /> */}
                            <img
                                className="member-img"
                                src={user.imgUrl}
                                alt={user.fullname}
                            />
                        </button>
                    )}
                </div>
                {isBoardComposerOpen && (
                    <BoardCreate
                        closeBoardComposer={closeBoardComposer}
                        refDataBtn={refDataBtn}
                    />
                )}
                {user && isUserMenuOpen && (
                    <UserMenu
                        user={user}
                        onLogout={onLogout}
                        closeUserMenu={closeUserMenu}
                    />
                )}
            </span>
        </header>
    )
}