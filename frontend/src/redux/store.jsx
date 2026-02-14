import { configureStore } from "@reduxjs/toolkit";
import selectImgSlice from './reduxSlice/selectImgSlice'
import userSlice from './reduxSlice/userSlice'
import menuSlice from './reduxSlice/menuSlice'
import reviewSlice from './reduxSlice/reviewSlice'

export const store = configureStore({
    reducer: {
        selectImg: selectImgSlice,
        user: userSlice,
        menu: menuSlice,
        review: reviewSlice
    }
})