import App from "./components/app.svelte";

import "./timeasrapp.scss";

if (Reflect.has(navigator, "serviceWorker")) {
    navigator.serviceWorker.register("/timeasrsw.js");
}
window.onload = function () {
    new App({
        target: document.getElementById("svelte-container") as Element,
    });
};
