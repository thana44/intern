import { createSlice } from '@reduxjs/toolkit'

const menuSlice = createSlice({
    name: 'user',
    initialState: {
        profileMenu: false,
        notificationMenu: false,
        saveCount: 0,
        notiCount: 0
    },

    reducers: {
        openProfileMenu: (state, action) => {
            state.profileMenu = action.payload
        },
        openNotificationMenu: (state, action) => {
            state.notificationMenu = action.payload
        },
        setSaveCount: (state, action) => {
            state.saveCount = action.payload
        },
        setNotiCount: (state, action) => {
            state.notiCount = action.payload
        }
    }
})
export const { openProfileMenu, openNotificationMenu, setSaveCount, setNotiCount } = menuSlice.actions
export default menuSlice.reducer