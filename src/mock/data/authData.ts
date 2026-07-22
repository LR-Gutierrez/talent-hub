const emailDomain = import.meta.env.VITE_APP_EMAIL_DOMAIN || 'company.com'

export const signInUserData = [
    {
        id: '21',
        avatar: '',
        userName: 'John Doe',
        email: `admin-01@${emailDomain}`,
        authority: ['admin', 'user'],
        password: '123Qwe',
        accountUserName: 'admin',
    },
]
