import React, { useEffect, useState } from "react";

export const Notification = ({ content }: { content: string }) => {
    let timeout: ReturnType<typeof setTimeout>;
    const [isVisible, setIsVisible] = useState(false);
    const hide = () => {
        document.removeEventListener("visibilitychange", hide);
        setIsVisible(false);
        clearTimeout(timeout);
    };

    useEffect(() => {
        setIsVisible(true);
        timeout = setTimeout(hide, 2000);
        document.addEventListener("visibilitychange", hide);
    }, [content]);

    return (
        <div id="notification" className={isVisible ? "show" : ""}>
            {content}
        </div>
    );
}
