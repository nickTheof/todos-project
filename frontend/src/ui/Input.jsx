export default function Input({label, value, onChange, type, ...props}){
    return(
        <div className="flex flex-col py-0 mx-auto items-center rounded-md bg-orange-100">
            <label className="bg-orange-100 capitalize" htmlFor={label} id={label} >
              {label}
            </label>
            <input
              className="bg-orange-100 border-2 border-slate-700"
              type={type}
              id={label}
              name={label}
              value={value}
              onChange={(event)=>onChange(event.target.value)}
              required
              {...props}
            />
          </div>
    );
}