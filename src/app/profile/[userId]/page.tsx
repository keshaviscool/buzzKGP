export default async function UserDetails(
    {params}: {params: Promise<{userId: string}>}
) {
    const userId = (await params).userId;
    return <h1>Details about User, with id == {userId}</h1>
}