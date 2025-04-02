import classnames from "classnames";
import _ from "lodash";
import { FaPlus } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import mainSlice from "../mainSlice";
import styles from "./GuitarNeck.module.css";

const NUM_FRETS = 15;
const NUM_STRINGS = 6;
const FRETS_WITH_ONE_DOT = [3, 5, 7, 9, 15];
const FRETS_WITH_TWO_DOTS = [12];

const GuitarNeck = () => {
    const dispatch = useDispatch();
    const chordShape = useSelector((state) => state.main.chordShape);
    const onClickStringSection = (fretIndex, stringIndex) => () => {
        const oldFretIndex = chordShape[stringIndex];
        const newFretIndex = oldFretIndex === fretIndex ? -1 : fretIndex;
        dispatch(
            mainSlice.actions.updateChordShape({
                stringIndex,
                fretIndex: newFretIndex,
            }),
        );
    };
    return (
        <div className={styles.guitarNeck}>
            {_.range(NUM_FRETS + 1).map((fretIndex) => {
                return (
                    <div
                        key={`fret-${fretIndex}`}
                        className={classnames(
                            styles.fretColumn,
                            styles[`fretColumn${fretIndex}`],
                        )}
                    >
                        <div className={styles.fretLine} />
                        {_.range(NUM_STRINGS).map((stringIndex) => {
                            const pressedFretIndex = chordShape[stringIndex];
                            const isPressed = pressedFretIndex === fretIndex;
                            const isStringMuted = pressedFretIndex === -1;
                            return (
                                <div
                                    key={`string-${stringIndex}`}
                                    className={styles.stringSection}
                                    onClick={onClickStringSection(
                                        fretIndex,
                                        stringIndex,
                                    )}
                                >
                                    {fretIndex !== 0 && (
                                        <div
                                            className={styles.stringSectionLine}
                                        />
                                    )}
                                    <div
                                        className={classnames(
                                            styles.pressedStringDot,
                                            {
                                                [styles.isPressed]: isPressed,
                                            },
                                        )}
                                    />
                                    {fretIndex === 0 && isStringMuted && (
                                        <FaPlus
                                            className={styles.mutedStringX}
                                        />
                                    )}
                                    {(FRETS_WITH_ONE_DOT.includes(fretIndex) &&
                                        stringIndex === 3) ||
                                        (FRETS_WITH_TWO_DOTS.includes(
                                            fretIndex,
                                        ) &&
                                            (stringIndex === 2 ||
                                                stringIndex === 4) && (
                                                <div
                                                    className={styles.fretDot}
                                                />
                                            ))}
                                </div>
                            );
                        })}
                        <div className={styles.fretLabel}>{fretIndex}</div>
                    </div>
                );
            })}
        </div>
    );
};

export default GuitarNeck;
