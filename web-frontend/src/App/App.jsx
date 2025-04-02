import { Instrument } from "chordictionary";
import "chordictionary/build/chordictionary.min.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { getChordSvg } from "../getChordSvg";
import GuitarNeck from "../GuitarNeck/GuitarNeck";
import { useChordString } from "../useChordString";
import styles from "./App.module.css";

const guitar = new Instrument("EADGBE", 24, 0, 4);

const App = () => {
    // Get chord info
    const chordShape = useSelector((state) => state.main.chordShape);
    const chordString = useChordString();
    const chordInfo = useMemo(() => {
        if (chordString.length !== 6) {
            console.warn(
                "Cannot process chords beyond fret 9 (chordictionary library limitation).",
            );
            return {};
        }
        return guitar.getChordInfo(chordString);
    }, [chordString]);

    // Custom chord name
    const [customChordName, setCustomChordName] = useState("");

    // Allow user to select chord name
    const [chordNameIndex, setChordNameIndex] = useState(0);
    const chordNameValues = useMemo(() => {
        return (chordInfo?.chords ?? []).map((chord) => chord.name);
    }, [chordInfo?.chords]);
    useEffect(() => {
        setChordNameIndex(0);
        setCustomChordName("");
    }, [chordShape]);

    // Chord name
    const chordName = useMemo(() => {
        return customChordName || chordNameValues[chordNameIndex] || "";
    }, [chordNameIndex, chordNameValues, customChordName]);

    // Get chord image
    const svgRef = useRef(null);
    const chordLayout = useMemo(() => {
        return getChordSvg({ chordShape, chordName, svgRef });
    }, [chordName, chordShape]);

    const onClickDownloadImage = () => {
        const svg = svgRef.current;
        const svgData = new XMLSerializer().serializeToString(svg);
        const svgBlob = new Blob([svgData], {
            type: "image/svg+xml;charset=utf-8",
        });
        const url = URL.createObjectURL(svgBlob);

        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = svg.clientWidth;
            canvas.height = svg.clientHeight;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            canvas.toBlob((blob) => {
                const pngUrl = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = pngUrl;
                a.download = "fretboard.png";
                a.click();
                URL.revokeObjectURL(pngUrl);
            });
            URL.revokeObjectURL(url);
        };
        img.src = url;
    };

    return (
        <div className={styles.container}>
            <h1>Guitar Chord Image Creator</h1>
            <h4>
                Click on the frets below to input a chord, then download an
                image of that chord.
            </h4>
            <GuitarNeck />
            <div className={styles.controls}>
                <div className={styles.field}>
                    <div className={styles.label}>Select chord name</div>
                    <select
                        className={styles.select}
                        value={chordNameValues[chordNameIndex]}
                        onChange={(event) => {
                            const newValue = event.target.value;
                            const newIndex = chordNameValues.findIndex(
                                (value) => value === newValue,
                            );
                            setChordNameIndex(newIndex);
                        }}
                    >
                        {chordNameValues.map((value) => {
                            return (
                                <option value={value} key={value}>
                                    {value}
                                </option>
                            );
                        })}
                    </select>
                    <div className={styles.or}>or</div>
                    <div className={styles.label}>Custom chord name</div>
                    <input
                        className={styles.input}
                        value={customChordName}
                        onChange={(event) =>
                            setCustomChordName(event.target.value)
                        }
                    ></input>
                </div>
                <div className={styles.field}>
                    <div className={styles.label}>Chord image</div>
                    <button
                        onClick={onClickDownloadImage}
                        className={styles.field}
                    >
                        Download chord image
                    </button>
                    <div className={styles.svgContainer}>{chordLayout}</div>
                </div>
                <div className={styles.field}></div>
            </div>
        </div>
    );
};

export default App;
