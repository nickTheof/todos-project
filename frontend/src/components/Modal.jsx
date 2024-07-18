import { useRef, useEffect } from "react";
import { createPortal } from "react-dom";


export default function Modal({open, children, onClose}){
    const dialog = useRef();

    useEffect(()=>{
        const modal = dialog.current;

        if (open){
            modal.showModal();
        }

        return () => {
            modal.close();
        }
    },[open]);


    return createPortal(
        <dialog ref={dialog} onClose={()=>onClose(false)} className={open?"flex flex-col items-center justify-center text-center gap-1 w-1/3 mt-32 rounded-md shadow-md shadow-slate-800 backdrop-blur-3xl backdrop:backdrop-opacity-100 backdrop:backdrop-saturate-150":""}>
            {children}
        </dialog>, document.getElementById('modal')
    );
}