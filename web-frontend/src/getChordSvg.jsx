import _ from "lodash";

export const getChordSvg = ({ chordShape, chordName, svgRef }) => {
    const width = 160;
    const height = 200;
    const circleSize = 0.4;
    const numStrings = 6;
    const numFrets = 6;
    const fretHeight = height / (numFrets - 1);
    const circleRadius = (width / (numStrings + 1)) * circleSize;

    // To determine startingFret:
    // * Find lowest fret index (skipping all 0 and -1 values)
    // * If that value is > 2, set that value as starting fret
    let startingFret = 0;
    let minFretIndex = 100;
    let maxFretIndex = 0;
    let fretIndices = _.cloneDeep(chordShape).reverse();
    for (const fretIndex of fretIndices) {
        if (fretIndex !== 0 && fretIndex !== -1) {
            minFretIndex = Math.min(fretIndex, minFretIndex);
        }
        maxFretIndex = Math.max(fretIndex, maxFretIndex);
    }
    if (
        minFretIndex < 100 &&
        (minFretIndex > 2 || (minFretIndex > 0 && maxFretIndex > 5))
    ) {
        startingFret = minFretIndex - 1;
    }
    fretIndices = fretIndices.map((fretIndex) => {
        if (fretIndex !== 0 && fretIndex !== -1) {
            return fretIndex - startingFret;
        }
        return fretIndex;
    });

    const hasMutedStrings = fretIndices.reduce((hasMutedStrings, fretIndex) => {
        return hasMutedStrings || fretIndex === -1;
    }, false);
    const titleHeight = hasMutedStrings ? 28 : 0;

    const title = chordName;
    let titleFontSize = 50;
    if (title.length > 6) {
        titleFontSize -= 4 * (title.length - 6);
    }

    let rightMargin = 20;
    if (startingFret > 0) {
        rightMargin = 75;
    }
    if (startingFret > 9) {
        rightMargin = 95;
    }

    const margin = {
        top: 40,
        left: 20,
        right: rightMargin,
        bottom: 60,
    };

    return (
        <svg
            ref={svgRef}
            width={width + margin.right + margin.left}
            height={height + margin.top + margin.bottom}
            xmlns="http://www.w3.org/2000/svg"
            style={{ fontFamily: "Arial, sans-serif" }}
        >
            {/* Title */}
            <text
                x={margin.left + width / 2}
                y={margin.top + 5}
                textAnchor="middle"
                fontSize={titleFontSize}
                fontWeight="bold"
            >
                {chordName}
            </text>

            {/* Starting fret text */}
            {startingFret !== 0 && (
                <text
                    x={margin.left + width + 15}
                    y={margin.top + titleHeight + fretHeight / 2 + 34}
                    textAnchor="left"
                    fontSize="40"
                    fontWeight="bold"
                >
                    {startingFret + 1}fr
                </text>
            )}

            {/* Strings */}
            {_.range(numStrings).map((index) => {
                const y1 = margin.top + titleHeight + fretHeight / 2;
                const y2 = y1 + height;
                const x1 = (width / (numStrings - 1)) * index + margin.left;
                const x2 = x1;
                return (
                    <line
                        stroke="black"
                        strokeWidth={1}
                        key={`svg-string-${index}`}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                    />
                );
            })}

            {/* Frets */}
            {_.range(numFrets).map((index) => {
                const y1 =
                    (height / (numFrets - 1)) * (index + 0.5) +
                    margin.top +
                    titleHeight;
                const y2 = y1;
                const x1 = margin.left;
                const x2 = margin.left + width;
                const strokeWidth = index === 0 ? 3 : 1;
                return (
                    <line
                        stroke="black"
                        strokeWidth={strokeWidth}
                        key={`svg-fret-${index}`}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                    />
                );
            })}

            {/* Finger dots */}
            {fretIndices.map((fretIndex, stringIndex) => {
                if (fretIndex === 0 || fretIndex === -1) {
                    return null;
                }
                return (
                    <circle
                        key={`finger-${stringIndex}`}
                        cx={
                            (width / (numStrings - 1)) * stringIndex +
                            margin.left
                        }
                        cy={
                            (height / (numFrets - 1)) * fretIndex +
                            margin.top +
                            titleHeight
                        }
                        r={circleRadius}
                        fill="black"
                    />
                );
            })}

            {/* Muted strings */}
            {fretIndices.map((fretIndex, stringIndex) => {
                if (fretIndex !== -1) {
                    return null;
                }
                return (
                    <text
                        key={`mute-${stringIndex}`}
                        x={
                            (width / (numStrings - 1)) * stringIndex +
                            margin.left
                        }
                        y={margin.top + titleHeight + 17}
                        textAnchor="middle"
                        fontSize="40"
                        fontWeight="bold"
                    >
                        ×
                    </text>
                );
            })}
        </svg>
    );
};
