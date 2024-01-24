export default function Login() {
  return (
    <form action="/auth/login" method="post" className="flex flex-col space-y-3 text-white pt-3">
      <label htmlFor="email">Email</label>
      <input name="email" className="bg-slate-900 py-1 border-2 border-blue-900 rounded-md" />
      <label htmlFor="password">Password</label>
      <input type="password" name="password" className="bg-slate-900 py-1 border-2 border-blue-900 rounded-md" />
      <button className="p-2 bg-blue-800 font-semibold rounded-md">Sign In</button>
    </form>
  )
}