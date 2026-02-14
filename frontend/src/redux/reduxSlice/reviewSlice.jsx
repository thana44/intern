import { createSlice } from '@reduxjs/toolkit'

const reviewSlice = createSlice({
    name: 'review',
    initialState: {
        reviewData: {},
        reviewUpdated: 0
    },

    reducers: {
        getReviewData: (state, action) => {
            state.reviewData = action.payload
        },
        triggerReviewUpdate: (state) => {
            state.reviewUpdated += 1
        }
    }
})
export const { getReviewData, triggerReviewUpdate } = reviewSlice.actions
export default reviewSlice.reducer