import { createPopper } from "@popperjs/core";

type TooltipActionProps = { contentId: string; stopPropagation: boolean; visibilityClass: string };

export function tooltip(node: Element, { contentId, stopPropagation, visibilityClass }: TooltipActionProps) {
    const content = document.getElementById(contentId);

    let closeTimeout: ReturnType<typeof setTimeout>;
    let popperInstance: ReturnType<typeof createPopper> | null = null;

    const showTooltip = () => {
        clearTimeout(closeTimeout);
        if (content) {
            content.classList.add(visibilityClass);
            popperInstance = createPopper(node, content, {
                placement: "top",
                modifiers: [
                    {
                        name: "arrow",
                        options: {
                            padding: 10,
                            offset: [10, 10],
                        },
                    },
                    {
                        name: "offset",
                        options: {
                            offset: [10, 10],
                        },
                    },
                ],
            });
            closeTimeout = setTimeout(() => {
                hideTooltip();
            }, 5000);
        }
    };

    const hideTooltip = () => {
        clearTimeout(closeTimeout);
        if (content) {
            content.classList.remove(visibilityClass);
            popperInstance?.destroy();
            popperInstance = null;
        }
    };

    const toggle = (event: Event) => {
        if (stopPropagation !== false) {
            event.stopPropagation();
        }
        popperInstance === null ? showTooltip() : hideTooltip();
    };

    node.addEventListener("click", toggle);
    node.addEventListener("mouseover", showTooltip);
    node.addEventListener("mouseout", hideTooltip);
}
