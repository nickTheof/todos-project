export default function Button({ type, children,classes="w-24 ", ...props }) {
  return (
    <button
      type={type}
      {...props}
      className={`button button-primary rounded-md py-1 mt-1 bg-slate-50 hover:bg-slate-300 ${classes}`}
    >
      {children}
    </button>
  );
}
