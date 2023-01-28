import App from "./components/app.svelte";
import { initializeTimeasrTick } from "./logic/view-tick";

import "./timeasrapp.scss";

if (Reflect.has(navigator, "serviceWorker")) {
    navigator.serviceWorker.register("/timeasrsw.js");
}
window.onload = function () {
    initializeTimeasrTick();
    new App({
        target: document.getElementById("svelte-container"),
    });
};
