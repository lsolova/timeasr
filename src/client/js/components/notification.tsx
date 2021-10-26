import React, { useEffect, useState } from 'react';

function Notification({content}: {content: string}) {
    let timeout = null;
    const [isVisible, setIsVisible] = useState(false);
    const hide = () => {
        document.removeEventListener('visibilitychange', hide);
        setIsVisible(false);
        timeout = null;
    }

    useEffect(() => {
        setIsVisible(true);
        timeout = setTimeout(hide, 2000);
        document.addEventListener('visibilitychange', hide);
    }, [content]);
    return (
        <div id="notification" className={isVisible?'show':''}>{content}</div>
    )
}

export default Notification;
