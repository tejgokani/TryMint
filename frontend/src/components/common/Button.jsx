export default function Button({ children, ...props }) {
  return (
    <button
      {...props}
      className={`${props.className || ''} focus:outline-none focus:ring-2 focus:ring-[#00ff88] focus:ring-offset-2 focus:ring-offset-[#0a0f1a]`}
    >
      {children}
    </button>
  )
}
