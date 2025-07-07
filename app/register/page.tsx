import AuthForm from '@/components/AuthForm'
import Link from 'next/link'

export default function RegisterPage() {
  return (
    <div className="max-w-md mx-auto space-y-6">
      <AuthForm mode="register" />
      <p className="text-center text-gray-600">
        Already have an account?{' '}
        <Link href="/login" className="text-blue-600 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}