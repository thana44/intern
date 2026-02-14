import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
    name: 'user',
    initialState: {
        currentUser: null
    },

    reducers: {
        setCurrentUser: (state, action) => {
            state.currentUser = action.payload.currentUser
        },
        clearCurrentUser: (state, action) => {
            state.currentUser = action.payload
        }
    }
})
export const { setCurrentUser, clearCurrentUser } = userSlice.actions
export default userSlice.reducer