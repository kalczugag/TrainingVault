export const capitalizeFirstLetter = <T extends string>(s: T) =>
    (s[0].toUpperCase() + s.slice(1)) as Capitalize<typeof s>;

export const omit = <T extends Record<string, any>, K extends keyof T>(
    obj: T,
    keys: K[],
) => {
    const { [keys[0]]: _, ...rest } = obj;
    return rest;
};
