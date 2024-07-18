export default function Error({title, message, classes='w-1/2'}){

    return (
        <div className={"flex flex-col text-stone-800 bg-red-400 border-2 shadow-md m-auto rounded-md text-center items-center " + classes}>
            <h2 className="bg-inherit">{title}</h2>
            <p className="bg-inherit">{message}</p>
        </div>
    )
}