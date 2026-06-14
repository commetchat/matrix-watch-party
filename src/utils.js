function camelToKebab(str) {
    return str.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`);
}

export function applyMaterialTheme(scheme) {
    const root = document.documentElement;

    for (const [key, value] of Object.entries(scheme)) {
        if (key === "brightness") continue;

        let cssKey = `--md-sys-color-${camelToKebab(key)}`;

        console.log("Setting: ", cssKey)
        root.style.setProperty(
            cssKey,
            value
        );
    }
}

export function applySafeArea(safeArea) {
    console.log("Applying safe area!");
    console.log(safeArea);
    var parts = safeArea.split(",");


    console.log(parts)
    const root = document.documentElement;

    root.style.setProperty(`--safe-area-left`, parts[0]);
    root.style.setProperty(`--safe-area-top`, parts[1]);
    root.style.setProperty(`--safe-area-right`, parts[2]);
    root.style.setProperty(`--safe-area-bottom`, parts[3]);

}