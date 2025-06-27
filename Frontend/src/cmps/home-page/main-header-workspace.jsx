import { useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { BoardCreate } from '../board/board-create'
import { logout } from '../../store/user.actions.js'
import { UserMenu } from '../board/user-menu'

import { ReactComponent as DownSvg } from '../../assets/img/icons-header/down.svg'
import { ReactComponent as TeamspaceSvg } from '../../assets/img/icons-header/teamspace.svg'

export function MainHeaderWorkspace() {
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

    return (
        <header className="main-header-demo">
            <div className="logo-nav">
                {/* <button>
                    <AppsSvg />
                </button> */}

                <NavLink to="/" className="header-logo">
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

                {/* <button>
                    <HelpSvg />
                </button> */}

                {user && (
                    <button className="btn-member-img" onClick={openUserMenu}>
                        {/* <UserSvg /> */}
                        <img
                            className="member-img"
                            src={user.imgUrl}
                            alt={user.fullname}
                            style={{ borderRadius: '50%' }}
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
        </header>
    )
}