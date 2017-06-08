import { clearAndFill } from '../utils/dom';

let isVisible = false,
    hideTimeoutID;

function hideOnDocumentHiding() {
    if (document.hidden) {
        hideNotification();
    }
}

function getElement() {
    return document.getElementById('notification');
}

function hideNotification() {
    if (isVisible) {
        getElement().classList.remove('show');
        isVisible = false;

        if (hideTimeoutID) {
            window.clearTimeout(hideTimeoutID);
            hideTimeoutID = undefined;
        }
        document.removeEventListener('visibilitychange', hideOnDocumentHiding);
    }
}

export function showNotification(content) {
    if (content) {
        let notificationElement = getElement();
        clearAndFill.call(notificationElement, content);
        notificationElement.classList.add('show');
        isVisible = true;

        hideTimeoutID = window.setTimeout(hideNotification, 2000);
        document.addEventListener('visibilitychange', hideOnDocumentHiding);
    }
}
