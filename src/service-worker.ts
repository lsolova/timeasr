type InstallEvent = {
    waitUntil: (fnResult: Promise<void>) => void;
} & Event;

const cacheResources = async (resources: string[]): Promise<void> => {
    const cache = await caches.open("v1");
    await cache.addAll(resources);
};

self.addEventListener("install", (event: InstallEvent) => {
    event.waitUntil(cacheResources(["/", "/index.html", "/timeasrapp.js", "/timeasrapp.css"]));
});
