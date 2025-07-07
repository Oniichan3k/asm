import AuthForm from '@/components/AuthForm'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto space-y-6">
      <AuthForm mode="login" />
      <p className="text-center text-gray-600">
        Don't have an account?{' '}
        <Link href="/register" className="text-blue-600 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  )
}