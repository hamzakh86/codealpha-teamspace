// import { NavLink } from 'react-router-dom'

import { AiFillGithub } from 'react-icons/ai'

export function HomePageFooter() {
    return (
        <footer className="homepage-footer">
            <small>
                Trello clone project by

                <a href="https://github.com/hamzakh86" target="_blank" rel="noreferrer">
                    <AiFillGithub className='git-icon' />
                </a>
            </small>
        </footer>
    )
}