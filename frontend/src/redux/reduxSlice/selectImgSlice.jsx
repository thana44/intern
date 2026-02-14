import { createSlice } from '@reduxjs/toolkit'

const selectImgSlice = createSlice({
    name: 'selectImage',
    initialState: {
        imageSelected: []
    },

    reducers: {
        addSelectImg: (state, action) => {
            state.imageSelected.push({
                id: state.imageSelected.length === 0 ? 1 : state.imageSelected[state.imageSelected.length - 1].id + 1,
                img: action.payload
            })
        },
        deleteImg: (state, action) => {
            state.imageSelected = state.imageSelected.filter((img) => img.id !== action.payload)
        }
    }
})
export const { addSelectImg, deleteImg } = selectImgSlice.actions
export default selectImgSlice.reducer