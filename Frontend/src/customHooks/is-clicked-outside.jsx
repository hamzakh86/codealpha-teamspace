import { useEffect } from 'react'

export function useClickOutside(ref, callback) {
    useEffect(() => {
        function handleClick(ev) {
            if (ref.current && !ref.current.contains(ev.target)) {
                callback()
            }
        }
        document.addEventListener('mousedown', handleClick)
        return () => {
            document.removeEventListener('mousedown', handleClick)
        }
    }, [ref, callback])
}