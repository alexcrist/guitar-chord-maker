import { createSlice } from "@reduxjs/toolkit";

const mainSlice = createSlice({
    name: "main",
    initialState: {
        chordShape: [0, 0, 0, 0, 0, 0], // Index 0 = high string
    },
    reducers: {
        updateChordShape: (state, action) => {
            const { stringIndex, fretIndex } = action.payload;
            state.chordShape[stringIndex] = fretIndex;
        },
    },
});

export default mainSlice;
