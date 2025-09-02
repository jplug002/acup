declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      membershipStatus?: string
    }
  }

  interface User {
    membershipStatus?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    membershipStatus?: string
  }
}
