import Toastify from "toastify-js";
import { ERROR_CODE_TIME_CONFLICT, ERROR_CODE_TIME_EARLIER_THAN_LASTLOG } from "../constants";

// eslint-disable-next-line @typescript-eslint/ban-types
export const wrapInCatch = (fn: Function): void => {
    try {
        fn.call(this);
    } catch (error) {
        const errorMessage =
            {
                [ERROR_CODE_TIME_CONFLICT]:
                    "Log change would be earlier than the latest knwon change. It cannot be performed.",
                [ERROR_CODE_TIME_EARLIER_THAN_LASTLOG]: "Time could not be earlier than the latest start or stop.",
            }[(error as Error).message] ?? "Unknown error";
        Toastify({
            text: errorMessage,
            duration: 3000,
            gravity: "bottom",
            position: "right",
            className: "Toaster",
            selector: document.querySelector(".App") as Node,
        }).showToast();
    }
};
