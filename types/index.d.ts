export { userInfo };

declare global {
    interface userInfo {
        token: string,
        username: string
        email: string
        picture: string
        has_notification: boolean
    }
}