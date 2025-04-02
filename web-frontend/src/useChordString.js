import _ from "lodash";
import { useMemo } from "react";
import { useSelector } from "react-redux";

export const useChordString = () => {
    const chordShape = useSelector((state) => state.main.chordShape);
    return useMemo(() => {
        let joinChar = "";
        // for (const fretIndex of chordShape) {
        //     if (fretIndex > 9) {
        //         joinChar === "-";
        //     }
        // }
        return _.cloneDeep(chordShape)
            .map((fretIndex) => {
                if (fretIndex === -1) {
                    return "x";
                }
                return fretIndex.toString();
            })
            .reverse()
            .join(joinChar);
    }, [chordShape]);
};
