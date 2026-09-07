namespace PaletteIndexViewer {

    const WINDOW_CLASS = 'devtools.window.paletteindexviewer';

    export function register() {
        ui.registerMenuItem('Palette index viewer', () => {
            getOrOpen();
        });
    }

    export function getOrOpen() {
        const w = ui.getWindow(WINDOW_CLASS);
        if (w) {
            w.bringToFront();
        } else {
            open();
        }
    }

    function open() {

        const TITLEBAR_OFFSET = 30;

        const SIZE = 14;
        const SPACING = 7;

        const COL_AMOUNT = 12;
        const ROW_AMOUNT = Math.ceil(256 / COL_AMOUNT);

        const WIDGET_DIMENSION = (SIZE * 2);

        const WIDTH = (COL_AMOUNT * (SIZE + SPACING)) + (SPACING * 2);
        const HEIGHT = ROW_AMOUNT * WIDGET_DIMENSION + TITLEBAR_OFFSET;

        const window = ui.openWindow({
            classification: WINDOW_CLASS,
            title: "Palette index viewer",
            width: WIDTH,
            height: HEIGHT,
            widgets: createWidgets(),
        });

        function createWidgets(): WidgetDesc[] {
            let stopGeneration = false;

            const widgets: WidgetDesc[] = [];

            for (let row = 0; row < ROW_AMOUNT; row++) {
                if (stopGeneration) break;

                const maxCols = (row === 0) ? COL_AMOUNT - 2 : COL_AMOUNT;

                for (let col = 0; col < maxCols; col++) {
                    
                    // top row condition
                    const colourIndex = (row === 0)
                        ? (row * COL_AMOUNT) + col
                        : (row * COL_AMOUNT) + col - 2;

                    if (colourIndex > 255) {
                        stopGeneration = true;
                        break;
                    }

                    const displayCol = (colourIndex < 10) ? col + 2 : col;

                    widgets.push({
                        type: "custom",
                        x: displayCol * (SIZE + SPACING) + SPACING,
                        y: row * (SIZE * 2) + (SPACING * 2) + SPACING,
                        width: (SIZE * 2) + 1,
                        height: (SIZE * 2) + 1,
                        tooltip: `${colourIndex}`,
                        onDraw: function (g) {
                            g.colour = 2,
                            g.text(`{TINYFONT}${colourIndex}`, 0, 0)
                            g.stroke = 10
                            g.fill = colourIndex;
                            g.rect(0, SIZE - SPACING + 1, SIZE, SIZE);
                        },
                    })
                }
            }
            return widgets;
        }
    }
}