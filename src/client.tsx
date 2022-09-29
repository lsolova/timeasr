import App from "./components/app.svelte";

import "./timeasrapp.scss";

window.onload = function () {
    new App({
        target: document.getElementById("svelte-container"),
    });
};
