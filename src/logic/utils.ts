export const parseEnteredTime = (timeString: string | undefined) => {
    if (timeString !== undefined && !/^([01]?\d|2[0123])[:]?[012345]\d$/.test(timeString)) {
        return null;
    }
    const preParsedTimeString = timeString?.replaceAll(/[^\d]/g, "") ?? "";
    if (preParsedTimeString?.length >= 3) {
        const minutes = Number(preParsedTimeString.substring(preParsedTimeString.length - 2));
        const hours = Number(preParsedTimeString.substring(0, preParsedTimeString.length - 2));
        return {
            hours,
            minutes,
        };
    }
    return null;
};
