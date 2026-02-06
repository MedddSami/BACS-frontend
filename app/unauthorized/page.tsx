import Link from "next/link"

export default function UnauthorizedPage() {
    return (
        <div className="flex flex-col items-center justify-center h-screen gap-4 p-4">
            <h1 className="text-3xl font-bold text-red-600">Access Denied</h1>
            <p className="text-center text-gray-700">
                You do not have permission to access this page.
            </p>
            <Link
                href="/dashboard"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                Go to Dashboard
            </Link>
        </div>
    )
}
